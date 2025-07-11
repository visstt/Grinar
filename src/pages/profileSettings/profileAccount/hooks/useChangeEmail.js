import { useState } from "react";

import api from "../../../../shared/api/api";

export default function useChangeEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 - ввод новой почты, 2 - код со старой, 3 - код с новой
  const [email, setEmail] = useState("");
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");

  // Отправка новой почты
  const sendEmail = async (emailValue) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/user/change-email", { email: emailValue });
      setEmail(emailValue);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Подтверждение кода со старой почты
  const verifyOldEmailCode = async (codeValue) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/user/verify-old-email-code?code=${codeValue}`);
      setStep(3);
      setOldCode("");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Подтверждение кода с новой почты
  const verifyNewEmailCode = async (codeValue) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/user/verify-new-email-code?code=${codeValue}`);
      setSuccess(true);
      setStep(1);
      setEmail("");
      setNewCode("");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    step,
    email,
    oldCode,
    newCode,
    setEmail,
    setOldCode,
    setNewCode,
    sendEmail,
    verifyOldEmailCode,
    verifyNewEmailCode,
    setStep,
    setSuccess,
  };
}
