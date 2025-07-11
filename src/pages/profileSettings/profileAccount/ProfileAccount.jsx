import { useState } from "react";

import { toast } from "react-toastify";

import Button from "../../../shared/ui/components/button/Button";
import Input from "../../../shared/ui/components/input/Input";
import ProfileSettingsHeader from "../../profilePage/profileComponents/profileSettingsHeader/ProfileSettingsHeader";
import ChangeLoginModal from "./ChangeLoginModal";
import styles from "./ProfileAccount.module.css";
import useChangeEmail from "./hooks/useChangeEmail";
import useChangeLogin from "./hooks/useChangeLogin";
import useChangePhone from "./hooks/useChangePhone";

export default function ProfileAccount() {
  const [loginInput, setLoginInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const {
    loading,
    error,
    success,
    code,
    setCode,
    sendLogin,
    verifyLoginCode,
    setStep,
    setSuccess,
  } = useChangeLogin();

  const {
    loading: emailLoading,
    error: emailError,
    success: emailSuccess,
    step: emailStep,
    oldCode,
    newCode,
    setOldCode,
    setNewCode,
    sendEmail,
    verifyOldEmailCode,
    verifyNewEmailCode,
    setStep: setEmailStep,
    setSuccess: setEmailSuccess,
  } = useChangeEmail();

  const {
    loading: phoneLoading,
    error: phoneError,
    success: phoneSuccess,
    step: phoneStep,
    code: phoneCode,
    setCode: setPhoneCode,
    sendPhone,
    verifyPhoneCode,
    setStep: setPhoneStep,
    setSuccess: setPhoneSuccess,
  } = useChangePhone();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await sendLogin(loginInput);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCode("");
    setStep(1);
    setSuccess(false);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    await verifyLoginCode(code);
    if (success) {
      setShowModal(false);
      setLoginInput("");
      toast.success("Логин успешно изменён!");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    await sendEmail(emailInput);
    setShowEmailModal(true);
  };

  const handleEmailModalClose = () => {
    setShowEmailModal(false);
    setEmailInput("");
    setOldCode("");
    setNewCode("");
    setEmailStep(1);
    setEmailSuccess(false);
  };

  const handleOldCodeSubmit = async (e) => {
    e.preventDefault();
    await verifyOldEmailCode(oldCode);
  };

  const handleNewCodeSubmit = async (e) => {
    e.preventDefault();
    const result = await verifyNewEmailCode(newCode);
    if (!emailError && emailStep === 1) {
      setShowEmailModal(false);
      setEmailInput("");
      toast.success("Почта успешно изменена!");
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    await sendPhone(phoneInput);
    setShowPhoneModal(true);
  };

  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
    setPhoneInput("");
    setPhoneCode("");
    setPhoneStep(1);
    setPhoneSuccess(false);
  };

  const handlePhoneCodeSubmit = async (e) => {
    e.preventDefault();
    const wasSuccess = await verifyPhoneCode(phoneCode);
    if (wasSuccess) {
      setShowPhoneModal(false);
      setPhoneInput("");
      toast.success("Телефон успешно изменён!");
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
                  <div className={styles.btn_container}>
                    <div className={styles.group}>
                      <Input
                        label="Логин"
                        id="login"
                        autoComplete="off"
                        placeholder={"Введите новый логин"}
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                      />
                      <label className={styles.label}>
                        Логин можно менять не чаще одного раза в месяц.
                        Потребуется ввод кода с почты.
                      </label>
                    </div>
                    <Button
                      type="button"
                      className={styles.submit_btn}
                      disabled={loading || !loginInput}
                      onClick={handleLoginSubmit}
                    >
                      {loading ? "Отправляем..." : "Сменить логин"}
                    </Button>
                  </div>
                  <div className={styles.btn_container}>
                    <div className={styles.group}>
                      <Input
                        label="Электронная почта"
                        id="email"
                        autoComplete="off"
                        placeholder={"Введите новую почту"}
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      className={styles.submit_btn}
                      disabled={emailLoading || !emailInput}
                      onClick={handleEmailSubmit}
                    >
                      {emailLoading ? "Отправляем..." : "Сменить почту"}
                    </Button>
                  </div>
                  <div className={styles.btn_container}>
                    <div className={styles.group}>
                      <Input
                        label="Телефон"
                        id="phoneNumber"
                        autoComplete="off"
                        placeholder={"Введите новый номер"}
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                      />
                      {phoneError && (
                        <div className={styles.error}>{phoneError}</div>
                      )}
                      <Button
                        type="button"
                        className={styles.submit_btn}
                        disabled={phoneLoading || !phoneInput}
                        onClick={handlePhoneSubmit}
                      >
                        {phoneLoading ? "Отправляем..." : "Сменить телефон"}
                      </Button>
                    </div>
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
        {showEmailModal && (
          <ChangeLoginModal
            open={showEmailModal}
            onClose={handleEmailModalClose}
            onSubmit={
              emailStep === 2 ? handleOldCodeSubmit : handleNewCodeSubmit
            }
            loading={emailLoading}
            error={emailError}
            code={emailStep === 2 ? oldCode : newCode}
            setCode={emailStep === 2 ? setOldCode : setNewCode}
          />
        )}
        {showPhoneModal && (
          <ChangeLoginModal
            open={showPhoneModal}
            onClose={handlePhoneModalClose}
            onSubmit={handlePhoneCodeSubmit}
            loading={phoneLoading}
            error={phoneError}
            code={phoneCode}
            setCode={setPhoneCode}
          />
        )}
      </div>
    </div>
  );
}
