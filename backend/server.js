require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Health
app.get('/', (req, res) => res.json({ ok: true }));

// Auth: register & login (simple)
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing' });
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (name,email,phone,password_hash) VALUES ($1,$2,$3,$4) RETURNING id,name,email',
    [name, email, phone, hash]
  );
  const user = result.rows[0];
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user, token });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const r = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = r.rows[0];
  if (!user) return res.status(401).json({ error: 'invalid' });
  if (!user.password_hash) return res.status(401).json({ error: 'no password set' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// Middleware to protect routes
function auth(req,res,next){
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({error:'no token'});
  const token = authHeader.split(' ')[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  }catch(e){
    res.status(401).json({error:'invalid token'});
  }
}

// Medicines
app.get('/api/medicines', async (req,res)=>{
  const r = await pool.query('SELECT * FROM medicines ORDER BY id');
  res.json(r.rows);
});

// Single medicine
app.get('/api/medicines/:id', async (req,res)=>{
  const r = await pool.query('SELECT * FROM medicines WHERE id=$1', [req.params.id]);
  if (r.rows.length===0) return res.status(404).json({error:'not found'});
  res.json(r.rows[0]);
});

// Doctors
app.get('/api/doctors', async (req,res)=>{
  const r = await pool.query('SELECT * FROM doctors ORDER BY id');
  res.json(r.rows);
});

// Appointments
app.post('/api/appointments', auth, async (req,res)=>{
  const { doctor_id, scheduled_at } = req.body;
  // mask phone in response
  const userR = await pool.query('SELECT phone FROM users WHERE id=$1', [req.userId]);
  const phone = userR.rows[0] && userR.rows[0].phone || '';
  const masked = phone ? phone.substr(0,5) + '****' + phone.substr(phone.length-1) : '';
  const r = await pool.query('INSERT INTO appointments (user_id, doctor_id, phone_mask, scheduled_at) VALUES ($1,$2,$3,$4) RETURNING id', [req.userId, doctor_id, masked, scheduled_at]);
  res.json({ ok:true, appointmentId: r.rows[0].id, phone_mask: masked });
});

// Orders
app.post('/api/orders', auth, async (req,res)=>{
  const { items } = req.body; // [{medicine_id, qty}]
  if (!Array.isArray(items) || items.length===0) return res.status(400).json({error:'no items'});
  // calculate total
  const ids = items.map(i=>i.medicine_id);
  const meds = await pool.query('SELECT id, price FROM medicines WHERE id = ANY($1::int[])', [ids]);
  let total = 0;
  const client = await pool.connect();
  try{
    await client.query('BEGIN');
    const orderRes = await client.query('INSERT INTO orders (user_id,total) VALUES ($1,$2) RETURNING id',[req.userId,0]);
    const orderId = orderRes.rows[0].id;
    for (const it of items){
      const m = meds.rows.find(x=>x.id===it.medicine_id);
      const price = m ? m.price : 0;
      total += price * (it.qty||1);
      await client.query('INSERT INTO order_items (order_id,medicine_id,qty,price) VALUES ($1,$2,$3,$4)',[orderId,it.medicine_id,it.qty||1,price]);
    }
    await client.query('UPDATE orders SET total=$1 WHERE id=$2',[total,orderId]);
    await client.query('COMMIT');
    res.json({ ok:true, orderId, total });
  }catch(e){
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({error:'server error'});
  }finally{ client.release(); }
});

app.listen(PORT, ()=>console.log('Server listening on',PORT));
