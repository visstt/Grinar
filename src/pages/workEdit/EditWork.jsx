import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../../shared/store/userStore";
import Button from "../../shared/ui/components/button/Button";
import Header from "../../shared/ui/components/header/Header";
import { getPhotoUrl } from "../../shared/utils/getProjectImageUrl";
import styles from "../workAdd/AddWork.module.css";
import { useJob } from "../workPage/hooks/useJob";
import { useEditWorkForm } from "./hooks/useEditWorkForm";
import { useUpdateAdvertisement } from "./hooks/useUpdateAdvertisement";

// import { useEditAdvertisement } from "./hooks/useEditAdvertisement"; // реализуйте свой хук для редактирования

export default function EditWork() {
  const { id } = useParams();
  // const [logoFile, setLogoFile] = useState(null); // Удалено как неиспользуемое
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const {
    updateAdvertisement,
    loading: updateLoading,
    error: updateError,
    success,
  } = useUpdateAdvertisement();
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

  // Получаем данные работы по id
  const { job, loading } = useJob(id);
  useEditWorkForm(setFormData, setLogoPreview, job);

  // Корректно обновляем превью логотипа при изменении job.photoName
  useEffect(() => {
    if (job && job.photoName) {
      setLogoPreview(getPhotoUrl("advertisement", job.photoName));
    } else {
      setLogoPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job && job.photoName]);

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

  // Логика замены и удаления логотипа аналогична Information.jsx
  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setLogoPreview(base64); // сохраняем строку base64
    };
    reader.readAsDataURL(file);
  };

  const handleLogoDelete = () => {
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    let file = null;
    // Если логотип base64, преобразуем в File
    if (logoPreview && logoPreview.startsWith("data:image")) {
      const arr = logoPreview.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      file = new File([u8arr], "logo.png", { type: mime });
    }
    // Маппинг полей формы в DTO
    const dto = {
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
    };
    try {
      await updateAdvertisement(id, dto, file);
      if (userId) {
        navigate(`/user/${userId}/works`);
      } else {
        alert("Пользователь не найден, переадресация невозможна");
      }
    } catch (err) {
      alert("Ошибка при сохранении изменений: " + (err?.message || ""));
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (updateLoading) return <div>Сохраняем изменения...</div>;

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
            <button className={styles.publishButton} onClick={handleSave}>
              Сохранить изменения
            </button>
          </div>
          {updateError && (
            <div style={{ color: "red", marginBottom: 10 }}>
              Ошибка: {updateError.message || String(updateError)}
            </div>
          )}
          {success && (
            <div style={{ color: "green", marginBottom: 10 }}>
              Изменения успешно сохранены!
            </div>
          )}
          <div className={styles.content}>
            <div className={styles.wrapper}>
              <h2>Логотип компании</h2>
              <div className="stripe2"></div>
              <div className={styles.form}>
                <div className={styles.img_form}>
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company Logo"
                      className={styles.logoImage}
                    />
                  ) : (
                    <img
                      src={
                        job && job.photoName
                          ? getPhotoUrl("advertisement", job.photoName)
                          : "/icons/Sample_User_Icon.png"
                      }
                      alt="Company Logo"
                      className={styles.logoImage}
                    />
                  )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
