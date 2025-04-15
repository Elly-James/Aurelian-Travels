import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('travel-user');
            window.location.href = '/'; // Redirect to home on unauthorized
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    googleLogin: (data) => api.post('/auth/google', data),
    appleLogin: (data) => api.post('/auth/apple', data),
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
};

export const destinationsApi = {
    getDestinations: (params = {}) => api.get('/destinations', { params }),
    getDestination: (id) => api.get(`/destinations/${id}`),
    searchDestinations: (params) => api.get('/destinations/search', { params }),
    submitReview: (data) => api.post(`/destinations/${data.destination_id}/reviews`, data),
    getReviews: (destinationId) => api.get(`/destinations/${destinationId}/reviews`),
    getKenyanDestinations: () => api.get('/destinations?type=kenyan'),
    getInternationalDestinations: () => api.get('/destinations?type=international'),
};

export const bookingsApi = {
    createBooking: (data) => api.post('/bookings', data),
    getUserBookings: () => api.get('/bookings'),
    cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

export const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
};

export default api;