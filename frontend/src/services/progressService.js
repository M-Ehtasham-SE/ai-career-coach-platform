import axiosClient from '../api/axiosClient';

/**
 * API client service for the Progress Dashboard module.
 * Communicates with /api/v1/progress/* endpoints.
 */
const progressService = {

  /**
   * Retrieves the full aggregated career progress statistics for the authenticated user.
   * Includes totals, best scores, career readiness index, score trends, interview history, and role performance.
   * @returns {Promise<Object>} ApiResponse with ProgressStatsResponse data
   */
  async getProgressStats() {
    const response = await axiosClient.get('/progress/stats');
    return response.data;
  },
};

export default progressService;
