import axios from "axios";
import type { IUSER } from "../Features/auth/authSlice"
import type { IPoll } from '../Features/Poll/pollSlice';
import { toast } from "react-toastify";
const API = axios.create({
    // baseURL: 'http://localhost:5000/app/v1',
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log("token",token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupApi = async (data: any) => {
    console.log("data of signup", data);
    try {
        const res = await API.post("/signup", data);
        console.log("Signup value", res);
        return res.data.data as { user: IUSER, token: string };
    } catch (err: any) {
        console.log("err of signup", err);
        console.log("Signup err", err.message);
        toast.error(err.response.data.message);
        const message = err.response.data.message;
        throw new Error(message);

    }
};



export const loginApi = async (data: any) => {
    try {
        const res = await API.post("/login", data);
        console.log("login value", res.data);
        return res.data.data as { user: IUSER, token: string };
    } catch (err: any) {
        console.log("err", err);
        toast.error(err.response.data.message);
        console.log("Signup err", err.response.data.message);
        const message = err.response.data.message;
        throw new Error(message);
    }
}

export const logoutApi = async () => {
    try {
        const res = await API.post("/logout");
        console.log("logout value", res);
        return res.data.data;
    } catch (err: any) {
        toast.error(err.response.data.message);
        console.log("Signup err", err.message);
    }
}






export const PollCreateApi = async (data: any) => {
            // let token= localStorage.getItem("token");
    try {
        const res = await API.post(`/pollCreate`, data);
        console.log("poll create value", res);
        return res.data.data as { Poll: IPoll };
    } catch (err: any) {
        toast.error(err.response.data.message);
        console.log("CREATED POLL ERR", err);
        const message = err.response.data.message;
        throw new Error(message);
    }
}


export const AllPollsApi = async () => {
    try {
        const res = await API.get("/allPolls");
        console.log("allpolls value", res);
        return res.data.data as { Poll: IPoll };
    } catch (err: any) {
        toast.error(err.response.data.message);
        console.log("Signup err", err.message);
        const message = err.response.data.message;
        throw new Error(message);
    }
}


export const SinglePollApi = async (id: string) => {
    try {
        const res = await API.get(`/singlePoll/${id}`);
        console.log("singlepoll value", res);
        return res.data.data as { Poll: IPoll };
    } catch (err: any) {
        toast.error(err.response.data.message);
        console.log("Signup err", err.message);
        const message = err?.response?.data?.message;
        throw new Error(message);
    }
}



export const PollVoteApi = async (data: any) => {
    let token= localStorage.getItem("token");
    console.log("token",token);
    try {
        const res = await API.post(`/votePoll`, data);
        console.log("poll vote value", res);
        return res.data.data;
    } catch (err: any) {
        toast.error(err.response.data.message);
        console.log("err", err);
        console.log("vote Api", err.response.data.message);
        const message = err.response?.data?.message;
        throw message;
        // throw new Error(message);
    }
}