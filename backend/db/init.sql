-- create tables
DROP TABLE IF EXISTS order_items, orders, appointments, medicines, doctors, users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  speciality TEXT,
  phone TEXT,
  bio TEXT,
  avatar TEXT
);

CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  image TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total INTEGER,
  status TEXT DEFAULT 'pending',
  placed_at TIMESTAMP DEFAULT now()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  medicine_id INTEGER REFERENCES medicines(id),
  qty INTEGER DEFAULT 1,
  price INTEGER
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  doctor_id INTEGER REFERENCES doctors(id),
  phone_mask TEXT,
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- seed sample data
INSERT INTO doctors (name, speciality, phone, bio, avatar) VALUES
('Dr. Nithin P.V', 'Pediatrician', '9886900000', 'Proficient pediatrician with 10+ years', '/images/doctor1.png');

INSERT INTO medicines (name, price, description, image) VALUES
('Paracetamol', 10, 'Used to treat mild to moderate pain', '/images/paracetamol.jpg'),
('Vitamin D Tablets', 150, 'Essential for bone strength', '/images/vitd.jpg'),
('Ibuprofen', 120, 'Pain relief and anti-inflammatory', '/images/ibuprofen.jpg');

INSERT INTO users (name, email, phone, password_hash) VALUES
('Demo User', 'demo@meds.local', '9876543210', '');
