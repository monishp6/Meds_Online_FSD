import React, {useEffect, useState} from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Home from './pages/Home'
import Medicines from './pages/Medicines'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Checkout from './pages/Checkout'

const API = import.meta.env.VITE_API || 'http://localhost:4000/api'

function Header({user, onLogout}){
  return (
    <header className="topbar">
      <div className="brand">MEDS ONLINE</div>
      <nav>
        <Link to="/">HOME</Link>
        <Link to="/medicines">MEDICINE</Link>
        <Link to="/doctors">DOCTORS</Link>
      </nav>
      <div className="actions">
        {user ? <button className="pill" onClick={onLogout}>LOGOUT</button> : <Link className="pill" to="/login">LOGIN</Link>}
      </div>
    </header>
  )
}

export default function App(){
  const [user,setUser] = useState(null)
  const navigate = useNavigate()
  useEffect(()=>{
    const raw = localStorage.getItem('meds_user')
    if(raw) setUser(JSON.parse(raw))
  },[])
  const onLogout = ()=>{ localStorage.removeItem('meds_token'); localStorage.removeItem('meds_user'); setUser(null); navigate('/') }
  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/medicines' element={<Medicines />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/login' element={<Login onLogin={u=>{setUser(u); navigate('/')}} />} />
          <Route path='/checkout' element={<Checkout />} />
        </Routes>
      </main>
      <footer className="footer">medsonline.com | MONISH P | NITHIN KOUSHIK PV</footer>
    </div>
  )
}
