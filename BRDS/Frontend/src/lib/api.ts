interface SendOtpRequest {
  phone_number: string;
}

interface VerifyOtpRequest {
  phone_number: string;
  code: string;
}

interface ProfileUpdateRequest {
  full_name: string;
  address: string;
  date_of_birth?: string;
}

const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

const getAdminAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

export const api = {
  auth: {
    sendOtp: async (data: SendOtpRequest) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"}/auth/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || errorData?.message || "Failed to send OTP. Please try again.",
        );
      }
      return response.json();
    },
    verifyOtp: async (data: VerifyOtpRequest) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || errorData?.message || "Failed to verify OTP.",
        );
      }
      return response.json();
      return response.json();
    },
    logout: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"}/auth/logout`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      return response.json();
    },
  },
  public: {
    trackRequest: async (referenceNumber: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/track/${referenceNumber}`,
        { credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("Request not found");
      }
      return response.json();
    },
  },
  admin: {
    login: async (data: any) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Login failed");
      }
      return response.json();
    },
    getRequests: async (status?: string) => {
      const url = new URL(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/admin/requests`);
      if (status && status !== "All") url.searchParams.append("status", status);
      
      const response = await fetch(url.toString(), {
        headers: getAdminAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch requests");
      return response.json();
    },
    createRequest: async (data: any) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/admin/requests`,
        {
          method: "POST",
          headers: getAdminAuthHeaders(),
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create request");
      }
      return response.json();
    },
    getRequest: async (id: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/admin/requests/${id}`,
        {
          headers: getAdminAuthHeaders(),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch request details");
      return response.json();
    },
    updateRequestStatus: async (id: string, status: string, remarks?: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/admin/requests/${id}/status`,
        {
          method: "PUT",
          headers: getAdminAuthHeaders(),
          body: JSON.stringify({ status, remarks }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to update request status");
      }
      return response.json();
    }
  },
  user: {
    getProfile: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"}/user/profile`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
    updateProfile: async (data: ProfileUpdateRequest) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"}/user/profile`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
          credentials: "include",
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to update profile");
      }
      return response.json();
    },
  },
  request: {
    submit: async (data: any, idempotencyKey: string) => {
      const headers = getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"}/request`,
        {
          method: "POST",
          headers: { ...headers, "Idempotency-Key": idempotencyKey },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to submit request");
      }
      return response.json();
    },
    getList: async (page = 1, limit = 10) => {
      const headers = getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"}/request?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers,
          credentials: "include",
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to fetch requests");
      }
      return response.json();
    },
  },
};
