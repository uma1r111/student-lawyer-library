import React from 'react';
import '../styles/RegisterStyles.css';
import { Form, Input, Select, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
const Register = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading())
      const res = await axios.post('/api/users/register', values);
      dispatch(hideLoading())
      if (res.data.success) {
        message.success('Registered Successfully');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong!');
    }
  };

  return (
    <>
      <div className="form-container">
        <Form layout="vertical" onFinish={onfinishHandler} className="card p-4">
          <h1 className="text-center">Register Form</h1>

          {/* Name Field */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input type="text" />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter a valid email address' },
              { type: 'email', message: 'The input is not a valid email' },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          {/* Password Field */}
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

          {/* UserType Dropdown (Restricted to Lawyer and LawStudent) */}
          <Form.Item
            label="User Type"
            name="userType"
            rules={[{ required: true, message: 'Please select a user type' }]}
          >
            <Select placeholder="Select a role">
              <Option value="Lawyer">Lawyer</Option>
              <Option value="LawStudent">Law Student</Option>
            </Select>
          </Form.Item>

          {/* Already Registered? */}
          <p className="mt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none text-primary">
              Log in here
            </Link>
          </p>

          {/* Submit Button */}
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </Form>
      </div>
    </>
  );
};

export default Register;
