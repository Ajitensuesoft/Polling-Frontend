import {createSlice,createAsyncThunk}from "@reduxjs/toolkit";
import { PollCreateApi, AllPollsApi,SinglePollApi,PollVoteApi,SinglePollCommentAPI } from "../../services/AllApi";
import type { RootState } from "../../app/store";
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

//here is doubt how for single multiple like poll how slice work

interface IOption{
    _id:string,
    text:string,
    votes:any,
}
export interface IPoll{
    _id:string;
    Question:string;
    Option:IOption[];
    createdBy:string
    userId:string;
    ExpiredAt:Date;
    status?:string;
}


interface PollState{
    isLoading:boolean;
    error:string|null;
    Poll:IPoll[];
}


const initialState:PollState={
    isLoading:false,
    error:null,
    Poll:[],
}


export const PollCreate=createAsyncThunk(
    "Auth/CreatePoll",
    async(payload:{Question:string,Option:{ value: string }[],createdBy:string,ExpiredAt:Date},{rejectWithValue})=>{
        try{
            const res=await PollCreateApi(payload);
            console.log("PollCreate res",res);
            return res;
        }catch(err:any){
            return rejectWithValue( err.message)
        }
    }
)


export const AllPolls=createAsyncThunk(
    "Auth/AllPolls",
    async(_,{rejectWithValue})=>{
        try{
            const res=await AllPollsApi();
            console.log("AllPolls res",res);
            return res;
        }catch(err:any){
          return rejectWithValue( err.message)
        }
    }
)


export const SinglePoll=createAsyncThunk(
    "Auth/SinglePoll",
    async(id:string,{rejectWithValue})=>{
        try{
            const res=await SinglePollApi(id);
            console.log("SinglePoll res",res);
            return res;
        }catch(err:any){
           return rejectWithValue( err)
        }
    }
)


export const PollVote=createAsyncThunk(
    "Auth/PollVote",
    async(payload:{PollId:string,OptId:string,userId:string,name:string},{rejectWithValue})=>{
        try{
            const res=await PollVoteApi(payload);
            console.log("PollVote res",res);
            return res;
        }
        catch(err:any){
            console.log("err",err);
            toast.error(err.response.data.message);
            return rejectWithValue( err)
        }
    }
)


export const SinglePollComment=createAsyncThunk(
    "Auth/SinglePollComment",
    async(id:string,{rejectWithValue})=>{
        try{
 const res=await SinglePollCommentAPI(id);
            console.log("SinglePoll res",res);
            return res;
        }
        catch(err:any){
            console.log("err",err);
            toast.error(err.response.data.message);
            return rejectWithValue( err)
        }
    }
)


const PollSlice=createSlice({
    name:"Auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(PollCreate.pending,(state)=>{
            state.isLoading=true;
            state.error=null;
        })
        .addCase(PollCreate.fulfilled, (state, action) => {
  state.isLoading = false;
  state.error = null;
  const poll = action.payload.Poll;
  console.log("poll",poll)
  state.Poll = Array.isArray(poll) ? poll : [...state.Poll, poll]; 
})
        .addCase(PollCreate.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload as string;
        }).addCase(AllPolls.pending,(state)=>{
            state.isLoading=true;
            state.error=null;
        })
        .addCase(AllPolls.fulfilled, (state, action) => {
  state.isLoading = false;
//   const polls = action.payload.Poll;
  state.Poll = state.Poll = Array.isArray(action.payload) ? action.payload : []; 
})
        .addCase(AllPolls.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload as string;
        }).addCase(SinglePoll.pending,(state)=>{
            state.isLoading=true;
            state.error=null;
        })
        .addCase(SinglePoll.fulfilled, (state, action) => {
  state.isLoading = false;
  state.Poll = Array.isArray(action.payload) ? action.payload : [];
//   state.Poll = Array.isArray(poll) ? poll : [poll]; 
})
        .addCase(SinglePoll.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload as string;
        })
        

        .addCase(PollVote.pending,(state)=>{
            state.isLoading=true;
            state.error=null;
        })
        
        .addCase(PollVote.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log("action.payloadof singlecomment",action.payload);
            state.Poll = Array.isArray(action.payload) ? action.payload : [];

        })
        .addCase(PollVote.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload as string;
        })

        
    }
})






export const selectCreatePoll=(state:RootState)=>state.poll.Poll;
export const selectPollLoading=(state:RootState)=>state.poll.isLoading;
export const selectPollError=(state:RootState)=>state.poll.error;






export default PollSlice.reducer;