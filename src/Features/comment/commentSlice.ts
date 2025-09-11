import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import { createCommentApi } from "../../services/AllApi";
import type { RootState } from "../../app/store";
import { AllcommentsApi } from "../../services/AllApi";
import { updateCommentApi,deleteCommentApi } from "../../services/AllApi";
// interface Icomment{
//   _id:string;
//     PollId:any,
//     comment:{
//       _id:string,
//         userId:string,
//         text:string
//     }
// }

export interface Icomment {
  _id?: string;
  PollId: any;
  comment: {
    _id: string;
    userId: any;
    text: string;
     createdBy: any,
    
  };
  userId: string;
  text: string;
 
}

interface IcommentState{
    comments:Icomment[],
    loading:boolean,
    error:string|null
}

const initialState: IcommentState = {
    comments: [],
    loading: false,
    error: null,
  };


  export const createComment=createAsyncThunk('comment/createComment',async(data:Icomment,thunkAPI)=>{
    try{
      const res=await createCommentApi(data);
      return res;
    }
    catch(err:any){
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  })


export const Allcommment=createAsyncThunk('comment/Allcommment',
  async(_)=>{
    try{
      const res=await AllcommentsApi();
      return res;
    }
    catch(err:any){
      return err.response.data.message;
    }
  
})


export const updateComment=createAsyncThunk('comment/updateComment',
  async(data:any,thunkAPI)=>{
    try{
      const res=await updateCommentApi(data);
      return res;
    }
    catch(err:any){
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  
})

export const deleteComment=createAsyncThunk(
  "comment/deleteComment",
  async (id: string, thunkAPI) => {
    try {
      const res = await deleteCommentApi(id);
      console.log("resofdeletecomment",res);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
)

  const CommentSlice=createSlice({
     name:"comment",
     initialState,
     reducers:{},
     extraReducers:(builder)=>{
        builder
        .addCase(createComment.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(createComment.fulfilled,(state,action)=>{
            state.loading=false;
            state.comments.push(action.payload);
        })
        .addCase(createComment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        })

        .addCase(Allcommment.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(Allcommment.fulfilled,(state,action)=>{
            state.loading=false;
            state.comments=action.payload;
        })
        .addCase(Allcommment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        })
        .addCase(updateComment.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        // .addCase(updateComment.fulfilled,(state,action)=>{
        //     state.loading=false;
        //     state.comments=action.payload;
        // })
        .addCase(updateComment.fulfilled, (state, action) => {
  state.loading = false;

  const updated = action.payload; 

  state.comments = state.comments.map((item: any) =>
    item._id === updated._id ? { ...item, ...updated } : item
  );
})
        .addCase(updateComment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        })
        
        .addCase(deleteComment.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteComment.fulfilled,(state,action)=>{
            state.loading=false;
            state.comments=state.comments.filter((comment)=>comment._id!==action.payload._id);
        })
        .addCase(deleteComment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        })
     }
  })


  export const selectComment=(state:RootState)=>state.comment.comments;
  export const selectCommentLoading=(state:RootState)=>state.comment.loading;
  export const selectCommentError=(state:RootState)=>state.comment.error;



  export default CommentSlice.reducer;