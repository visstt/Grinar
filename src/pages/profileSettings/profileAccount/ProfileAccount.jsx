import { useState } from "react";

import Input from "../../../shared/ui/components/input/Input";
import ProfileSettingsHeader from "../../profilePage/profileComponents/profileSettingsHeader/ProfileSettingsHeader";
import ChangeLoginModal from "./ChangeLoginModal";
import styles from "./ProfileAccount.module.css";
import useChangeLogin from "./hooks/useChangeLogin";

export default function ProfileAccount() {
  const [loginInput, setLoginInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const {
    loading,
    error,
    success,
    step,
    code,
    setCode,
    sendLogin,
    verifyCode,
    setStep,
    setSuccess,
  } = useChangeLogin();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await sendLogin(loginInput);
    setShowModal(true); // Открываем модалку только после успешной отправки
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCode("");
    setStep(1);
    setSuccess(false);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    await verifyCode(code);
    if (success) {
      setShowModal(false);
      setLoginInput("");
    }
  };

  return (
    <div>
      <ProfileSettingsHeader />
      <div className={styles.main_container}>
        <div className={styles.settings_container}>
          <div className={styles.profile_account}>
            <form>
              <div className={styles.wrapper}>
                <h2>Учетная запись</h2>
                <div className="stripe"></div>
                <div className={styles.form}>
                  <div className={styles.group}>
                    <Input
                      label="Логин"
                      id="login"
                      autoComplete="off"
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.submit_btn}
                      disabled={loading || !loginInput}
                      onClick={handleLoginSubmit}
                    >
                      {loading ? "Отправляем..." : "Сменить логин"}
                    </button>
                    {error && (
                      <div className={styles.error}>
                        {typeof error === "string"
                          ? error
                          : error?.message ||
                            error?.error ||
                            JSON.stringify(error)}
                      </div>
                    )}
                    <label className={styles.label}>
                      Логин можно менять не чаще одного раза в месяц.
                      Потребуется ввод кода с почты.
                    </label>
                  </div>
                  <div className={styles.group}>
                    <Input
                      label="Электронная почта"
                      id="email"
                      autoComplete="off"
                    />
                    <label className={styles.label}>
                      Для отображения в профиле. Может отличаться от основного
                      Email.
                    </label>
                  </div>
                  <div className={styles.group}>
                    <Input
                      label="Телефон"
                      id="phoneNumber"
                      autoComplete="off"
                    />
                    <label className={styles.label}>
                      Для отображения в профиле. Может отличаться от основного
                      номера телефона.
                    </label>
                  </div>
                </div>
                <h2>Сменить пароль</h2>
                <div className="stripe"></div>
                <div className={styles.form}>
                  <Input
                    label="Пароль"
                    id="Пароль"
                    placeholder="Введите текущий пароль"
                    autoComplete="off"
                  />
                  <Input
                    label="Новый пароль"
                    id="Новый пароль"
                    placeholder="Введите Новый пароль"
                    autoComplete="off"
                  />
                  <Input
                    label="Пароль"
                    id="Повтор"
                    placeholder="Повторите новый пароль"
                    autoComplete="off"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <ChangeLoginModal
          open={showModal}
          onClose={handleModalClose}
          onSubmit={handleCodeSubmit}
          loading={loading}
          error={error}
          code={code}
          setCode={setCode}
        />
      </div>
    </div>
  );
}
