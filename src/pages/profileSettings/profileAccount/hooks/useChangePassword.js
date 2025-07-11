import { useState } from "react";

import api from "../../../../shared/api/api";

export default function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 - ввод паролей, 2 - ввод кода
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRepassword, setNewRepassword] = useState("");
  const [code, setCode] = useState("");

  // Отправка нового пароля
  const sendPassword = async (current, newPass, newRepass) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/user/change-password", {
        currentPassword: current,
        newPassword: newPass,
        newRepassword: newRepass,
      });
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Подтверждение кода
  const verifyPasswordCode = async (codeValue) => {
    setLoading(true);
    setError(null);
    let wasSuccess = false;
    try {
      const response = await api.post(
        `/user/verify-change-password-code?code=${codeValue}`,
      );
      if (response.status === 201) {
        setSuccess(true);
        setStep(1);
        setCurrentPassword("");
        setNewPassword("");
        setNewRepassword("");
        setCode("");
        wasSuccess = true;
      } else {
        setError("Ошибка подтверждения пароля");
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
    currentPassword,
    newPassword,
    newRepassword,
    code,
    setCurrentPassword,
    setNewPassword,
    setNewRepassword,
    setCode,
    sendPassword,
    verifyPasswordCode,
    setStep,
    setSuccess,
  };
}
