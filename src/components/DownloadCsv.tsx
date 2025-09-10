import React from "react";
import axios from "axios";
import { API } from "../services/AllApi";
const DownloadCsv: React.FC = () => {
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${API}/csvdata`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "all_polls.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Download All Polls
    </button>
  );
};

export default DownloadCsv;
