import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false); // For sliding panel

  // ✅ Fetch Notifications on Load
  useEffect(() => {
    axios
      .get("http://localhost:3000/notifications/user/33") // Assuming user_id for Finance TL is 33
      .then((res) => {
        if (res.data.Status) {
          setNotifications(res.data.Result);
        }
      })
      .catch((err) => console.error("❌ Error fetching notifications:", err));
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    axios
      .get("http://localhost:3002/admin/logout", { withCredentials: true })
      .then(() => {
        localStorage.removeItem("userRole"); // ✅ Remove Role
        navigate("/adminlogin"); // ✅ Redirect to Login
      })
      .catch((err) => console.error("❌ Logout Error:", err));
  };

  // ✅ Mark Notification as Read & Redirect
  const handleNotificationClick = (notificationId, requestId) => {
    axios
      .post(`http://localhost:3000/notifications/mark_as_read/${notificationId}`)
      .then(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId)); // Remove from UI
        navigate(`/finance-dashboard/asset-requests?request_id=${requestId}`); // Redirect to Asset Requests
      })
      .catch((err) => console.error("❌ Error marking notification as read:", err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* ✅ Sidebar (Fixed Left) */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark min-vh-100">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-white">
            {/* ✅ Finance TL Profile */}
            <div className="text-center mt-2">
              <img
                src="http://localhost:3000/images/default-profile.png"
                alt="Finance TL Profile"
                className="rounded-circle"
                style={{ width: "80px", height: "80px", objectFit: "cover", border: "2px solid white" }}
              />
              <h5 className="mt-2">Finance TL</h5>
              <p className="text-white-50">financetl@company.com</p>
              <span className="badge bg-primary">Finance TL</span>
            </div>

            {/* ✅ Sidebar Navigation */}
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start mt-4">
              <li className="w-100">
                <Link to="/finance-dashboard" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-speedometer2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/finance-dashboard/expenses" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-cash-stack"></i>
                  <span className="ms-2 d-none d-sm-inline">Expenses</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/finance-dashboard/salaries" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-wallet"></i>
                  <span className="ms-2 d-none d-sm-inline">Salaries</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/finance-dashboard/vendor-payments" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-receipt"></i>
                  <span className="ms-2 d-none d-sm-inline">Vendor Payments</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/finance-dashboard/asset-requests" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-box"></i>
                  <span className="ms-2 d-none d-sm-inline">Asset Requests</span>
                </Link>
              </li>

              {/* ✅ Logout */}
              <li className="w-100">
                <button
                  className="btn nav-link text-white px-3 d-flex align-items-center"
                  onClick={handleLogout}
                  style={{ background: "none", border: "none" }}
                >
                  <i className="fs-4 bi-power"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ✅ Main Content Area */}
        <div className="col p-0 m-0 offset-md-3">
          <div className="p-3 d-flex justify-content-between align-items-center shadow">
            <h4>Finance Dashboard</h4>

            {/* 🔔 Notification Bell */}
            <div className="position-relative">
              <span className="fs-3 bi-bell text-dark" onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: "pointer" }}></span>
              {notifications.length > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>

          <Outlet /> {/* ✅ Render child components */}

          {/* ✅ Notification Panel (Slides in from the right) */}
          {showNotifications && (
            <div className="position-fixed top-0 end-0 bg-white shadow-lg p-3" style={{ width: "300px", height: "100vh", zIndex: "1050" }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5>Notifications</h5>
                <button className="btn btn-close" onClick={() => setShowNotifications(false)}></button>
              </div>
              <div className="mt-2">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
