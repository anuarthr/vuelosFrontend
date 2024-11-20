import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/clientes';

const apiService = {
  getClientes: () => axios.get(API_URL),
  getClienteById: (id: any) => axios.get(`${API_URL}/${id}`),
  createCliente: (clienteData: any) => axios.post(API_URL, clienteData),
  updateCliente: (id: any, clienteData: any) => axios.put(`${API_URL}/${id}`, clienteData),
  deleteCliente: (id: any) => axios.delete(`${API_URL}/${id}`),
};

export default apiService;