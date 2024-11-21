import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from the backend
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/users/getUserData",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Assuming the response contains user data
      setUserData(res.data); // Save the user data
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load user data");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Show loading message or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout>
      <h1>Home Page</h1>
      <h2>Welcome {userData?.name}</h2>
      {/* You can display more user info here */}
    </Layout>
  );
};

export default HomePage;
