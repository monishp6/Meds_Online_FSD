import React, {useEffect, useState} from 'react'
import axios from 'axios'

const API='http://localhost:4000/api'

export default function Doctors(){
  const [doctors,setDoctors] = useState([])
  useEffect(()=>{ axios.get(API+'/doctors').then(r=>setDoctors(r.data)) },[])
  const onAppointment = async (doc)=>{
    const token = localStorage.getItem('meds_token')
    if(!token){ alert('Please login first'); return }
    // basic flow: ask server to make appointment (time now)
    const res = await axios.post(API+'/appointments', { doctor_id: doc.id, scheduled_at: new Date().toISOString() }, { headers: { Authorization: 'Bearer '+token } })
    if(res.data.ok){ alert(`Your appointment with ${doc.name} is confirmed. Please contact ${res.data.phone_mask} to confirm the timings.`) }
  }
  return (
    <div className="page-constrained">
      <h2>Doctors</h2>
      <div className="doctor-list">
        {doctors.map(d=> (
          <div key={d.id} className="doctor-card">
            <img src={d.avatar || '/images/doctor1.png'} alt={d.name} />
            <h3>{d.name}</h3>
            <p className="muted">{d.speciality}</p>
            <p>{d.bio}</p>
            <button className="btn" onClick={()=>onAppointment(d)}>MAKE APPOINTMENT</button>
          </div>
        ))}
      </div>
    </div>
  )
}
