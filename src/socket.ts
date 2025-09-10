
// import  io  from "socket.io-client";

// const socket = io("https://polling-frontend-pi.vercel.app"); 
// export default socket;


import  io  from "socket.io-client";
import { useEffect } from "react";
import { AllPollsApi } from "./services/AllApi";
// import { AllPolls } from "./Features/Poll/pollSlice";
// import { useAppDispatch } from "./app/hook";
// const socket = io("https://polling-backend-ivcq.onrender.com", {
//     withCredentials: true, // only if you use cookies for auth
// });




// const socket = io("https://polling-backend-ivcq.onrender.com", {
//     withCredentials: true,
// } as SocketIOClient.ConnectOpts);

// export default socket;

// const Dispatch=useAppDispatch();


const socket = io("http://localhost:5000", {
    withCredentials: true,
} as SocketIOClient.ConnectOpts);







export default socket;



