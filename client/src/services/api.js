const API_BASE_URL = '/api';

export function getAuthHeader() {
  const token = localStorage.getItem('exploria_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API Request Failed');
  }

  return data;
}

// 1. Auth Services
export const authService = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) })
};

// 2. Destinations
export const destinationService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/destinations${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/destinations/${id}`),
  create: (data) => request('/destinations', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/destinations/${id}`, { method: 'DELETE' })
};

// 3. Packages
export const packageService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/packages${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/packages/${id}`),
  create: (data) => request('/packages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/packages/${id}`, { method: 'DELETE' })
};

// 4. Adventures
export const adventureService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/adventures${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/adventures/${id}`),
  create: (data) => request('/adventures', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/adventures/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/adventures/${id}`, { method: 'DELETE' })
};

// 5. Guides
export const guideService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/guides${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/guides/${id}`),
  match: (matchData) => request('/guides/match', { method: 'POST', body: JSON.stringify(matchData) }),
  updateProfile: (data) => request('/guides/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getRequests: () => request('/guides/requests'),
  respondRequest: (requestId, status) => request(`/guides/requests/${requestId}`, { method: 'PUT', body: JSON.stringify({ status }) })
};

// 6. Inquiries
export const inquiryService = {
  create: (inquiryData) => request('/inquiries', { method: 'POST', body: JSON.stringify(inquiryData) }),
  getMy: () => request('/inquiries/my'),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/inquiries${query ? `?${query}` : ''}`);
  },
  updateStatus: (id, status) => request(`/inquiries/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  delete: (id) => request(`/inquiries/${id}`, { method: 'DELETE' })
};

// 7. Weather
export const weatherService = {
  getWeather: (city) => request(`/weather?city=${encodeURIComponent(city)}`)
};

// 8. Chatbot
export const chatService = {
  sendMessage: (message) => request('/chat', { method: 'POST', body: JSON.stringify({ message }) })
};

// 9. Bookings
export const bookingService = {
  create: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getMy: () => request('/bookings/my'),
  getGuideBookings: () => request('/bookings/guide'),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/bookings/admin${query ? `?${query}` : ''}`);
  },
  updateStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  cancel: (id) => request(`/bookings/${id}/cancel`, { method: 'PUT' })
};

// 10. Reviews
export const reviewService = {
  create: (reviewData) => request('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  getReviews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reviews${query ? `?${query}` : ''}`);
  },
  delete: (id) => request(`/reviews/${id}`, { method: 'DELETE' })
};

// 11. Favorites
export const favoriteService = {
  getMy: () => request('/favorites'),
  toggle: (packageId) => request('/favorites/toggle', { method: 'POST', body: JSON.stringify({ packageId }) })
};

// 12. Admin Users & Stats
export const adminService = {
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ''}`);
  },
  updateUserRole: (id, role) => request(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getStats: () => request('/stats/admin')
};
