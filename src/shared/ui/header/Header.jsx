import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Login from "../../../features/auth/login/Login";
import Registration from "../../../features/auth/registration/Registration";
import RegistrationStep2 from "../../../features/auth/registration/RegistrationStep2";
import styles from "./Header.module.css";
import mainLogo from "/icons/mainLogo.svg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const [registrationStep, setRegistrationStep] = useState(1);
  const [registrationEmail, setRegistrationEmail] = useState("");

  useEffect(() => {
    if (loginOpen || registrationOpen) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [loginOpen, registrationOpen]);

  const handleRegistrationSuccess = (email) => {
    setRegistrationEmail(email);
    setRegistrationStep(2);
  };

  const handleCloseRegistration = () => {
    setRegistrationOpen(false);
    setRegistrationStep(1);
    setRegistrationEmail("");
  };

  return (
    <>
      <div className="container">
        <div className={styles.header_wrapper}>
          <div className={styles.header_wrapper__logo}>
            <Link to="/">
              <img src={mainLogo} alt="mainLogo" />
            </Link>
          </div>

          <div
            className={`${styles.burger} ${menuOpen ? styles.open : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
          </div>

          {menuOpen && (
            <div
              className={`${styles.backdrop} ${menuOpen ? styles.open : ""}`}
              onClick={() => setMenuOpen(false)}
            ></div>
          )}

          <nav
            className={`${styles.header_wrapper__nav} ${
              menuOpen ? styles.open : ""
            }`}
          >
            <ul>
              <li>Главная</li>
              <li>Проекты</li>
              <li>Специалисты</li>
              <li>Работа</li>
            </ul>
            <div className={styles.header_wrapper__buttons}>
              <button
                className={styles.header_wrapper__login}
                onClick={() => {
                  setLoginOpen(true);
                  setMenuOpen(false);
                }}
              >
                Войти
              </button>
              <button
                className={styles.header_wrapper__registration}
                onClick={() => {
                  setRegistrationOpen(true);
                  setMenuOpen(false);
                }}
              >
                Зарегистрироваться
              </button>
            </div>
          </nav>
        </div>
      </div>
      <div className={styles.stripe}></div>

      {loginOpen && (
        <div
          className={`${styles.loginBackdrop} ${loginOpen ? styles.open : ""}`}
          onClick={() => setLoginOpen(false)}
        ></div>
      )}
      {loginOpen && (
        <div
          className={`${styles.loginWrapper} ${loginOpen ? styles.open : ""}`}
        >
          <Login onSuccess={() => setLoginOpen(false)} />
        </div>
      )}

      {registrationOpen && (
        <div
          className={`${styles.loginBackdrop} ${
            registrationOpen ? styles.open : ""
          }`}
          onClick={handleCloseRegistration}
        ></div>
      )}
      {registrationOpen && (
        <div
          className={`${styles.registrationWrapper} ${
            registrationOpen ? styles.open : ""
          }`}
        >
          {registrationStep === 1 ? (
            <Registration
              onSuccess={handleRegistrationSuccess}
              onClose={handleCloseRegistration}
            />
          ) : (
            <RegistrationStep2
              email={registrationEmail}
              onSuccess={() => {
                handleCloseRegistration();
                setRegistrationStep(1); 
                setRegistrationEmail("");
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
