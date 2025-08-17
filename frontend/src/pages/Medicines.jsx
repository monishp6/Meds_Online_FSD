import React, {useEffect, useState} from 'react'
import axios from 'axios'

const API = 'http://localhost:4000/api'

function MedicineCard({m,onBuy}){
  return (
    <div className="medicine-card">
      <img src={m.image || '/images/default_medicine.png'} alt={m.name} />
      <div className="card-body">
        <h3>{m.name}</h3>
        <p className="price">{m.price} Rs./Pack</p>
        <p className="desc">{m.description}</p>
        <button className="btn" onClick={()=>onBuy(m)}>BUY NOW</button>
      </div>
    </div>
  )
}

export default function Medicines(){
  const [meds,setMeds] = useState([])
  useEffect(()=>{ axios.get(API + '/medicines').then(r=>setMeds(r.data)) },[])
  const onBuy = (m)=>{
    // store a very small cart in localStorage
    const cart = JSON.parse(localStorage.getItem('meds_cart')||'[]')
    cart.push({medicine_id:m.id, qty:1})
    localStorage.setItem('meds_cart', JSON.stringify(cart))
    alert('Added to cart: '+m.name)
  }
  return (
    <div className="page-constrained">
      <h2>Medicines</h2>
      <div className="med-list">
        {meds.map(m=> <MedicineCard key={m.id} m={m} onBuy={onBuy} />)}
      </div>
    </div>
  )
}
