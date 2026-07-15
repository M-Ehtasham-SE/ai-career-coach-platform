import axiosClient from '../api/axiosClient';

const resumeService = {
  /**
   * Uploads a resume file (PDF or DOCX).
   */
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // returns ApiResponse wrapper with ResumeResponse
  },

  /**
   * Fetches all resumes of the current user.
   */
  async getMyResumes() {
    const response = await axiosClient.get('/resumes/me');
    return response.data; // returns ApiResponse wrapper with list of Resumes
  },

  /**
   * Deletes a resume by ID.
   */
  async deleteResume(id) {
    const response = await axiosClient.delete(`/resumes/${id}`);
    return response.data;
  },
};

export default resumeService;
