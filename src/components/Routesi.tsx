import React from 'react'
import {Route,Routes} from "react-router-dom"
import { Home } from '../pages/Home'
import { Logini } from '../pages/Login'
import { Signupi } from '../pages/Signup'
import { Profile } from '../pages/Profile'
import { Navabr } from './Navabr'
import Comments from '../pages/Comments'
export const Routesi:React.FC = () => {
  return (
    <div>
<Navabr/>
<Routes>
   <Route path="/login"  element={<Logini/>}/>
  <Route path="/"  element={<Home/>}/>
    <Route path="/signup"  element={<Signupi/>}/>
     <Route path="/profile"  element={<Profile/>}/>
     <Route path="/comments/:id"  element={<Comments/>}/>
</Routes>
    </div>
  )
}
