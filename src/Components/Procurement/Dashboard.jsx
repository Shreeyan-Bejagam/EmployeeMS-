import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProcurementDashboard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ email: "", role: "" });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/user-details", { withCredentials: true })
      .then((response) => {
        if (response.data.Status) {
          setUserDetails({ email: response.data.email, role: response.data.role });

          // Fetch Notifications
          axios
            .get(`http://localhost:3000/notifications/${response.data.user_id}`)
            .then((notifResponse) => {
              if (notifResponse.data.Status) {
                setNotifications(notifResponse.data.Result);
              }
            })
            .catch((err) => console.error("❌ Error fetching notifications:", err));
        }
      })
      .catch((error) => console.error("❌ Error fetching user details:", error));
  }, []);

  // ✅ Mark Notification as Read & Navigate
  const handleNotificationClick = (notification) => {
    axios
      .post(`http://localhost:3000/notifications/mark_as_read/${notification.id}`)
      .then(() => {
        setNotifications(notifications.filter((n) => n.id !== notification.id));
        navigate("/procurement-dashboard/asset-requests");
      })
      .catch((err) => console.error("❌ Error marking notification as read:", err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* ✅ Sidebar (Fixed Left) */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark min-vh-100">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-white">
            {/* ✅ Procurement TL Profile */}
            <div className="text-center mt-2">
              <img
                src="http://localhost:3000/images/default-profile.png"
                alt="Procurement TL Profile"
                className="rounded-circle"
                style={{ width: "80px", height: "80px", objectFit: "cover", border: "2px solid white" }}
              />
              <h5 className="mt-2">Procurement TL</h5>
              <p className="text-white-50">{userDetails.email}</p>
              <span className="badge bg-primary">Procurement TL</span>
            </div>

            {/* ✅ Sidebar Navigation */}
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start mt-4">
              <li className="w-100">
                <Link to="/procurement-dashboard" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-speedometer2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/procurement-dashboard/asset-requests" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-box"></i>
                  <span className="ms-2 d-none d-sm-inline">Asset Requests</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/procurement-dashboard/vendor-management" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-people"></i>
                  <span className="ms-2 d-none d-sm-inline">Vendor Management</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/procurement-dashboard/purchase-orders" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-receipt"></i>
                  <span className="ms-2 d-none d-sm-inline">Purchase Orders</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/procurement-dashboard/inventory" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-box-seam"></i>
                  <span className="ms-2 d-none d-sm-inline">Inventory</span>
                </Link>
              </li>

              {/* ✅ Logout */}
              <li className="w-100">
                <button
                  className="btn nav-link text-white px-3 d-flex align-items-center"
                  onClick={() => {
                    localStorage.removeItem("userRole");
                    window.location.href = "/adminlogin";
                  }}
                  style={{ background: "none", border: "none" }}
                >
                  <i className="fs-4 bi-power"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ✅ Main Content & Notification Bell */}
        <div className="col p-0 m-0 offset-md-3">
          <div className="p-3 d-flex justify-content-between align-items-center shadow">
            <h4>Procurement TL Dashboard</h4>

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

          {/* 🔔 Notification Panel */}
          {showNotifications && (
            <div
              className="position-fixed top-0 end-0 p-3 bg-white shadow"
              style={{ width: "300px", height: "100vh", overflowY: "auto", zIndex: "1050" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5>Notifications</h5>
                <button className="btn btn-sm btn-outline-dark" onClick={() => setShowNotifications(false)}>
                  ✖
                </button>
              </div>
              <hr />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-2 border-bottom"
                    onClick={() => handleNotificationClick(notification)}
                    style={{ cursor: "pointer" }}
                  >
                    <p className="mb-1">{notification.message}</p>
                    <small className="text-muted">{new Date(notification.created_at).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">No new notifications</p>
              )}
            </div>
          )}

          <Outlet /> {/* ✅ This will render sub-routes like Inventory, Asset Requests, etc. */}
        </div>
      </div>
    </div>
  );
};

export default ProcurementDashboard;
