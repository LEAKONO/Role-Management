import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tickets';

const createTicket = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, ticketData, config);
  return response.data;
};

const getTickets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const getTicketById = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/${ticketId}`, config);
  return response.data;
};

const updateTicket = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/${ticketData._id}`,
    ticketData,
    config
  );
  return response.data;
};

// Delete ticket
const deleteTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${ticketId}`, config);
  return response.data;
};

const ticketService = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};

export default ticketService;