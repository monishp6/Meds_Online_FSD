import React, {useState, useEffect} from 'react'
import axios from 'axios'
const API='http://localhost:4000/api'

export default function Checkout(){
  const [items,setItems] = useState([])
  useEffect(()=>{ setItems(JSON.parse(localStorage.getItem('meds_cart')||'[]')) },[])
  const placeOrder = async ()=>{
    const token = localStorage.getItem('meds_token')
    if(!token){ alert('Login required'); return }
    const res = await axios.post(API + '/orders', { items }, { headers: { Authorization: 'Bearer '+token } })
    if(res.data.ok){ alert('Order placed! total: '+res.data.total); localStorage.removeItem('meds_cart') }
  }
  return (
    <div className="page-constrained">
      <h2>Checkout</h2>
      <div>
        {items.length===0 ? <p>No items</p> : (
          <ul>{items.map((it,i)=>(<li key={i}>Medicine ID: {it.medicine_id} x {it.qty}</li>))}</ul>
        )}
        <button className="btn" onClick={placeOrder}>Place Order</button>
      </div>
    </div>
  )
}
