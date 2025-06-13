import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// Get all users
const getUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get user by ID
const getUserById = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/${userId}`, config);
  return response.data;
};

// Update user
const updateUser = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/${userData._id}`,
    userData,
    config
  );
  return response.data;
};

// Delete user
const deleteUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${userId}`, config);
  return response.data;
};

// Update user role
const updateUserRole = async (userId, role, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/${userId}`,
    { role },
    config
  );
  return response.data;
};

const userService = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
};

export default userService;