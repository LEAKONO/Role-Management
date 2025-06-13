import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const getUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const getAgents = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 5000 // 5 second timeout
  };
  
  try {
    const response = await axios.get(`${API_URL}/agents`, config);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('You do not have permission to view agents');
    }
    throw error;
  }
};

const getUserById = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${userId}`, config);
  return response.data;
};

const updateUser = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${userData._id}`, userData, config);
  return response.data;
};

const deleteUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${userId}`, config);
  return response.data;
};

const updateUserRole = async (userId, role, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${userId}`, { role }, config);
  return response.data;
};

const userService = {
  getUsers,
  getAgents,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
};

export default userService;