import React from 'react'
import { useForm } from "react-hook-form";
import { selectAuthError, Signup } from '../Features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // 👈 import css

interface ISIGNUP {
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
}

export const Signupi: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { register, reset, watch, handleSubmit, formState: { errors } } = useForm<ISIGNUP>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const password = watch("password");
const error=useAppSelector(selectAuthError);
console.log("error",error);




  const submit = async (data: ISIGNUP) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    await dispatch(Signup(payload)).unwrap();
    
      navigate("/login")       
    
    reset();
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit(submit)}>
        <h2 className="form-title">Signup</h2>

        <label htmlFor="name">Name</label>
        <input type="text" placeholder="Enter your name"
          {...register("name", { required: "Name is required" })}
        />
        <p className="error">{errors.name?.message}</p>

        <label htmlFor="email">Email</label>
        <input type="email" placeholder="Enter your email"
          {...register("email", { required: "Email is required" })}
        />
        <p className="error">{errors.email?.message}</p>

        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Enter your password"
          {...register("password", { required: "Password is required" })}
        />
        <p className="error">{errors.password?.message}</p>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" placeholder="Confirm your password"
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) => value === password || "Passwords must match"
          })}
        />
        <p className="error">{errors.confirmPassword?.message}</p>
       <p>{error}</p>
        <button type='submit' className="btn-submit">Signup</button>
      </form>
    </div>
  )
}
