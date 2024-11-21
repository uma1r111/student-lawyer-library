import React from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import '../styles/LoginStyles.css';
import axios from 'axios'

const Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  // Form handler
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading())
      const res = await axios.post("/api/users/login", values); // Ensure the correct endpoint
      dispatch(hideLoading())
      if (res.data.success) {
        localStorage.setItem("token", res.data.token); // Save token to localStorage
        message.success('Logged in Successfully');
        navigate('/'); // Redirect to home or dashboard
      } else {
        message.error(res.data.message); // Display error message from server
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error); // Log error for debugging
      message.error('Something went wrong'); // Show user-friendly error message
    }
  };

  return (
    <div className="form-container">
      <Form layout="vertical" onFinish={onFinishHandler} className="card p-4">
        <h1>Login</h1>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'The input is not a valid email' },
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <button className="btn btn-primary" type="submit">
          Login
        </button>

        <p className="mt-3">
          Don't have an account?{' '}
          <Link to="/register" className="text-decoration-none text-primary">
            Register here
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default Login;
