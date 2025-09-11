import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { AllPolls, selectCreatePoll, PollVote } from "../Features/Poll/pollSlice";
import { selectAuthUser } from "../Features/auth/authSlice";
import socket from "../socket";
import { selectPollError } from "../Features/Poll/pollSlice";
import DownloadCsv from "../components/DownloadCsv";
import { selectComment } from "../Features/comment/commentSlice";
import { Allcommment } from "../Features/comment/commentSlice";
export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const alldata = useAppSelector(selectCreatePoll);
  const user = useAppSelector(selectAuthUser);
  const [hoveredOptId, setHoveredOptId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [pollId: string]: string | null }>({});
const allcomments = useAppSelector(selectComment);



useEffect(()=>{
  dispatch(Allcommment());
},[dispatch])


console.log("allcomments",allcomments);
  useEffect(() => {

    dispatch(AllPolls());


    socket.on("voteUpdate", () => {
      dispatch(AllPolls());
    });

    return () => {
      socket.off("voteUpdate");
    };
  }, [dispatch]);
  const error = useAppSelector(selectPollError);
  console.log("error", error);

  
 const voterdata = async (PollId: string, OptId: string, userId: string) => {
  let name = user?.name;
  if (!name) {
    throw new Error("User name is required");
  }
  const data = { PollId, OptId, userId, name };
  try {
    const resultAction = await dispatch(PollVote(data)).unwrap();
console.log("resultAction",resultAction);
    socket.emit("vote", data);
    setSelectedOptions((prev) => ({
      ...prev,
      [PollId]: OptId,
    }));
  } catch (err: any) {
    console.error("Vote failed:", err);
    alert( "You already voted for this poll");
  }
};


useEffect(() => {
  socket.on("polls-closed", () => {
    dispatch(AllPolls());
  });
}, []);
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333", marginBottom: "20px" }}>All Polls</h1>
      
<DownloadCsv/>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {alldata && alldata.length > 0 ? (
          alldata.map((poll) => {

            const totalVotes = poll.Option?.reduce((acc, opt) => acc + (opt.votes?.length || 0), 0) || 0;
           const Totalcomments=allcomments?.filter((comm) => comm.PollId === poll._id).length;
            return (
              <div
                key={poll._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "20px",
                  width: "300px",
                }}
              >
                <p style={{ fontSize: "14px", color: "#555", marginBottom: "5px" }}>
                  <strong>Created By:</strong> {poll.createdBy}
                  &nbsp; &nbsp;

                </p>
                <h2 style={{ fontSize: "18px", color: "#007bff", marginBottom: "10px" }}>
                  {poll.Question}
                </h2>

                <ul style={{ listStyle: "none", padding: 0 }}>
                  {poll.Option?.map((opt) => {
                    const isSelected = selectedOptions[poll._id] === opt._id;
                    const percentage = totalVotes ? Math.round((opt.votes.length / totalVotes) * 100) : 0;

                    return (
                     <li
  key={opt._id}
  style={{
    position: "relative",
    backgroundColor: isSelected ? "#28a745" : "#f1f1f1",
    color: isSelected ? "#fff" : "#000",
    margin: "10px 0",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: poll.status === "closed" ? "not-allowed" : "pointer",
    opacity: poll.status === "closed" ? 0.6 : 1, 
    transition: "background-color 0.3s ease",
  }}
  onMouseEnter={() => setHoveredOptId(opt._id)}
  onMouseLeave={() => setHoveredOptId(null)}
  onClick={() => {
    if (poll.status === "closed") return;
    voterdata(poll._id, opt._id, poll.userId);
  }}
>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>{opt.text}</span>
                          <span>{percentage}%</span>
                        </div>


                        <div
                          style={{
                            height: "10px",
                            width: "100%",
                            backgroundColor: "#ddd",
                            borderRadius: "5px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: "100%",
                              backgroundColor: "#007bff",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>


                        {hoveredOptId === opt._id && opt.votes.length > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              left: "105%",
                              top: "50%",
                              transform: "translateY(-50%)",
                              backgroundColor: "#333",
                              color: "#fff",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                              zIndex: 100,
                            }}
                          >
                            votes: {opt.votes?.length || 0}


                            {opt.votes.map((voter:any) => (
                              <div key={voter.userId}>
                                {voter.name} ({voter.userId})
                              </div>
                            ))}
                          </div>
                        )}

                        {poll.status === "closed" && (
  <p style={{ color: "red", fontWeight: "bold" }}>Poll Closed</p>
)}


                        <p>{error}</p>
                      </li>
                    );
                  })}
                </ul>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <a href={`/comments/${poll._id}`}>see Comments</a>
<p>Total Comments:{Totalcomments}</p>
                </div>

              </div>
            );
          })
        ) : (
          <p>No polls available</p>
        )}
      </div>
    </div>
  );
};
