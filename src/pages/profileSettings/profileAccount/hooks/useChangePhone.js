import { useState } from "react";

import api from "../../../../shared/api/api";

export default function useChangePhone() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 - ввод номера, 2 - ввод кода
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  // Отправка нового номера
  const sendPhone = async (phoneValue) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/user/change-phone", { phoneNumber: phoneValue });
      setPhone(phoneValue);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Подтверждение кода
  const verifyPhoneCode = async (codeValue) => {
    setLoading(true);
    setError(null);
    let wasSuccess = false;
    try {
      const response = await api.post(
        `/user/verify-phone-email-code?code=${codeValue}`,
      );
      if (response.status === 201) {
        setSuccess(true);
        setStep(1);
        setPhone("");
        setCode("");
        wasSuccess = true;
      } else {
        setError("Ошибка подтверждения телефона");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || err);
    } finally {
      setLoading(false);
    }
    return wasSuccess;
  };

  return {
    loading,
    error,
    success,
    step,
    phone,
    code,
    setPhone,
    setCode,
    sendPhone,
    verifyPhoneCode,
    setStep,
    setSuccess,
  };
}
