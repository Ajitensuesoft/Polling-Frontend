import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { Allcommment, deleteComment, updateComment } from "../Features/comment/commentSlice";
import { selectComment } from "../Features/comment/commentSlice";
import socket from "../socket";
interface ShowcommentProps {
  id: string;
}
const Showcomment: React.FC <ShowcommentProps>= ({id}) => {
console.log("id of signlepayload",id);
  const dispatch = useAppDispatch();
  const allcomments = useAppSelector(selectComment);
console.log("allcomments",allcomments);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [pollId, setPollId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(Allcommment());
  }, [dispatch]);

  const handleEditClick = (comment: any, pollId: string) => {
    setEditText(comment.text); 
    setEditId(comment._id);
    setEditUserId(comment.userId);
    setPollId(pollId);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editId && editUserId && pollId) {
      const payload = {
        commentId: editId,
        userId: editUserId,
        text: editText,
        pollId: pollId,
      };
      console.log("Save edited comment:", payload);

      dispatch(updateComment(payload)).then(() => {
      socket.emit("updateComment", payload);
    });


      dispatch(Allcommment());
    }

   
    setIsModalOpen(false);
    setEditText("");
    setEditId(null);
    setEditUserId(null);
    setPollId(null);
  };

const deletefuntion=(id:string)=>{
    console.log("deleteid",id);
   
       dispatch(deleteComment(id)).then(() => {
    socket.emit("deleteComment", id);
  });
   


}
let userId1 = localStorage.getItem("userId");
console.log("userId1",userId1);






useEffect(() => {
  dispatch(Allcommment()); 

  socket.on("commentAdded", (newComment:any) => {
    console.log(" Comment added via socket:", newComment);
    dispatch(Allcommment()); 
  });

  socket.on("commentUpdated", (updatedComment:any) => {
    console.log(" Comment updated via socket:", updatedComment);
    dispatch(Allcommment());
  });

  socket.on("commentDeleted", (deletedId:any) => {
    console.log(" Comment deleted via socket:", deletedId);
    dispatch(Allcommment());
  });

  return () => {
    socket.off("commentAdded");
    socket.off("commentUpdated");
    socket.off("commentDeleted");
  };
}, [dispatch]);
















  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", color: "#007bff" }}>All Comments</h2>

      {allcomments && allcomments.length > 0 ? (
        allcomments.filter((item: any) => item.PollId === id)
        .map((item: any) => (
          <div key={item._id} style={{ marginBottom: "20px" }}>
            {item.comment.map((c: any) => (
              <div
                key={c._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "15px",
                  marginBottom: "10px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "14px",
                    color: "#555",
                  }}
                >
                  <strong>{c.createdBy}</strong> wrote:
                </p>
                <p style={{ margin: "0 0 15px", fontSize: "16px" }}>{c.text}</p>

                {userId1 === c.userId && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEditClick(c, item.PollId)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => deletefuntion(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No comments found.</p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Edit Comment</h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "15px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Showcomment;
