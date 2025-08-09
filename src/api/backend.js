// Backend API service for SkillCert
const API_BASE_URL = 'http://localhost:3002/api';

class BackendService {
  constructor() {
    this.token = localStorage.getItem('skillcert_token');
  }

  // Helper method to make authenticated requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Helper method for form data requests
  async requestFormData(endpoint, formData, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      method: 'POST',
      body: formData,
      headers: {},
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API form data request error:', error);
      throw error;
    }
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('skillcert_token', token);
    } else {
      localStorage.removeItem('skillcert_token');
    }
  }

  // Get stored token
  getToken() {
    return this.token || localStorage.getItem('skillcert_token');
  }

  // Clear authentication
  clearAuth() {
    this.token = null;
    localStorage.removeItem('skillcert_token');
  }

  // Health check
  async healthCheck() {
    try {
      return await this.request('/health');
    } catch (error) {
      return { status: 'ERROR', error: error.message };
    }
  }

  // ===== USER MANAGEMENT =====

  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await this.request('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await this.request('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Logout user
   */
  logout() {
    this.clearAuth();
    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Get user profile
   */
  async getProfile() {
    try {
      const response = await this.request('/users/profile');
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== TASK MANAGEMENT =====

  /**
   * Submit a new task
   */
  async submitTask(taskData, file = null) {
    try {
      const formData = new FormData();
      formData.append('title', taskData.title);
      formData.append('description', taskData.description || '');
      formData.append('skill', taskData.skill);
      
      if (file) {
        formData.append('file', file);
      }

      const response = await this.requestFormData('/tasks/submit', formData);
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's tasks
   */
  async getUserTasks() {
    try {
      const response = await this.request('/tasks');
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get pending tasks (for educators)
   */
  async getPendingTasks() {
    try {
      const response = await this.request('/tasks/pending');
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Approve a task (for educators)
   */
  async approveTask(taskId) {
    try {
      const response = await this.request(`/tasks/${taskId}/approve`, {
        method: 'POST',
      });
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== EDUCATOR TASK MANAGEMENT =====

  /**
   * Create a new task (for educators)
   */
  async createTask(taskData) {
    try {
      const response = await this.request('/educator/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get educator's created tasks
   */
  async getEducatorTasks() {
    try {
      const response = await this.request('/educator/tasks');
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get pending submissions for review
   */
  async getPendingSubmissions() {
    try {
      const response = await this.request('/educator/submissions');
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Approve a submission
   */
  async approveSubmission(submissionId) {
    try {
      const response = await this.request(`/educator/submissions/${submissionId}/approve`, {
        method: 'POST',
      });
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Reject a submission
   */
  async rejectSubmission(submissionId, feedback) {
    try {
      const response = await this.request(`/educator/submissions/${submissionId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ feedback }),
      });
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get educator's students
   */
  async getEducatorStudents() {
    try {
      const response = await this.request('/educator/students');
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== CREDENTIAL MANAGEMENT =====

  /**
   * Store credential metadata after blockchain issuance
   */
  async storeCredential(credentialData) {
    try {
      const response = await this.request('/credentials', {
        method: 'POST',
        body: JSON.stringify(credentialData),
      });
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's credentials
   */
  async getUserCredentials() {
    try {
      const response = await this.request('/credentials');
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== PROFILE MANAGEMENT =====

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    try {
      const response = await this.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(passwordData) {
    try {
      const response = await this.request('/users/password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      });
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences) {
    try {
      const response = await this.request('/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Export user data
   */
  async exportUserData() {
    try {
      const response = await this.request('/users/export');
      return { success: true, ...response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== VERIFICATION ENDPOINTS =====

  /**
   * Verify credential by blockchain ID or hash (public)
   */
  async verifyCredential(identifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/verify/${identifier}`);
      
      if (!response.ok && response.status !== 404) {
        throw new Error(`Verification request failed: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all credentials for a user by email or wallet (public)
   */
  async getUserCredentialsByIdentifier(identifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/verify/user/${identifier}`);
      
      if (!response.ok && response.status !== 404) {
        throw new Error(`User credentials request failed: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== IPFS INTEGRATION =====

  /**
   * Get file from IPFS
   */
  async getIPFSFile(hash) {
    try {
      const url = `${API_BASE_URL}/ipfs/${hash}`;
      const response = await fetch(url, {
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS file: ${response.status}`);
      }
      
      return {
        success: true,
        data: await response.blob(),
        contentType: response.headers.get('content-type'),
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Decode JWT token (basic client-side parsing - not for security validation)
   */
  decodeToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  /**
   * Get current user info from token
   */
  getCurrentUser() {
    const decoded = this.decodeToken();
    return decoded ? {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    } : null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) return true;
    
    return decoded.exp * 1000 < Date.now();
  }
}

// Create singleton instance
const backendService = new BackendService();
export default backendService;