import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Allcommment, createComment } from "../Features/comment/commentSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { selectAuthUser } from "../Features/auth/authSlice";
import socket from "../socket";
import type{Icomment}  from "../Features/comment/commentSlice";
interface CommentFormValues {
  comment: string;
}

// interface Ipayload{
//     PollId: any;
//     comment: {
//         userId: string | null;
//         text: any;
//         createdBy: string | undefined;
//     };
// }

interface Ipollsingl{
    _id:string;
    userId:string;
    pollsingl:any
}

const CommentBox: React.FC<Ipollsingl> = ({pollsingl}) => {
    const dispatch=useAppDispatch();
     const user = useAppSelector(selectAuthUser);
    console.log("pollsingle",pollsingl._id);
    let id=pollsingl._id;
    // let userId:string=pollsingl.userId;
    let userId=localStorage.getItem("userId");
    console.log("singlecomment",id,userId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>();

  const submit=(data:any)=>{
    console.log("submit",data);
 
    const payload: any={
        PollId:id,
        comment:{
            userId:userId,
            text:data.comment,
            createdBy:user?.name ,
        }
    }
    console.log("payload",payload);



    dispatch(createComment(payload)).then(()=>{
      socket.emit("newComment", payload);
    });
    

    reset()
    
  }

  useEffect(() => {
    socket.on("commentAdded", () => {
      dispatch(Allcommment());
    })
    return () => {
    socket.off("commentAdded");
    
  };
  }, [dispatch]);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <form onSubmit={handleSubmit(submit)}>
        <textarea
          {...register("comment", { required: "Comment cannot be empty" })}
          placeholder="Write your comment..."
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            resize: "none",
            fontSize: "14px",
            marginBottom: "5px",
            outline: "none",
          }}
        />
        {errors.comment && (
          <p style={{ color: "red", fontSize: "12px", marginBottom: "5px" }}>
            {errors.comment.message}
          </p>
        )}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
        >
          Create Comment
        </button>
      </form>
    </div>
  );
};

export default CommentBox;
