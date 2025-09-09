import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hook'
import { isAuth, Logout } from '../Features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import "./Navbar.css"
import { AllPolls } from '../Features/Poll/pollSlice'
export const Navabr: React.FC = () => {
  const dispatch = useAppDispatch();
  const aval = useAppSelector(isAuth);
const navigate=useNavigate();

  const logoutfunction=()=>{
    dispatch(Logout())
    
  }

  useEffect(() => {
    dispatch(AllPolls());
  }, [dispatch]);

  useEffect(() => {
    if(!aval){
      navigate("/login");
    }
  }, [aval]);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">MyApp</Link>
      </div>
      <div className="nav-links">
      
        {
          aval ? (
            <div>
            <button 
              className="logout-btn" 
              onClick={() => logoutfunction()}
            >
              Logout
            </button>
 <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>

            </div>
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
