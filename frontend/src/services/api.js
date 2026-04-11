import axios from 'axios';

// Base URL for our Spring Boot backend
const api = axios.create({
  baseURL: 'http://localhost:8081',
});

// User APIs
export const createUser = (data) => api.post('/users', data);
export const login = (data) => api.post('/users/login', data);
export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);

// Card APIs
export const createCard = (data) => api.post('/cards', data);
export const getAllCards = () => api.get('/cards');
export const getCardsByUserId = (userId) => api.get(`/cards/user/${userId}`);
export const updateCardStatus = (id, status) => api.patch(`/cards/${id}/status`, { status });

// Item APIs
export const createItem = (data) => api.post('/items', data);
export const getAllItems = () => api.get('/items');
export const updateItemPrice = (id, pricePerUnit) => api.patch(`/items/${id}/price`, { pricePerUnit });

// Inventory APIs
export const createInventory = (data) => api.post('/inventory', data);
export const getInventory = () => api.get('/inventory');

// Allocation APIs
export const createAllocation = (data) => api.post('/allocations', data);
export const getAllAllocations = () => api.get('/allocations');
export const getAllocationsByCardId = (cardId) => api.get(`/allocations/card/${cardId}`);

// Distribution APIs
export const distribute = (data) => api.post('/distribution', data);
export const getAllDistributions = () => api.get('/distribution'); // Corrected from /distribution/all
export const getDistributionsByCardId = (cardId) => api.get(`/distribution/card/${cardId}`);

export default api;
