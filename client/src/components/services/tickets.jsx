import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tickets';

const getAll = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const create = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, ticketData, config);
  return response.data;
};

const getById = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/${ticketId}`, config);
  return response.data;
};

const update = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  };

  try {
    const response = await axios.put(
      `${API_URL}/${ticketData._id}`,
      {
        assignedTo: ticketData.assignedTo,
        status: ticketData.status,
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority,
        ...(ticketData.comment && { comment: ticketData.comment })
      },
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 
                     error.response.statusText || 
                     'Failed to update ticket');
    }
    throw new Error('Network error while updating ticket');
  }
};

const remove = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${ticketId}`, config);
  return response.data;
};

const ticketService = {
  getAll,
  create,
  getById,
  update,
  delete: remove,
};

export default ticketService;