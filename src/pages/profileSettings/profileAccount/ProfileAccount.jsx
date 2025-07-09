import Input from "../../../shared/ui/components/input/Input";
import ProfileSettingsHeader from "../../profilePage/profileComponents/profileSettingsHeader/ProfileSettingsHeader";
import styles from "./ProfileAccount.module.css";

export default function ProfileAccount() {
  return (
    <div>
      <ProfileSettingsHeader />
      <div className={styles.profile_account}>
        <form>
          <div className={styles.wrapper}>
            <h2>Учетная запись</h2>
            <div className="stripe"></div>
            <div className={styles.form}>
              <div className={styles.group}>
                <Input label="Логин" id="Логин" autoComplete="off" />
                <label className={styles.label}>
                  Логин можно менять не чаще одного раза в месяц. Потребуется
                  ввод кода с почты.
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
                <Input label="Телефон" id="phoneNumber" autoComplete="off" />
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
  );
}
