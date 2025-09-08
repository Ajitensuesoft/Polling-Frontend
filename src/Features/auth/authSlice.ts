import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

import  {signupApi,loginApi,logoutApi} from "../../services/AllApi";
import type{ RootState } from "../../app/store";
export interface IUSER{
id:string,
name:string,
email:string
}

interface IAUTH{
    user:IUSER|null,
    token:string|null,
    isLoading:boolean,
    isAuth:boolean,
    error:string|null
}


const tokenFromStorage = localStorage.getItem("token");
const userIdFromStorage = localStorage.getItem("userId");
// const userFromStorage=localStorage.getItem("user");
// console.log("userFromStorage",userFromStorage);
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)   // ✅ parse JSON back into object
  : null;
const initialState:IAUTH={
    user:userFromStorage,
    token:tokenFromStorage,
    isLoading:false,
    isAuth:!!userIdFromStorage,
    error:null,
}

// interface AuthResponse{
//     user:IUSER,
//     token:string,
// }

export const Signup=createAsyncThunk
(
"auth/Signup",
async(payload:{name:string,email:string,password:string},{rejectWithValue})=>{
    try{
        const res=await signupApi(payload);
        console.log("res of thunk signup",res);
        return res ;
    }
    catch(err:any){
return  rejectWithValue(err.response?.data?.message|| err.message)
    }
}
)



export const Login=createAsyncThunk(
    "auth/Login",
    async(payload:{email:string,password:string},{rejectWithValue})=>{

        try{
            const res=await loginApi(payload);
            console.log("res of login",res);
            return res;
        }catch(err:any){
            // console.log("errorof not having right password",err)
            return rejectWithValue( err.message)
        }
    }

)





export const Logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      let res=await logoutApi();
      console.log("res of logout",res)
      return res;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);





const slice=createSlice({
    name:"auth",
    initialState,
    reducers:{

    },

    extraReducers(builder){
        builder
        .addCase(Signup.pending,(s)=>{s.isLoading=true;s.error=null})
        .addCase(Signup.fulfilled, (s, action) => {
            console.log("actionpayload",action.payload.user);
            s.isLoading = false;
            s.user = action.payload.user;
            s.token = null;
        })
        .addCase(Signup.rejected, (s, action) => { s.isLoading = false; s.error = action.payload as string || null; })

        .addCase(Login.pending,(s)=>{s.isLoading=true,s.error=null})
        .addCase(Login.fulfilled,(s,action)=>{
            s.isLoading=false,
            s.isAuth=true,
            s.token=action.payload.token,
            s.user=action.payload.user,
            localStorage.setItem("token",action.payload.token);
           localStorage.setItem("userId",action.payload.user.id);
            localStorage.setItem("user",JSON.stringify(action.payload.user));
        })
        .addCase(Login.rejected, (s, action) => { s.isLoading = false; s.error = action.payload as string || null; })

        .addCase(Logout.pending,(s)=>{s.isLoading=true,s.error=null})
         .addCase(Logout.fulfilled,(s)=>{s.isLoading=false,s.isAuth=false,s.token=null,s.user=null,localStorage.removeItem("token");
localStorage.removeItem("userId");
localStorage.removeItem("user");
})
          .addCase(Logout.rejected, (s, action) => { s.isLoading = false; s.error = action.payload as string || null; })
    }
})



export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const isAuth = (state: RootState) => state.auth.isAuth;
export default slice.reducer;





