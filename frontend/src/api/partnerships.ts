import axiosInstance from "./config";

// Check if user has application or is partner
export const checkApplicationStatus = async () => {
  try {
    const response = await axiosInstance.get("/partnerships/check-status");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// User endpoints
export const createPartnershipApplication = async (
  applicationData: any,
  idFile?: File,
) => {
  try {
    // Create FormData to support file upload
    const formData = new FormData();

    // Add application data as JSON string
    formData.append("partnerInfo", JSON.stringify(applicationData.partnerInfo));
    formData.append("investmentAmount", applicationData.investmentAmount);
    formData.append("signature", applicationData.signature);

    // Add ID document file (required)
    if (idFile) {
      formData.append("idDocument", idFile);
    }

    const response = await axiosInstance.post("/partnerships/apply", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getUserApplication = async () => {
  try {
    const response = await axiosInstance.get("/partnerships/my-application");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const updateUserApplication = async (
  applicationId: string,
  updateData: any,
) => {
  try {
    const response = await axiosInstance.put(
      `/partnerships/${applicationId}`,
      updateData,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Admin endpoints
export const getAllApplications = async (filters?: any) => {
  try {
    const response = await axiosInstance.get("/partnerships/admin/list", {
      params: filters,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getApplicationById = async (applicationId: string) => {
  try {
    const response = await axiosInstance.get(
      `/partnerships/admin/${applicationId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Alias for compatibility
export const getApplicationDetails = getApplicationById;

export const approveApplication = async (
  applicationId: string,
  notes?: string,
) => {
  try {
    const response = await axiosInstance.patch(
      `/partnerships/admin/${applicationId}/approve`,
      { notes },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const rejectApplication = async (
  applicationId: string,
  reason?: string,
) => {
  try {
    const response = await axiosInstance.patch(
      `/partnerships/admin/${applicationId}/reject`,
      { reason },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const updatePaymentStatus = async (
  applicationId: string,
  paymentStatus: "awaiting" | "payment_requested" | "received",
  paymentInstructions?: string,
) => {
  try {
    const response = await axiosInstance.patch(
      `/partnerships/admin/${applicationId}/payment-status`,
      {
        paymentStatus,
        paymentInstructions,
      },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const requestPaymentMethod = async (
  applicationId: string,
  paymentMethod: "wire_transfer" | "wire_check" | "ach_payment",
) => {
  try {
    const response = await axiosInstance.patch(
      `/partnerships/${applicationId}/request-payment-method`,
      { paymentMethod },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const uploadPaymentProof = async (applicationId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("paymentProof", file);

    const response = await axiosInstance.post(
      `/partnerships/${applicationId}/upload-payment-proof`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const uploadIdDocument = async (applicationId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("idDocument", file);

    // Must override the instance's default "application/json" header
    // to properly send FormData as multipart/form-data
    const response = await axiosInstance.post(
      `/partnerships/${applicationId}/upload-id-document`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const confirmPaymentAndChangeToPartner = async (
  applicationId: string,
) => {
  try {
    const response = await axiosInstance.patch(
      `/partnerships/admin/${applicationId}/confirm-payment-partner`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const updateAccountDetails = async (
  applicationId: string,
  bankDetails: any,
) => {
  try {
    const response = await axiosInstance.patch(
      `/partnerships/${applicationId}/account-details`,
      { bankDetails },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
