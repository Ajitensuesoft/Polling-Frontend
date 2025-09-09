// import React, { useState, useEffect } from 'react';
// import { useAppSelector, useAppDispatch } from '../app/hook';
// import { selectAuthUser } from "../Features/auth/authSlice";
// import CPollPage from './CPollPage';
// import { selectCreatePoll, SinglePoll, PollVote } from '../Features/Poll/pollSlice';

// export const Profile: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const [showPoll, setShowPoll] = useState(false);
//   const user = useAppSelector(selectAuthUser);
//   const id = user?.id ?? "";

//   useEffect(() => {
//     if (id) dispatch(SinglePoll(id));
//   }, [dispatch, id]);

//   const pollData = useAppSelector(selectCreatePoll);
//   console.log("pollData", pollData);


//   const [hoveredOptId, setHoveredOptId] = useState<string | null>(null);


//   const [selectedOptions, setSelectedOptions] = useState<{ [pollId: string]: string | null }>({});

//   const voterdata = (PollId: string, OptId: string, userId: string) => {
//     console.log("data1", PollId, OptId, userId);
//     const data = { PollId, OptId, userId };
//     dispatch(PollVote(data));


//     setSelectedOptions((prev) => ({
//       ...prev,
//       [PollId]: prev[PollId] === OptId ? null : OptId, 
//     }));
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h1 style={{ color: "#333" }}>Welcome, {user?.name}</h1>

//       {showPoll ? (
//         <CPollPage setShowPoll={setShowPoll} />
//       ) : (
//         <button
//           onClick={() => setShowPoll(true)}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginBottom: "20px"
//           }}
//         >
//           Create Poll
//         </button>
//       )}

//       {/* Poll Cards */}
//       <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
//         {pollData && pollData.length > 0 ? (
//           pollData.map((poll) => (
//             <div
//               key={poll._id}
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "10px",
//                 boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//                 padding: "20px",
//                 width: "300px",
//               }}
//             >
//               <p style={{ fontSize: "14px", color: "#555", marginBottom: "5px" }}>
//                 <strong>Created By:</strong> {poll.createdBy}
//               </p>
//               <h2 style={{ fontSize: "18px", color: "#007bff", marginBottom: "10px" }}>
//                 {poll.Question}
//               </h2>
//               <ul style={{ listStyle: "none", padding: 0 }}>
//                 {poll.Option?.map((opt) => {
//                   const isSelected = selectedOptions[poll._id] === opt._id;
//                   return (
//                     <li
//                       key={opt._id}
//                       style={{
//                         position: "relative",
//                         backgroundColor: isSelected ? "#28a745" : "#f1f1f1", // green if selected
//                         color: isSelected ? "#fff" : "#000",
//                         margin: "5px 0",
//                         padding: "8px 12px",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                         transition: "background-color 0.3s ease",
//                       }}
//                       onMouseEnter={() => setHoveredOptId(opt._id)}
//                       onMouseLeave={() => setHoveredOptId(null)}
//                       onClick={() => voterdata(poll._id, opt._id, poll.userId)}
//                     >
//                       {opt.text}

//                       {/* Tooltip */}
//                       {hoveredOptId === opt._id && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             left: "105%",
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             backgroundColor: "#333",
//                             color: "#fff",
//                             padding: "5px 10px",
//                             borderRadius: "5px",
//                             fontSize: "12px",
//                             whiteSpace: "nowrap",
//                             zIndex: 100,
//                           }}
//                         >
//                           Votes: {opt.votes?.length || 0}
//                           {opt.votes && opt.votes.length > 0 && (
//                             <div style={{ marginTop: "4px" }}>
//                               {opt.votes.map((voterId: string) => (
//                                 <div key={voterId}>{voterId}</div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           ))
//         ) : (
//           <p>No polls available</p>
//         )}
//       </div>
//     </div>
//   );
// };














import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { selectAuthUser } from "../Features/auth/authSlice";
import CPollPage from "./CPollPage";
import {
  selectCreatePoll,
  SinglePoll,
  PollVote,
  selectPollError,
  AllPolls,
} from "../Features/Poll/pollSlice";
import socket from "../socket";
export const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showPoll, setShowPoll] = useState(false);
  const user = useAppSelector(selectAuthUser);
  const id = user?.id ?? "";
  const pollData = useAppSelector(selectCreatePoll);
  const [hoveredOptId, setHoveredOptId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [pollId: string]: string | null;
  }>({});
  const error = useAppSelector(selectPollError);
  useEffect(() => {
    if (id) {
      dispatch(SinglePoll(id));
    }
    socket.on("voteUpdate", () => {
      console.log(":arrows_anticlockwise: Profile received live vote update");
      if (id) {
        dispatch(SinglePoll(id));
      }
    });
    return () => {
      socket.off("voteUpdate");
    };
  }, [dispatch, id]);
  const voterdata = async (PollId: string, OptId: string, userId: string) => {
    let name = user?.name;
    if (!name) {
      return "User name is required";
    }
    const data = { PollId, OptId, userId, name };
    try {
      await dispatch(PollVote(data)).unwrap();
      socket.emit("vote", data);
      setSelectedOptions((prev) => ({
        ...prev,
        [PollId]: OptId,
      }));
      dispatch(AllPolls());
    } catch (err: any) {
      console.error("Vote failed:", err);
      alert( "You already voted for this poll");
    }
  };
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333" }}>Welcome, {user?.name}</h1>
      {showPoll ? (
        <CPollPage setShowPoll={setShowPoll} />
      ) : (
        <button
          onClick={() => setShowPoll(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Create Poll
        </button>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {pollData && pollData.length > 0 ? (
          pollData.map((poll) => {
            const totalVotes =
              poll.Option?.reduce(
                (acc, opt) => acc + (opt.votes?.length || 0),
                0
              ) || 0;
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
                <p
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    marginBottom: "5px",
                  }}
                >
                  <strong>Created By:</strong> {poll.createdBy}
                </p>
                <h2
                  style={{
                    fontSize: "18px",
                    color: "#007BFF",
                    marginBottom: "10px",
                  }}
                >
                  {poll.Question}
                </h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {poll.Option?.map((opt) => {
                    const isSelected = selectedOptions[poll._id] === opt._id;
                    const percentage = totalVotes
                      ? Math.round((opt.votes.length / totalVotes) * 100)
                      : 0;
                    return (
                      <li
                        key={opt._id}
                        style={{
                          position: "relative",
                          backgroundColor: isSelected ? "#28A745" : "#F1F1F1",
                          color: isSelected ? "#fff" : "#000",
                          margin: "10px 0",
                          padding: "8px 12px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={() => setHoveredOptId(opt._id)}
                        onMouseLeave={() => setHoveredOptId(null)}
                        onClick={() => voterdata(poll._id, opt._id, poll.userId)}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                          }}
                        >
                          <span>{opt.text}</span>
                          <span>{percentage}%</span>
                        </div>
                        {/* Progress bar */}
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
                              backgroundColor: "#007BFF",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                        {/* Tooltip with voters */}
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
                            Votes: {opt.votes?.length || 0}
                            {opt.votes.map((voter: any) => (
                              <div key={voter.userId}>
                                {voter.name} ({voter.userId})
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p style={{ color: "red" }}>{error}</p>
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