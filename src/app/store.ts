import {configureStore} from "@reduxjs/toolkit"
import authreducer from "../Features/auth/authSlice"
import pollreducer from "../Features/Poll/pollSlice"
import commentreducer from "../Features/comment/commentSlice"
export const store=configureStore({
    reducer:{
        auth:authreducer,
        poll:pollreducer,
        comment:commentreducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
