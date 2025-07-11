import { useState } from "react";

import api from "../../../../shared/api/api";

export default function useChangeLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 - ввод логина, 2 - ввод кода
  const [login, setLogin] = useState("");
  const [code, setCode] = useState("");

  // Отправка нового логина
  const sendLogin = async (loginValue) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/user/change-login", { login: loginValue });
      setLogin(loginValue);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Подтверждение кода через GET-запрос
  const verifyLoginCode = async (codeValue) => {
    setLoading(true);
    setError(null);
    try {
      await api.get("/user/verify-login-code", { params: { code: codeValue } });
      setSuccess(true);
      setStep(1);
      setLogin("");
      setCode("");
    } catch (err) {
      // Проверяем наличие специфического сообщения
      const msg = err?.response?.data?.message || err?.message || err;
      if (msg === "Логин можно менять только раз в месяц") {
        setError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    step,
    login,
    code,
    setCode,
    sendLogin,
    verifyLoginCode,
    setStep,
    setSuccess,
  };
}
