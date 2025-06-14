import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const create = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, userData, config);
  return response.data;
};

const getAll = async (token) => {
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
    timeout: 5000
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

const getById = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${userId}`, config);
  return response.data;
};

const update = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${userData._id}`, userData, config);
  return response.data;
};

const remove = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  try {
    const response = await axios.delete(`${API_URL}/${userId}`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || 
        error.response.statusText || 
        'Failed to delete user'
      );
    }
    throw new Error('Network error while deleting user');
  }
};

const updateRole = async (userId, role, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${userId}`, { role }, config);
  return response.data;
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