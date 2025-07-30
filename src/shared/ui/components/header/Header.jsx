import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Login from "../../../../features/auth/login/Login";
import Registration from "../../../../features/auth/registration/Registration";
import RegistrationStep2 from "../../../../features/auth/registration/RegistrationStep2";
import { useUserStore } from "../../../store/userStore";
import { getUserLogoUrl } from "../../../utils/getProjectImageUrl";
import Button from "../button/Button";
import styles from "./Header.module.css";
import mainLogo from "/icons/mainLogo.svg";

export default function Header({ darkBackground = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 950);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 950);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div
      className={`${styles.header} ${darkBackground ? styles.darkHeader : ""}`}
    >
      <div className="container">
        <div className={styles.header_wrapper}>
          <div className={styles.header_wrapper__logo}>
            <Link to="/">
              <img src={mainLogo} alt="mainLogo" className={styles.logo} />
            </Link>
          </div>

          <div
            className={`${styles.burger} ${menuOpen ? styles.open : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: isMobile ? "block" : "none" }}
          >
            <span></span>
          </div>

          {!isMobile && (
            <>
              <nav
                className={`${styles.header_wrapper__nav} ${user ? styles.centeredNav : ""}`}
              >
                <div className={styles.navContentWrapper}>
                  <ul>
                    <li>Главная</li>
                    <li>Проекты</li>
                    <li>Специалисты</li>
                    <li>Работа</li>
                  </ul>
                </div>
              </nav>
              <div className={styles.header_wrapper__buttons}>
                {user ? (
                  <>
                    <Button
                      variant="secondary"
                      className={styles.header_wrapper__addProject}
                      onClick={() => navigate("/create-project")}
                    >
                      Добавить проект
                    </Button>
                    <img
                      src={getUserLogoUrl(user.logoFileName)}
                      alt="user"
                      className={styles.userLogo}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "20%",
                        marginLeft: 16,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("/profile")}
                      title="Профиль"
                    />
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      className={styles.header_wrapper__login}
                      onClick={() => {
                        setLoginOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      Войти
                    </Button>
                    <Button
                      variant="secondary"
                      className={styles.header_wrapper__registration}
                      onClick={() => {
                        setRegistrationOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      Зарегистрироваться
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          {isMobile && menuOpen && (
            <nav className={`${styles.header_wrapper__nav} ${styles.open}`}>
              <div className={styles.navContentWrapper}>
                <ul>
                  <li>Главная</li>
                  <li>Проекты</li>
                  <li>Специалисты</li>
                  <li>Работа</li>
                </ul>
                <div
                  className={styles.header_wrapper__buttons}
                  style={{ marginTop: 32 }}
                >
                  {user ? (
                    <>
                      <Button
                        variant="secondary"
                        className={styles.header_wrapper__addProject}
                      >
                        Добавить проект
                      </Button>
                      <img
                        src={getUserLogoUrl(user.logoFileName)}
                        alt="user"
                        className={styles.userLogo}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          marginLeft: 16,
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate("/profile")}
                        title="Профиль"
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        className={styles.header_wrapper__login}
                        onClick={() => {
                          setLoginOpen(true);
                          setMenuOpen(false);
                        }}
                      >
                        Войти
                      </Button>
                      <Button
                        variant="secondary"
                        className={styles.header_wrapper__registration}
                        onClick={() => {
                          setRegistrationOpen(true);
                          setMenuOpen(false);
                        }}
                      >
                        Зарегистрироваться
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </nav>
          )}

          {menuOpen && (
            <div
              className={`${styles.backdrop} ${menuOpen ? styles.open : ""}`}
              onClick={() => setMenuOpen(false)}
            ></div>
          )}
        </div>
      </div>
      <div className={styles.stripe}></div>

      {loginOpen && (
        <div
          className={`${styles.loginBackdrop} ${loginOpen ? styles.open : ""}`}
          onClick={() => setLoginOpen(false)}
          style={{
            position: "fixed",
            top: document.querySelector(".container")?.offsetHeight || 80,
            left: 0,
            width: "100vw",
            height: `calc(100vh - ${document.querySelector(".container")?.offsetHeight || 80}px)`,
            background: "rgba(20,20,20,0.4)",
            backdropFilter: "blur(8px)",
            zIndex: 2000,
            transition: "opacity 0.3s ease-in-out",
          }}
        ></div>
      )}
      {loginOpen && (
        <div
          className={`${styles.loginWrapper} ${loginOpen ? styles.open : ""}`}
          style={{
            position: "fixed",
            top: document.querySelector(".container")?.offsetHeight || 80,
            right: 32,
            left: "auto",
            transform: "none",
            zIndex: 2001,
            maxWidth: 400,
            width: "90vw",
          }}
        >
          <Login
            onSuccess={() => setLoginOpen(false)}
            onClose={() => setLoginOpen(false)}
          />
        </div>
      )}

      {registrationOpen && (
        <div
          className={`${styles.loginBackdrop} ${registrationOpen ? styles.open : ""}`}
          onClick={handleCloseRegistration}
          style={{
            position: "fixed",
            top: document.querySelector(".container")?.offsetHeight || 80,
            left: 0,
            width: "100vw",
            height: `calc(100vh - ${document.querySelector(".container")?.offsetHeight || 80}px)`,
            background: "rgba(20,20,20,0.4)",
            backdropFilter: "blur(8px)",
            zIndex: 2000,
            transition: "opacity 0.3s ease-in-out",
          }}
        ></div>
      )}
      {registrationOpen && (
        <div
          className={`${styles.registrationWrapper} ${registrationOpen ? styles.open : ""}`}
          style={{
            position: "fixed",
            top: document.querySelector(".container")?.offsetHeight || 80,
            right: 32,
            left: "auto",
            transform: "none",
            zIndex: 2001,
            maxWidth: 400,
            width: "90vw",
          }}
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
    </div>
  );
}
