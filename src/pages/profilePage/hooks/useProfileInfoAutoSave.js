import { useEffect, useRef, useState } from "react";

import api from "../../../shared/api/api";
import useMainSettings from "./useMainSettings";
import useSpecializations from "./useSpecializations";
import useUpdateMainSettings from "./useUpdateMainSettings";

export default function useProfileInfoAutoSave() {
  const {
    settings,
    loading: loadingSettings,
    error: errorSettings,
  } = useMainSettings();
  const {
    specializations,
    loading: loadingSpecs,
    error: errorSpecs,
  } = useSpecializations();
  const {
    updateMainSettings,
    error: updateError,
    success,
  } = useUpdateMainSettings();

  const [form, setForm] = useState(null);
  const saveTimeout = useRef();
  const prevFormRef = useRef();

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  useEffect(() => {
    if (!form) return;
    if (settings && JSON.stringify(form) === JSON.stringify(settings)) return;
    if (
      prevFormRef.current &&
      JSON.stringify(form) === JSON.stringify(prevFormRef.current)
    )
      return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      const dataToSend = {
        fullName: `${form.name || ""} ${form.surname || ""}`.trim(),
        city: form.city,
        firstSpecializationId: form.specializations?.[0] || null,
        secondSpecializationId: form.specializations?.[1] || null,
        thirdSpecializationId: form.specializations?.[2] || null,
        level: form.level,
        experience: form.experience,
        about: form.about,
        website: form.website,
        phoneNumber: form.phoneNumber,
        email: form.email,
        vk: form.vk,
        telegram: form.telegram,
      };
      await updateMainSettings(dataToSend);
      try {
        const res = await api.get("/user/get-main-settings");
        setForm(res.data);
        prevFormRef.current = res.data;
      } catch {}
    }, 1000);
    prevFormRef.current = form;
    // eslint-disable-next-line
  }, [form]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSpecializationChange = (idx, value) => {
    setForm((prev) => {
      const updated = [...(prev.specializations || [])];
      updated[idx] = value;
      return { ...prev, specializations: updated };
    });
  };

  return {
    form,
    setForm,
    handleChange,
    handleSpecializationChange,
    specializations,
    loading: loadingSettings || loadingSpecs || !form,
    error: errorSettings || errorSpecs,
    updateError,
    success,
  };
}
