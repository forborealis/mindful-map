import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success("Login successful!");
        navigate('/home');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);

      if (error.response && error.response.status === 403) {
        toast.error("Your account is deactivated. Contact admin.");
      } else {
        toast.error("An error occurred during login. Please try again."); 
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-3/5 bg-cover bg-center" style={{ backgroundImage: "url('/images/trynow.png')" }}>
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h1 className="text-5xl font-bold text-white">Welcome Back!</h1>
          <p className="text-lg text-white mt-4">
            We are excited to continue your <br />
            mental wellness journey.
          </p>
        </div>
      </div>
      <div className="w-2/5 flex items-center justify-center bg-[#eef0ee]">
        <form className="w-3/5 flex flex-col items-center" onSubmit={handleSubmit}>
          <h2 className="w-full text-left text-5xl font-bold mb-6" style={{ color: '#3a3939' }}>Sign In</h2>
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 rounded-full bg-[#6fba94] text-white font-bold hover:bg-[#5aa88f]"
          >
            Sign In
          </button>
          <p className="mt-4 text-sm">
            <span style={{ color: '#3a3939' }}>Don't have an account? </span>
            <span
              style={{ color: '#6fba94', cursor: 'pointer' }}
              onClick={() => navigate('/signup')}
            >
              Sign up.
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;