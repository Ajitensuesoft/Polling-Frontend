import React from 'react'
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from '../app/hook';
import { Login, selectAuthError, selectAuthToken, selectAuthUser,isAuth } from '../Features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Login.css';  // 👈 import CSS

interface ILOG {
  email: string,
  password: string,
}

export const Logini: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
const isAuths=useAppSelector(isAuth);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ILOG>({
    defaultValues: {
      email: "",
      password: "",
    }
  });

   useEffect(() => {
    if (isAuths) {
      navigate("/profile");
    }
  }, [isAuths, navigate]);

 

  const submit = (data: ILOG) => {
   dispatch(Login(data)); 
  
    reset();
  }

  const user = useAppSelector(selectAuthUser);
  const token = useAppSelector(selectAuthToken);
  const error=useAppSelector(selectAuthError);
  console.log("error during ",error);
  console.log("i got it data", user, token);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(submit)}>
        <h2 className="form-title">Login</h2>

        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Enter your email"
          {...register("email", { required: "Email is required" })}
        />
        <p className="error">{errors.email?.message}</p>

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          {...register("password", { required: "Password is required" })}
        />
        <p className="error">{errors.password?.message}</p>

<p>{error}</p>
        <button type='submit' className="btn-submit">Login</button>

      </form>
    </div>
  )
}
