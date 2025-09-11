

import { API } from "../services/AllApi";
const DownloadCsv: React.FC = () => {
  const handleDownload = async () => {
    try {
      const response = await API.get("/csvdata")
      console.log("response",response);
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
      style={{marginTop:"10px"}}
    >
      Download All Polls
    </button>
  );
};

export default DownloadCsv;
