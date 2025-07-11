import Input from "../../../shared/ui/components/input/Input";
import Select from "../../../shared/ui/components/input/Select";
import Textarea from "../../../shared/ui/components/input/Textarea";
import useProfileInfoAutoSave from "../../profilePage/hooks/useProfileInfoAutoSave";
import ProfileSettingsHeader from "../../profilePage/profileComponents/profileSettingsHeader/ProfileSettingsHeader";
import styles from "./ProfileInfo.module.css";

export default function ProfileInfo() {
  const {
    form,
    setForm,
    handleChange,
    handleSpecializationChange,
    specializations,
    loading,
    error,
  } = useProfileInfoAutoSave();

  if (loading || !form) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  // Гарантируем, что всегда 3 специализации для выбора
  const specArray = Array.from(
    { length: 3 },
    (_, idx) => form.specializations?.[idx] || "",
  );

  // Если поля пустые, пользователь может их заполнить (Input уже позволяет это)

  return (
    <>
      <ProfileSettingsHeader />
      <div className={styles.main_container}>
        <div className={styles.settings_container}>
          <div className={styles.profile_info}>
            <form>
              <div className={styles.wrapper}>
                <h2>Основное</h2>
                <div className="stripe"></div>
                <div className={styles.form}>
                  <Input
                    label="Имя"
                    id="name"
                    value={form.name || ""}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  <Input
                    label="Фамилия"
                    id="surname"
                    value={form.surname || ""}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  <Input
                    label="Город"
                    id="city"
                    value={form.city || ""}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className={styles.wrapper}>
                <h2>Специализация</h2>
                <div className="stripe"></div>
                <div className={styles.form}>
                  {specArray.map((specId, idx) => (
                    <Select
                      key={idx}
                      label={`Специализация ${idx + 1}`}
                      id={`specialization-${idx}`}
                      options={specializations.map((s) => ({
                        value: s.id,
                        label: s.name,
                      }))}
                      value={specId}
                      onChange={(e) => {
                        handleSpecializationChange(idx, Number(e.target.value));
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.wrapper}>
                <h2>Опыт работы</h2>
                <div className="stripe"></div>
                <div className={styles.form}>
                  <Input
                    label="Текущий уровень"
                    id="level"
                    value={form.level || ""}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  <Select
                    label="Общий опыт работы"
                    id="experience"
                    options={[
                      { value: "Менее года", label: "Менее года" },
                      { value: "1-3 года", label: "1-3 года" },
                      { value: "3-6 лет", label: "3-6 лет" },
                      { value: "Более 6 лет", label: "Более 6 лет" },
                    ]}
                    value={form.experience || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.wrapper}>
                <h2>О себе</h2>
                <div className="stripe"></div>
                <div className={styles.form}>
                  <Textarea
                    label="Информация в профиле"
                    id="about"
                    placeholder="Напишите о себе..."
                    rows={5}
                    value={form.about || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.wrapper}>
                <h2>Контакты</h2>
                <div className="stripe"></div>
                <h3>Основные контакты</h3>
                <div className={styles.form}>
                  <Input
                    label="Сайт"
                    id="website"
                    value={form.website || ""}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  <div className={styles.group}>
                    <Input
                      label="Телефон"
                      id="phoneNumber"
                      value={form.phoneNumber || ""}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    <label className={styles.label}>
                      Для отображения в профиле. Может отличаться от основного
                      номера телефона.
                    </label>
                  </div>
                  <div className={styles.group}>
                    <Input
                      label="Электронная почта"
                      id="email"
                      value={form.email || ""}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    <label className={styles.label}>
                      Для отображения в профиле. Может отличаться от основного
                      Email.
                    </label>
                  </div>
                </div>
                <h3>Социальные сети</h3>
                <div className={styles.form}>
                  <Input
                    label="Вконтакте"
                    id="vk"
                    value={form.vk || ""}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  <Input
                    label="Телеграм"
                    id="telegram"
                    value={form.telegram || ""}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
