import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useUserStore } from "../../shared/store/userStore";
import Button from "../../shared/ui/components/button/Button";
import Header from "../../shared/ui/components/header/Header";
import styles from "./AddWork.module.css";
import { useCreateAdvertisement } from "./hooks/useCreateAdvertisement";

export default function AddWork() {
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("/icons/Sample_User_Icon.png");
  const [uploading, setUploading] = useState(false);
  const { createAdvertisement } = useCreateAdvertisement();
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.user?.id);

  // Состояние формы
  const [formData, setFormData] = useState({
    jobType: "",
    jobTitle: "",
    companyName: "",
    employmentType: "",
    workFormat: "",
    responsibilities: "",
    requirements: "",
    offers: "",
    salaryFrom: "",
    salaryTo: "",
    currency: "rub",
    telegram: "",
    vk: "",
    email: "",
  });

  // Опции для селектов
  const jobTypeOptions = [
    { value: "VACANCY", label: "Вакансия" },
    { value: "ORDER", label: "Заказ" },
  ];

  const employmentTypeOptions = [
    { value: "full-time", label: "Полная занятость" },
    { value: "part-time", label: "Частичная занятость" },
    { value: "freelance", label: "Фриланс" },
    { value: "contract", label: "Контракт" },
  ];

  const workFormatOptions = [
    { value: "remote", label: "Удаленно" },
    { value: "office", label: "Офис" },
    { value: "hybrid", label: "Гибрид" },
  ];

  const currencyOptions = [
    { value: "rub", label: "₽" },
    { value: "usd", label: "$" },
    { value: "eur", label: "€" },
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("handleLogoChange file:", file, file instanceof File);

      // Создаем preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setLogoFile(file);

      // Здесь можно добавить логику загрузки файла
      // updateLogo(file);
    }
  };

  const handleLogoDelete = () => {
    setLogoFile(null);
    setLogoPreview("/icons/default-logo.svg");
    // Очищаем preview URL если он был создан
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      await createAdvertisement({
        file: logoFile,
        type: formData.jobType,
        name: formData.jobTitle,
        companyName: formData.companyName,
        employmentType: formData.employmentType,
        jobFormat: formData.workFormat,
        whatToDo: formData.responsibilities,
        expectations: formData.requirements,
        weOffer: formData.offers,
        minWage: formData.salaryFrom,
        maxWage: formData.salaryTo,
        currency: formData.currency,
        telegram: formData.telegram,
        vk: formData.vk,
        email: formData.email,
      });
      if (userId) {
        navigate(`/user/${userId}/works`);
      } else {
        alert("Пользователь не найден, переадресация невозможна");
      }
    } catch (err) {
      alert("Ошибка при публикации объявления");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.addWork}>
        <div className="container">
          <div
            className={`${styles.backButton} ${styles.backButtonCursor}`}
            onClick={() => window.history.back()}
          >
            <img src="/icons/back_arrow.svg" alt="back arrow" />
            <p>Назад</p>
          </div>
          <div className={styles.button}>
            <button className={styles.publishButton} onClick={handlePublish}>
              Опубликовать
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.wrapper}>
              <h2>Логотип компании</h2>
              <div className="stripe2"></div>
              <div className={styles.form}>
                <div className={styles.img_form}>
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className={styles.logoImage}
                  />
                  <label className={styles.logoLabel}>
                    Рекомендуемый размер <br />
                    512x512 px
                  </label>
                </div>
                <div className={styles.btn_container}>
                  <label
                    className={`${styles.fileInput} ${styles.btn} ${uploading ? styles.disabled : styles.fileInputButton}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.hiddenFileInput}
                      onChange={handleLogoChange}
                      disabled={uploading}
                    />
                    Изменить
                  </label>
                  <button
                    className={styles.btnDelete}
                    onClick={handleLogoDelete}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.wrapper}>
              <h2>О вакансии</h2>
              <div className="stripe2"></div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Вид объявления</label>
                  <select
                    id="jobType"
                    value={formData.jobType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        jobType: e.target.value,
                      }))
                    }
                    className={styles.formSelect}
                  >
                    <option value="">Выберите вариант</option>
                    {jobTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Название вакансии</label>
                  <input
                    id="jobTitle"
                    placeholder="Введите название"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Название компании</label>
                  <input
                    id="companyName"
                    placeholder="Введите название"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.emptyDiv}></div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Тип занятости</label>
                    <select
                      id="employmentType"
                      value={formData.employmentType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          employmentType: e.target.value,
                        }))
                      }
                      className={styles.formSelect}
                    >
                      <option value="">Выберите вариант</option>
                      {employmentTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Формат работы</label>
                    <select
                      id="workFormat"
                      value={formData.workFormat}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          workFormat: e.target.value,
                        }))
                      }
                      className={styles.formSelect}
                    >
                      <option value="">Выберите вариант</option>
                      {workFormatOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.emptyDiv}></div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Чем предстоит заниматься
                  </label>
                  <textarea
                    id="responsibilities"
                    placeholder="Опишите обязанности"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    className={styles.formTextareaSmall}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Что ждем от кандидата
                  </label>
                  <textarea
                    id="requirements"
                    placeholder="Опишите требования"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    className={styles.formTextareaMedium}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Что предлагаем</label>
                  <textarea
                    id="offers"
                    placeholder="Опишите условия"
                    value={formData.offers}
                    onChange={handleInputChange}
                    className={styles.formTextareaLarge}
                  />
                </div>
              </div>
            </div>

            <div className={styles.wrapper}>
              <h2>Заработная плата</h2>
              <div className="stripe2"></div>

              <div className={styles.salaryRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>От</label>
                  <input
                    type="text"
                    id="salaryFrom"
                    value={formData.salaryFrom}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salaryFrom: e.target.value,
                      }))
                    }
                    placeholder="10 000"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>До</label>
                  <input
                    type="text"
                    id="salaryTo"
                    value={formData.salaryTo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salaryTo: e.target.value,
                      }))
                    }
                    placeholder="20 000"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Валюта</label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
                    className={styles.formSelect}
                  >
                    <option value="usd">$</option>
                    {currencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.wrapper}>
              <h2>Контакты для связи</h2>
              <div className="stripe2"></div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Telegram</label>
                  <input
                    type="text"
                    id="telegram"
                    value={formData.telegram}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        telegram: e.target.value,
                      }))
                    }
                    placeholder="t.me"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>VK</label>
                  <input
                    type="text"
                    id="vk"
                    value={formData.vk}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, vk: e.target.value }))
                    }
                    placeholder="Vk.com"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Почта</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="@mail"
                    className={styles.formInput}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <button
                  className={styles.publishButton}
                  onClick={handlePublish}
                >
                  Опубликовать
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
