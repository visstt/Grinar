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
  const [addWorkDropdownOpen, setAddWorkDropdownOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 950);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Закрытие выпадающего меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addWorkDropdownOpen &&
        !event.target.closest(`.${styles.addWorkWrapper}`)
      ) {
        setAddWorkDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [addWorkDropdownOpen]);

  // Яндекс.Метрика
  useEffect(() => {
    // Проверяем, не загружена ли уже Метрика
    if (window.ym) return;

    // Создаем и добавляем скрипт Яндекс.Метрики
    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
          return;
        }
      }
      ((k = e.createElement(t)),
        (a = e.getElementsByTagName(t)[0]),
        (k.async = 1),
        (k.src = r),
        a.parentNode.insertBefore(k, a));
    })(
      window,
      document,
      "script",
      "https://mc.yandex.ru/metrika/tag.js?id=103494311",
      "ym",
    );

    // Инициализируем счетчик
    window.ym(103494311, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      accurateTrackBounce: true,
      trackLinks: true,
    });

    // Добавляем noscript fallback
    const noscriptImg = document.createElement("img");
    noscriptImg.src = "https://mc.yandex.ru/watch/103494311";
    noscriptImg.style.cssText = "position:absolute; left:-9999px;";
    noscriptImg.alt = "";

    const noscriptDiv = document.createElement("div");
    noscriptDiv.appendChild(noscriptImg);

    const noscript = document.createElement("noscript");
    noscript.appendChild(noscriptDiv);
    document.head.appendChild(noscript);
  }, []);

  useEffect(() => {
    if (loginOpen || registrationOpen || menuOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;

      // Добавляем класс для блокировки скролла
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");

      // Сохраняем позицию
      document.body.setAttribute("data-scroll-y", scrollY.toString());

      // Применяем стили через JavaScript для большей надежности
      document.body.style.cssText = `
        position: fixed !important;
        top: -${scrollY}px !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
      `;

      document.documentElement.style.cssText = `
        overflow: hidden !important;
        height: 100% !important;
      `;
    } else {
      // Восстанавливаем
      const savedScrollY = document.body.getAttribute("data-scroll-y");

      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");

      document.body.style.cssText = "";
      document.documentElement.style.cssText = "";

      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY));
        document.body.removeAttribute("data-scroll-y");
      }
    }

    return () => {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
      document.body.style.cssText = "";
      document.documentElement.style.cssText = "";
      document.body.removeAttribute("data-scroll-y");
    };
  }, [loginOpen, registrationOpen, menuOpen]);

  const handleRegistrationSuccess = (email) => {
    setRegistrationEmail(email);
    setRegistrationStep(2);
  };

  const handleCloseRegistration = () => {
    setRegistrationOpen(false);
    setRegistrationStep(1);
    setRegistrationEmail("");
  };

  const handleOpenLogin = () => {
    setRegistrationOpen(false);
    setRegistrationStep(1);
    setRegistrationEmail("");
    setLoginOpen(true);
  };

  const handleOpenRegistration = () => {
    setLoginOpen(false);
    setRegistrationOpen(true);
  };

  return (
    <div
      className={`${styles.header} ${darkBackground ? styles.darkHeader : ""} ${isMobile ? styles.mobileHeader : ""}`}
    >
      <div className="container">
        <div className={styles.header_wrapper}>
          <div className={styles.header_wrapper__logo}>
            <Link to="/">
              <img src={mainLogo} alt="mainLogo" className={styles.logo} />
            </Link>
          </div>

          {!isMobile && (
            <>
              <nav
                className={`${styles.header_wrapper__nav} ${user ? styles.centeredNav : ""}`}
              >
                <div className={styles.navContentWrapper}>
                  <ul>
                    <li>
                      <Link
                        to="/"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Главная
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/projects"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Проекты
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/specialists"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Специалисты
                      </Link>
                    </li>
                    <li style={{ opacity: 0.5, cursor: "default" }}>Работа</li>
                    <li>
                      <Link
                        to="/blog"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Блог
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/payment"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Подписка
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </>
          )}

          <div className={styles.header_wrapper__buttons}>
            {user ? (
              <>
                {!isMobile && (
                  <div className={styles.addWorkWrapper}>
                    <Button
                      variant="secondary"
                      className={styles.header_wrapper__addProject}
                      onClick={() => {
                        setAddWorkDropdownOpen(!addWorkDropdownOpen);
                      }}
                    >
                      Добавить работу
                    </Button>
                    {addWorkDropdownOpen && (
                      <div className={styles.addWorkDropdown}>
                        <Button
                          variant="primary"
                          onClick={() => {
                            navigate("/create-project");
                            setAddWorkDropdownOpen(false);
                          }}
                        >
                          Добавить проект
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            navigate("/create-article");
                            setAddWorkDropdownOpen(false);
                          }}
                        >
                          Добавить статью
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Иконки уведомлений и почты */}
                <div className={styles.notificationIcons}>
                  <img
                    src="/icons/mail.svg"
                    alt="mail"
                    className={styles.notificationIcon}
                    onClick={() => navigate("/chat-page")}
                    title="Сообщения"
                  />
                  <img
                    src="/icons/bell.svg"
                    alt="notifications"
                    className={styles.notificationIcon}
                    title="Уведомления"
                    style={{ opacity: 0.5 }}
                  />
                </div>

                <img
                  src={getUserLogoUrl(user.logoFileName)}
                  alt="user"
                  className={styles.userLogo}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "20%",
                    marginLeft: isMobile ? 0 : 16,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/user/${user.id}`)}
                  title="Профиль"
                />
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  className={styles.header_wrapper__login}
                  onClick={() => {
                    handleOpenLogin();
                    setMenuOpen(false);
                  }}
                >
                  Войти
                </Button>
                {!isMobile && (
                  <Button
                    variant="secondary"
                    className={styles.header_wrapper__registration}
                    onClick={() => {
                      handleOpenRegistration();
                      setMenuOpen(false);
                    }}
                  >
                    Зарегистрироваться
                  </Button>
                )}
              </>
            )}
          </div>

          {isMobile && (
            <div
              className={`${styles.burger} ${menuOpen ? styles.open : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
            </div>
          )}

          {isMobile && menuOpen && (
            <nav className={`${styles.header_wrapper__nav} ${styles.open}`}>
              <div className={styles.navContentWrapper}>
                <ul>
                  <li>
                    <Link
                      to="/"
                      style={{ color: "inherit", textDecoration: "none" }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Главная
                    </Link>
                  </li>
                  <div className={styles.stripe}></div>
                  <li>
                    <Link
                      to="/projects"
                      style={{ color: "inherit", textDecoration: "none" }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Проекты
                    </Link>
                  </li>
                  <div className={styles.stripe}></div>
                  <li>
                    <Link
                      to="/specialists"
                      style={{ color: "inherit", textDecoration: "none" }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Специалисты
                    </Link>
                  </li>
                  <div className={styles.stripe}></div>
                  <li style={{ opacity: 0.5, cursor: "default" }}>Работа</li>
                  <div className={styles.stripe}></div>
                  <li>
                    <Link
                      to="/blog"
                      style={{ color: "inherit", textDecoration: "none" }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Блог
                    </Link>
                  </li>
                  <div className={styles.stripe}></div>
                  <li>
                    <Link
                      to="/payment"
                      style={{ color: "inherit", textDecoration: "none" }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Подписка
                    </Link>
                  </li>
                </ul>

                {user && (
                  <div className={styles.mobileMenuButtons}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        navigate("/create-project");
                        setMenuOpen(false);
                      }}
                    >
                      Добавить проект
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        navigate("/create-article");
                        setMenuOpen(false);
                      }}
                    >
                      Добавить статью
                    </Button>
                  </div>
                )}

                <div className={styles.legalInfo}>
                  <p
                    onClick={() => {
                      navigate("/docs");
                      setMenuOpen(false);
                    }}
                  >
                    Юридическая информация
                  </p>
                  <p>© 2025 Benty</p>
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
            onSwitchToRegister={handleOpenRegistration}
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
