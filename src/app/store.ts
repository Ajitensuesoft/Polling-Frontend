import {configureStore} from "@reduxjs/toolkit"
import authreducer from "../Features/auth/authSlice"
import pollreducer from "../Features/Poll/pollSlice"
export const store=configureStore({
    reducer:{
        auth:authreducer,
        poll:pollreducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
