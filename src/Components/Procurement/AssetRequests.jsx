import React, { useEffect, useState } from "react";
import axios from "axios";

const AssetRequests = ({ roleId }) => {
  const [requests, setRequests] = useState([]);

  // ✅ Fetch Asset Requests
  useEffect(() => {
    axios
      .get(`http://localhost:3000/notifications/fetch_notifications/${roleId}`)
      .then((response) => {
        if (response.data.Status) {
          setRequests(response.data.Result);
        }
      })
      .catch((err) => console.error("❌ Error fetching asset requests:", err));
  }, [roleId]);

  return (
    <div className="container mt-4">
      <h2>Asset Requests</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Message</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td>{request.request_id}</td>
                <td>{request.message}</td>
                <td>{request.status}</td>
                <td>{new Date(request.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No asset requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetRequests;
