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
  const token = localStorage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getAdminAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  },
  admin: {
    login: async (data: any) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Login failed");
      }
      return response.json();
    },
    getRequests: async (status?: string) => {
      const url = new URL(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/admin/requests`);
      if (status && status !== "All") url.searchParams.append("status", status);
      
      const response = await fetch(url.toString(), {
        headers: getAdminAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch requests");
      return response.json();
    },
    createRequest: async (data: any) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/admin/requests`,
        {
          method: "POST",
          headers: getAdminAuthHeaders(),
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create request");
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
