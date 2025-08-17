import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="hero">
      <div className="hero-left">
        <h1>WELCOME TO MEDSONLINE!!!</h1>
        <p className="lead">The fastest medicine delivery website in your neighbourhood.<br/>Please login to continue.</p>
      </div>
      <div className="hero-right">
        <div className="login-card">
          <h2>Login</h2>
          <p className="muted">Please login from the top-right or use demo credentials</p>
          <Link to="/medicines" className="btn">Shop Now</Link>
        </div>
      </div>
    </div>
  )
}
