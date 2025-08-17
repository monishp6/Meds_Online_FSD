import React, {useState} from 'react'
import axios from 'axios'

const API='http://localhost:4000/api'

export default function Login({onLogin}){
  const [email,setEmail] = useState('demo@meds.local')
  const [password,setPassword] = useState('')
  const doLogin = async ()=>{
    try{
      const r = await axios.post(API + '/login', { email, password })
      localStorage.setItem('meds_token', r.data.token)
      localStorage.setItem('meds_user', JSON.stringify(r.data.user))
      onLogin && onLogin(r.data.user)
      alert('Logged in')
    }catch(e){ alert('Login failed') }
  }
  return (
    <div className="page-constrained">
      <h2>Login</h2>
      <div className="login-grid">
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div />
        <button className="btn" onClick={doLogin}>Login</button>
      </div>
      <p className="muted">Use the demo user or register from the backend endpoint.</p>
    </div>
  )
}
