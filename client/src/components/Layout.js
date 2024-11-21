import React, { useEffect } from "react";
import "../styles/LayoutStyles.css";
import { lawyerMenu, studentMenu } from "../Data/SideOption";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { setUser } from "../redux/features/userSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Load user from localStorage if Redux state is empty
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser))); // Sync Redux with localStorage
      }
    }
  }, [user, dispatch]);

 // Logout function
 const handleLogout = () => {
  localStorage.clear();
  dispatch(setUser(null)); // Clear Redux state
  message.success("Logged Out Successfully");
  navigate("/login");
};

  // Determine SidebarMenu based on userType
  const SidebarMenu =
    user?.userType === "Lawyer" ? lawyerMenu : user?.userType === "LawStudent" ? studentMenu : [];

  if (!SidebarMenu.length) {
    return (
      <div>
        Invalid user type. Please log out and log in again.
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <h6>Lawyer Case App</h6>
            <hr />
          </div>
          <div className="menu">
            {SidebarMenu.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div key={index} className={`menu-item ${isActive && "active"}`}>
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
            <div className="menu-item" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          <div className="header">
            <div className="header-content">
              <i className="fa-solid fa-bell"></i>
              <Link to="/profile">{user?.name || "Profile"}</Link>
            </div>
            <h3>{user?.userType || "Dashboard"} Dashboard</h3>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
