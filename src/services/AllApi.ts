import axios from "axios";
import type {IUSER} from "../Features/auth/authSlice"
 const API=axios.create({
     baseURL:'http://localhost:5000/app/v1',
     withCredentials:true,
})



export const signupApi = async (data: any) => {
  console.log("data of signup", data);
  try {
    const res = await API.post("/signup", data);
    console.log("Signup value", res);
    return res.data.data as {user:IUSER,token:string};
  } catch (err: any) {
    console.log("err of signup",err);
    console.log("Signup err", err.message);
    const message=err.response.data.message;
    throw new Error(message);
    
  }
};



export const loginApi=async(data:any)=>{
    try{
        const res= await API.post("/login",data);
        console.log("login value",res.data);
        return res.data.data as {user:IUSER ,token:string};
    }catch(err:any){
      console.log("err",err);
 console.log("Signup err",err.response.data.message);
 const message=err.response.data.message;
 throw new Error(message);
    }
}

export const logoutApi=async()=>{
    try{
        const res= await API.post("/logout");
        console.log("logout value",res);
        return res.data.data;
    }catch(err:any){
 console.log("Signup err",err.message);
    }
}