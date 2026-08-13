import axiosClient from '../api/axiosClient';

/**
 * Subscription & EasyPaisa Payment API Client.
 * Receiver Number: 03229240140 (Muhammad Ehtasham)
 */
const subscriptionService = {
  /**
   * Retrieves current user subscription status and monthly scoring limits.
   */
  async getStatus() {
    const response = await axiosClient.get('/subscription/status');
    return response.data;
  },

  /**
   * Submits EasyPaisa Transaction ID to activate Premium subscription.
   * Receiver EasyPaisa: 03229240140
   */
  async submitEasyPaisaPayment(transactionId, senderPhone = '') {
    const response = await axiosClient.post('/subscription/easypaisa', {
      transactionId,
      senderPhone,
    });
    return response.data;
  },
};

export default subscriptionService;
