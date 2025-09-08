import React from 'react'
import { useAppSelector } from '../app/hook'
import {selectAuthUser} from "../Features/auth/authSlice"
export const Profile:React.FC = () => {

  const user=useAppSelector(selectAuthUser);
  console.log(user);
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
    </div>
  )
}
