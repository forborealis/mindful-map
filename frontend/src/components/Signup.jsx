import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: null,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        navigate('/signin');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-3/5 bg-cover bg-center" style={{ backgroundImage: "url('/images/trynow.png')" }}>
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h1 className="text-5xl font-bold text-white">Welcome to Mindful Map!</h1>
          <p className="text-lg text-white mt-4">
            We are excited to guide you through your <br />
            mental wellness journey.
          </p>
        </div>
      </div>
      <div className="w-2/5 flex items-center justify-center bg-[#eef0ee]">
        <form className="w-3/5 flex flex-col items-center" onSubmit={handleSubmit}>
          <h2 className="w-full text-left text-5xl font-bold mb-6" style={{ color: '#3a3939' }}>Sign Up</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-3 mb-4 rounded-full bg-[#eef0ee] border-2 border-[#6fba94] outline-none focus:border-[#6fba94]"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded-full bg-[#eef0ee] border-2 border-[#6fba94] outline-none focus:border-[#6fba94]"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 mb-6 rounded-full bg-[#eef0ee] border-2 border-[#6fba94] outline-none focus:border-[#6fba94]"
            onChange={handleChange}
          />
          <div className="w-full flex flex-col items-center mb-6">
            <div className="flex items-center">
              <input
                type="file"
                name="avatar"
                className="mr-4"
                onChange={handleChange}
              />
              <label className="text-[#3a3939]">Upload Avatar</label>
            </div>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 rounded-full bg-[#6fba94] text-white font-bold hover:bg-[#5aa88f]"
          >
            Sign Up
          </button>
          <p className="mt-4 text-sm">
            <span style={{ color: '#3a3939' }}>Already have an account? </span>
            <span
              style={{ color: '#6fba94', cursor: 'pointer' }}
              onClick={() => navigate('/signin')}
            >
              Sign in.
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;