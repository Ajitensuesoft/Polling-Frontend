import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { SinglePollComment } from "../Features/Poll/pollSlice";
import { selectCreatePoll } from "../Features/Poll/pollSlice";
import CommentBox from "./CommentBox";
import Showcomment from "./Showcomment";

const Comments: React.FC = () => {
  const dispatch = useAppDispatch();
  const pollData = useAppSelector(selectCreatePoll);
  console.log("polldata",pollData);
  const { id } = useParams<{ id: string }>();
console.log("id",id);
  // useEffect(() => {
  //   if (id) {
  //     dispatch(SinglePollComment(id));
  //   }
  // }, [dispatch, id]);

  
  const pollsingle = pollData.find((p) => p._id === id);
  console.log("pollsingledata",pollsingle);

  if (!pollsingle) {
    return <p>Loading poll...</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          padding: "20px",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ color: "#007bff", marginBottom: "10px" }}>{pollsingle.Question}</h2>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
          Created by: <strong>{pollsingle.createdBy}</strong> | Created at:{" "}
         
        </p>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {pollsingle.Option?.map((opt, index) => (
            <li
              key={index}
              style={{
                backgroundColor: "#f1f1f1",
                padding: "8px 12px",
                borderRadius: "5px",
                marginBottom: "8px",
              }}
            >
              {opt.text}
            </li>
          ))}
        </ul>
      </div>
      {/* <CommentBox pollsingl={pollsingle} /> */}
      <CommentBox pollsingl={pollsingle} _id={pollsingle._id} userId={pollsingle.userId} />
      <Showcomment id={id ?? ''}/>

    </div>
  );
};

export default Comments;
