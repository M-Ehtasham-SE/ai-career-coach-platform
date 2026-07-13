import axiosClient from '../api/axiosClient';

const authService = {
  /**
   * Registers a new user.
   */
  async register(fullName, email, password) {
    const response = await axiosClient.post('/auth/register', {
      fullName,
      email,
      password,
    });
    return response.data; // returns ApiResponse wrapper
  },

  /**
   * Authenticates an existing user.
   */
  async login(email, password) {
    const response = await axiosClient.post('/auth/login', {
      email,
      password,
    });
    return response.data; // returns ApiResponse wrapper with token and user details
  },

  /**
   * Logs out the user.
   * Since JWT is stateless, we notify the server (optional) and clear local storage.
   */
  async logout() {
    try {
      await axiosClient.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout failed/ignored:', e);
    }
  },
};

export default authService;
