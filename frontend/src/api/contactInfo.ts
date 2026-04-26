import apiClient from "./config";

export interface ContactInfo {
  email?: string;
  whatsapp?: string;
  telegram?: string;
  signal?: string;
  phone?: string;
}

/**
 * Get contact information (public)
 */
export const getContactInfo = async (): Promise<ContactInfo> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: ContactInfo;
    }>("/contact-info");
    return response.data.data || {};
  } catch (error: any) {
    console.error("Failed to fetch contact info:", error.message);
    return {};
  }
};

/**
 * Update contact information (admin only)
 */
export const updateContactInfo = async (contactInfo: ContactInfo) => {
  try {
    const response = await apiClient.put("/contact-info", contactInfo);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update contact info";
    throw new Error(message);
  }
};
