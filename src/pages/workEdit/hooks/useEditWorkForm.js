import { useEffect } from "react";

import { getPhotoUrl } from "../../../shared/utils/getProjectImageUrl";

// job — объект работы, который приходит из useJob
export function useEditWorkForm(setFormData, setLogoPreview, job) {
  // job может быть null на первом рендере
  useEffect(() => {
    if (!job) return;
    setFormData({
      jobType: job.type || "",
      jobTitle: job.name || "",
      companyName: job.companyName || "",
      employmentType:
        job.employmentType === "Полная занятость"
          ? "full-time"
          : job.employmentType === "Частичная занятость"
            ? "part-time"
            : job.employmentType === "Фриланс"
              ? "freelance"
              : job.employmentType === "Контракт"
                ? "contract"
                : job.employmentType || "",
      workFormat:
        job.jobFormat === "Удаленно"
          ? "remote"
          : job.jobFormat === "Офис"
            ? "office"
            : job.jobFormat === "Гибрид"
              ? "hybrid"
              : job.jobFormat || "",
      responsibilities: job.whatToDo || "",
      requirements: job.expectations || "",
      offers: job.weOffer || "",
      salaryFrom: job.minWage || "",
      salaryTo: job.maxWage || "",
      currency:
        job.currency === "RUB"
          ? "rub"
          : job.currency === "USD"
            ? "usd"
            : job.currency === "EUR"
              ? "eur"
              : job.currency || "rub",
      telegram: job.telegram || "",
      vk: job.vk || "",
      email: job.email || "",
    });
    // setLogoPreview больше не вызывается здесь, чтобы не конфликтовать с EditWork.jsx
  }, [job, setFormData, setLogoPreview]);
}
