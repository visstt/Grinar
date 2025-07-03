import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import mainLogo from '/icons/mainLogo.svg';
import Login from '../../../features/auth/login/Login';
import Registration from '../../../features/auth/registration/Registration'
import { Link } from "react-router-dom";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false); 

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


  return (
    <>
      <div className="container">
        <div className={styles.header_wrapper}>
          <div className={styles.header_wrapper__logo}>
            <Link to='/'><img src={mainLogo} alt="mainLogo" /></Link>
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
                onClick={() => setLoginOpen(true)}
              >
                Войти
              </button>
              <button
                className={styles.header_wrapper__registration}
                onClick={() => setRegistrationOpen(true)} 
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
          <Login />
        </div>
      )}

      {/* Registration Modal */}
      {registrationOpen && (
        <div
          className={`${styles.loginBackdrop} ${
            registrationOpen ? styles.open : ""
          }`}
          onClick={() => setRegistrationOpen(false)}
        ></div>
      )}
      {registrationOpen && (
        <div
          className={`${styles.registrationWrapper} ${
            registrationOpen ? styles.open : ""
          }`}
        >
          <Registration />
        </div>
      )}
    </>
  );
}