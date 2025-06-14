import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// Helper function for common config
const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 5000 // Add timeout to all requests
});

const create = async (userData, token) => {
  try {
    const response = await axios.post(API_URL, userData, getConfig(token));
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to create user');
  }
};

const getAll = async (token) => {
  try {
    const response = await axios.get(API_URL, getConfig(token));
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to fetch users');
  }
};

const getAgents = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/agents`, getConfig(token));
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('You do not have permission to view agents');
    }
    handleError(error, 'Failed to fetch agents');
  }
};

const getById = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, getConfig(token));
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to fetch user');
  }
};

const update = async (userData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${userData._id}`,
      userData,
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to update user');
  }
};

const remove = async (userId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`, getConfig(token));
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to delete user');
  }
};

const updateRole = async (userId, role, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${userId}`,
      { role },
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to update user role');
  }
};

// Centralized error handling
const handleError = (error, defaultMessage) => {
  if (error.response) {
    const serverMessage = error.response.data?.message || error.response.statusText;
    throw new Error(serverMessage || defaultMessage);
  }
  throw new Error(error.message || defaultMessage);
};

const userService = {
  create,
  getAll,
  getAgents,
  getById,
  update,
  remove,
  updateRole,
};

export default userService;