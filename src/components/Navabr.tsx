import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hook'
import { isAuth, Logout } from '../Features/auth/authSlice'
import "./Navbar.css"
export const Navabr: React.FC = () => {
  const dispatch = useAppDispatch();
  const aval = useAppSelector(isAuth);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">MyApp</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        {
          aval ? (
            <button 
              className="logout-btn" 
              onClick={() => dispatch(Logout())}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )
        }
      </div>
    </nav>
  )
}
