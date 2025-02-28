import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const Approvals = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("request_id"); // Get request ID from URL
  const [requestDetails, setRequestDetails] = useState(null);
  const [status, setStatus] = useState(""); // Approve or Reject
  const [mdReason, setMdReason] = useState(""); // MD's Reason
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Asset Request Details when MD opens Approvals
  useEffect(() => {
    if (requestId) {
      axios
        .get(`http://localhost:3000/notifications/asset_request/${requestId}`)
        .then((res) => {
          if (res.data.Status) {
            setRequestDetails(res.data.Result);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching asset request:", err);
          setLoading(false);
        });
    }
  }, [requestId]);

  // ✅ Handle Approval
  const handleApproval = (decision) => {
    if (decision === "rejected" && !mdReason) {
      alert("Please provide a reason for rejection.");
      return;
    }

    axios
      .post(`http://localhost:3000/notifications/md_decision/${requestId}`, {
        status: decision,
        mdReason,
      })
      .then((res) => {
        if (res.data.Status) {
          alert(`Request ${decision} successfully.`);
          setStatus(decision);
        }
      })
      .catch((err) => console.error("❌ Error updating request:", err));
  };

  if (loading) return <p>Loading request details...</p>;

  return (
    <div className="container mt-4">
      <h3>Approval Request</h3>
      {requestDetails ? (
        <div className="card p-3">
          <p><b>Asset Name:</b> {requestDetails.asset_name}</p>
          <p><b>Reason:</b> {requestDetails.reason}</p>
          <p><b>Requested By:</b> {requestDetails.requested_by}</p>
          <p><b>Specifications:</b> {requestDetails.specifications}</p>
          <p><b>Status:</b> {requestDetails.status}</p>

          {status === "" && (
            <div>
              {/* ✅ Approve/Reject Buttons */}
              <button className="btn btn-success me-2" onClick={() => handleApproval("approved")}>
                Approve
              </button>
              <button className="btn btn-danger" onClick={() => setStatus("rejected")}>
                Reject
              </button>
            </div>
          )}

          {/* ✅ MD's Reason for Rejection */}
          {status === "rejected" && (
            <div>
              <textarea
                className="form-control mt-2"
                placeholder="Enter reason for rejection"
                value={mdReason}
                onChange={(e) => setMdReason(e.target.value)}
              ></textarea>
              <button className="btn btn-primary mt-2" onClick={() => handleApproval("rejected")}>
                Submit Rejection
              </button>
            </div>
          )}

          {status === "approved" && <p className="text-success mt-2">Request Approved ✅</p>}
          {status === "rejected" && <p className="text-danger mt-2">Request Rejected ❌</p>}
        </div>
      ) : (
        <p>No request details found.</p>
      )}
    </div>
  );
};

export default Approvals;
