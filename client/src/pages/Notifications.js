import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { List, message, Spin } from "antd";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setNotifications(res.data.data);
      } else {
        message.error(res.data.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Notification list item rendering
  const renderNotification = (notification) => (
    <List.Item
      key={notification.id}
      style={{
        backgroundColor: notification.read ? "transparent" : "#f0f0f0",
      }}
    >
      <List.Item.Meta
        title={notification.title}
        description={notification.message}
      />
      <span>{notification.timestamp}</span>
    </List.Item>
  );

  return (
    <Layout>
      <h1 className="text-center">Notifications</h1>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={renderNotification}
          locale={{ emptyText: "No notifications available" }}
        />
      )}
    </Layout>
  );
};

export default Notifications;