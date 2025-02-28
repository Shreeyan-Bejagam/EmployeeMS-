import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MDDashboard = () => {
  const navigate = useNavigate();
  const [mdEmail, setMdEmail] = useState("");
  const [notifications, setNotifications] = useState([]);

  // ✅ Fetch MD Details on Load
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/user-details", { withCredentials: true })
      .then((res) => {
        if (res.data.Status && res.data.role === "MD") {
          setMdEmail(res.data.email);

          // ✅ Save correct user_id (employee ID) in localStorage for later use
          localStorage.setItem("userId", res.data.id);

          // ✅ Fetch Notifications using correct user ID
          fetchNotifications(res.data.id);
        } else {
          navigate("/adminlogin");
        }
      })
      .catch((err) => console.error("❌ Error fetching MD details:", err));
  }, [navigate]);

  // ✅ Fetch Notifications
  const fetchNotifications = (userId) => {
    axios
      .get(`http://localhost:3000/notifications/${userId}`)
      .then((res) => {
        if (res.data.Status) {
          setNotifications(res.data.Result);
        }
      })
      .catch((err) => console.error("❌ Error fetching notifications:", err));
  };

  // ✅ Handle Notification Click
  const handleNotificationClick = (notificationId, requestId) => {
    axios
      .post(`http://localhost:3000/notifications/mark_as_read/${notificationId}`)
      .then(() => {
        navigate(`/md-dashboard/approvals?request_id=${requestId}`);
      })
      .catch((err) => console.error("❌ Error marking notification as read:", err));
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout", { withCredentials: true })
      .then(() => {
        localStorage.removeItem("adminRole");
        localStorage.removeItem("userId"); // ✅ Clear user ID on logout
        navigate("/adminlogin");
      })
      .catch((err) => console.error("❌ Logout Error:", err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 bg-dark min-vh-100">
          <div className="d-flex flex-column align-items-center text-white">
            <div className="text-center mt-2">
              <img
                src="http://localhost:3000/images/default-profile.png"
                alt="MD Profile"
                className="rounded-circle"
                style={{ width: "80px", border: "2px solid white" }}
              />
              <h5 className="mt-2">Managing Director</h5>
              <p className="text-white-50">{mdEmail || "Loading..."}</p>
              <span className="badge bg-primary">MD</span>
            </div>

            <ul className="nav flex-column mt-4">
              <li><Link to="/md-dashboard" className="nav-link text-white">Dashboard</Link></li>
              <li><Link to="/md-dashboard/departments" className="nav-link text-white">Departments</Link></li>
              <li><Link to="/md-dashboard/employees" className="nav-link text-white">Employees</Link></li>
              <li><Link to="/md-dashboard/assets" className="nav-link text-white">Assets</Link></li>
              <li><Link to="/md-dashboard/approvals" className="nav-link text-white">Approvals</Link></li>
              <li><Link to="/md-dashboard/attendance" className="nav-link text-white">Attendance</Link></li>
              <li><Link to="/md-dashboard/assetlogs" className="nav-link text-white">Asset Logs</Link></li>
              <li>
                <span className="nav-link text-white" onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col p-0">
          <div className="p-3 shadow d-flex justify-content-between align-items-center">
            <h4>MD Dashboard</h4>

            {/* 🔔 Notification Bell */}
            <div className="position-relative">
              <span className="fs-3 bi-bell text-dark"></span>
              {notifications.length > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {notifications.length}
                </span>
              )}
              <div className="position-absolute bg-white shadow rounded p-3 mt-2" style={{ minWidth: "300px" }}>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2 border-bottom"
                      onClick={() => handleNotificationClick(notif.id, notif.request_id)}
                      style={{ cursor: "pointer" }}
                    >
                      <p className="mb-1">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center">No new notifications</p>
                )}
              </div>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MDDashboard;
