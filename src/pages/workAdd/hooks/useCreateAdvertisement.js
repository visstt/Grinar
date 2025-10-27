import { useCallback } from "react";

import api from "../../../shared/api/api";

export function useCreateAdvertisement() {
  const createAdvertisement = useCallback(async (data) => {
    try {
      const formData = new FormData();
      // file (image)
      if (data.file) {
        formData.append("file", data.file);
      }
      // required fields
      formData.append("type", data.type);
      formData.append("name", data.name);
      formData.append("companyName", data.companyName);
      formData.append("employmentType", data.employmentType);
      formData.append("jobFormat", data.jobFormat);
      formData.append("whatToDo", data.whatToDo);
      formData.append("expectations", data.expectations);
      formData.append("weOffer", data.weOffer);
      formData.append("minWage", data.minWage);
      formData.append("maxWage", data.maxWage);
      formData.append("currency", data.currency);
      // optional fields
      formData.append("telegram", data.telegram || "");
      formData.append("vk", data.vk || "");
      formData.append("email", data.email || "");

      console.log(
        "[createAdvertisement] Request data:",
        Object.fromEntries(formData.entries()),
      );
      const response = await api.post(
        "/advertisement/create-advertisement",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("[createAdvertisement] Response:", response);
      return response;
    } catch (error) {
      console.error("[createAdvertisement] Error:", error);
      throw error;
    }
  }, []);

  return { createAdvertisement };
}
