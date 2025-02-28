import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const AccountsDashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // ✅ Fetch Accounts TL details & notifications on load
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/user-details", { withCredentials: true })
      .then((response) => {
        if (response.data.Status && response.data.role === "Accounts TL") {
          localStorage.setItem("userId", response.data.id);  // ✅ Store correct userId
          fetchNotifications(response.data.id);               // ✅ Fetch notifications for correct user
        } else {
          navigate("/adminlogin");
        }
      })
      .catch((err) => console.error("❌ Error fetching user details:", err));
  }, [navigate]);

  // ✅ Fetch notifications based on user ID
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

  // ✅ Handle notification click (mark as read + navigate to asset request)
  const handleNotificationClick = (notificationId, requestId) => {
    axios
      .post(`http://localhost:3000/notifications/mark_as_read/${notificationId}`)
      .then(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));  // Remove from UI after read
        navigate(`/accounts-dashboard/asset-requests?request_id=${requestId}`);
      })
      .catch((err) => console.error("❌ Error marking notification as read:", err));
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout", { withCredentials: true })
      .then(() => {
        localStorage.removeItem("userId");  // ✅ Clear userId on logout
        navigate("/adminlogin");
      })
      .catch((err) => console.error("❌ Logout Error:", err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark min-vh-100">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-white">
            {/* Profile */}
            <div className="text-center mt-2">
              <img
                src="http://localhost:3000/images/default-profile.png"
                alt="Accounts TL Profile"
                className="rounded-circle"
                style={{ width: "80px", height: "80px", objectFit: "cover", border: "2px solid white" }}
              />
              <h5 className="mt-2">Accounts TL</h5>
              <p className="text-white-50">accountstl@company.com</p>
              <span className="badge bg-primary">Accounts TL</span>
            </div>

            {/* Sidebar Links */}
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start mt-4">
              <li className="w-100">
                <Link to="/accounts-dashboard" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-speedometer2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/accounts-dashboard/expenses" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-cash-stack"></i>
                  <span className="ms-2 d-none d-sm-inline">Expenses</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/accounts-dashboard/salaries" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-wallet"></i>
                  <span className="ms-2 d-none d-sm-inline">Salaries</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/accounts-dashboard/vendor-payments" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-receipt"></i>
                  <span className="ms-2 d-none d-sm-inline">Vendor Payments</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/accounts-dashboard/asset-requests" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-box"></i>
                  <span className="ms-2 d-none d-sm-inline">Asset Requests</span>
                </Link>
              </li>
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

        {/* Main Content */}
        <div className="col p-0 m-0 offset-md-3">
          <div className="p-3 d-flex justify-content-between align-items-center shadow">
            <h4>Accounts Dashboard</h4>

            {/* Notification Bell */}
            <div className="position-relative">
              <span
                className="fs-3 bi-bell text-dark"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ cursor: "pointer" }}
              ></span>
              {notifications.length > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>

          <Outlet />

          {/* Notification Panel */}
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

export default AccountsDashboard;
