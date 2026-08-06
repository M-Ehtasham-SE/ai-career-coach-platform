import axiosClient from '../api/axiosClient';

/**
 * API client service for the Interview Practice module.
 * Communicates with /api/v1/interviews/* endpoints.
 */
const interviewService = {

  /**
   * Starts a new interview session and receives AI-generated questions.
   * @param {string} jobRole - Target job role (e.g., "Frontend Developer")
   * @param {string} difficulty - "EASY" | "MEDIUM" | "HARD"
   * @returns {Promise<Object>} ApiResponse with SessionDetailResponse data
   */
  async startSession(jobRole, difficulty = 'MEDIUM') {
    const response = await axiosClient.post('/interviews/sessions/start', {
      jobRole,
      difficulty,
    });
    return response.data;
  },

  /**
   * Submits an answer for a specific question in a session.
   * @param {string} sessionId - The session UUID
   * @param {number} questionIndex - The 1-based question index
   * @param {string} userAnswer - The candidate's answer text
   * @returns {Promise<Object>} ApiResponse with AnswerResponse data (includes AI feedback)
   */
  async submitAnswer(sessionId, questionIndex, userAnswer) {
    const response = await axiosClient.post(`/interviews/sessions/${sessionId}/answer`, {
      questionIndex,
      userAnswer,
    });
    return response.data;
  },

  /**
   * Finalizes the session and computes the overall performance score.
   * @param {string} sessionId - The session UUID
   * @returns {Promise<Object>} ApiResponse with finalized SessionDetailResponse
   */
  async finalizeSession(sessionId) {
    const response = await axiosClient.post(`/interviews/sessions/${sessionId}/finalize`);
    return response.data;
  },

  /**
   * Retrieves the interview session history for the logged-in user.
   * @returns {Promise<Object>} ApiResponse with list of SessionSummaryResponse
   */
  async getSessionHistory() {
    const response = await axiosClient.get('/interviews/sessions');
    return response.data;
  },

  /**
   * Retrieves the full detail of a single interview session.
   * @param {string} sessionId - The session UUID
   * @returns {Promise<Object>} ApiResponse with SessionDetailResponse (includes all answers)
   */
  async getSessionDetail(sessionId) {
    const response = await axiosClient.get(`/interviews/sessions/${sessionId}`);
    return response.data;
  },
};

export default interviewService;
