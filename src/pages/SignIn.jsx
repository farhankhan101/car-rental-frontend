import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For routing
import { toast, ToastContainer } from 'react-toastify'; // For toasts
import 'react-toastify/dist/ReactToastify.css'; // Toast CSS
import Cookies from 'js-cookie'; // For managing cookies

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); // Hook for navigating after successful login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful! Redirecting...');
        
        Cookies.set('authToken', data.token, { expires: 7, secure: true });

        setTimeout(() => {
          navigate('/'); 
        }, 2000); 
      } else {
        toast.error(data.message || 'Invalid email or password!');
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred during login.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Sign In
        </h1>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
        >
          Sign In
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default SignIn;
