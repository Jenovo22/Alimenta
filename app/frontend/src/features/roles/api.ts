import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('alimenta_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transform API offer to frontend format
function transformOffer(d: any): any {
  return {
    id: d.id.toString(),
    donorId: d.donor_id.toString(),
    edilId: d.edil_id.toString(),
    product: d.product_id !== null ? d.product_id.toString() : d.product || 'Unknown',
    quantity: d.quantity,
    offerStatus: d.status,
    appointmentStatus: d.appointment_status,
    transportStatus: d.transport_status,
    receiptStatus: d.receipt_status
  };
}

// Transform API event to frontend format
function transformEvent(e: any): any {
  return {
    id: 'JV-' + (e.id ?? Date.now()),
    accountId: e.account_id?.toString() ?? e.edil_id?.toString() ?? '',
    type: e.event_type ?? e.type,
    volunteer: e.volunteer_name ?? e.volunteer,
    venue: e.venue,
    date: e.date,
    start: e.start_time,
    end: e.end_time,
    status: e.status
  };
}

export const services = {
  async fetchUsers() {
    const resp = await api.get('/users/');
    return resp.data;
  },
  
  async fetchCommunities() {
    const resp = await api.get('/communities/');
    return resp.data;
  },
  
  async fetchDonations() {
    const resp = await api.get('/donations/');
    return resp.data.map(transformOffer);
  },
  
  async fetchNeeds() {
    const resp = await api.get('/needs/');
    return resp.data;
  },
  
  async fetchProducts() {
    const resp = await api.get('/products/');
    return resp.data;
  },
  
  async fetchOrganizations() {
    const resp = await api.get('/organizations/');
    return resp.data;
  },
  
  async fetchInventory() {
    const resp = await api.get('/inventory/');
    return resp.data;
  },
  
  async fetchVolunteerEvents() {
    const resp = await api.get('/volunteer-events/');
    return resp.data.map(transformEvent);
  },
  
  async fetchJornadas() {
    const resp = await api.get('/jornadas/');
    return resp.data.map(transformEvent);
  },
  
  async checkApiHealth() {
    try {
      const resp = await api.get('/health');
      return resp.data.status === 'ok';
    } catch {
      return false;
    }
  },
  
  async getAiHealth() {
    const resp = await api.get('/ai/health');
    return resp.data;
  },
};

// Default export for convenience
export const apiService = services;