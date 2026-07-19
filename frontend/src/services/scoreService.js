import axiosClient from '../api/axiosClient';

const scoreService = {
  /**
   * Scores a resume for a given role using AI.
   * @param {string} resumeId - The ID of the resume to score.
   * @param {string} role - The target job role (optional, defaults to "Software Engineer").
   * @returns {Promise<Object>} The API response with the score data.
   */
  async scoreResume(resumeId, role = 'Software Engineer') {
    const response = await axiosClient.post(`/resumes/${resumeId}/score`, null, {
      params: { role }
    });
    return response.data;
  },

  /**
   * Gets the latest score for a specific resume.
   * @param {string} resumeId - The ID of the resume.
   * @returns {Promise<Object>} The API response with the score data.
   */
  async getLatestScore(resumeId) {
    const response = await axiosClient.get(`/resumes/${resumeId}/score`);
    return response.data;
  },

  /**
   * Gets all scores for a specific resume.
   * @param {string} resumeId - The ID of the resume.
   * @returns {Promise<Object>} The API response with the list of scores.
   */
  async getScoresForResume(resumeId) {
    const response = await axiosClient.get(`/resumes/${resumeId}/scores`);
    return response.data;
  },

  /**
   * Gets the highest score achieved for each job role across all resumes.
   * @returns {Promise<Object>} The API response with the map of best scores by role.
   */
  async getBestScores() {
    const response = await axiosClient.get('/resumes/scores/best');
    return response.data;
  }
};

export default scoreService;
