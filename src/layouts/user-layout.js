import React from 'react'
import { Outlet } from "react-router-dom";
import NavBar from '../components/userNavBar';

export default function Userlayout() {
  return (
    <div>
            <NavBar/>
            <Outlet/>
    </div>
  )
}
