import Button from "../../../shared/ui/components/button/Button";
import Header from "../../../shared/ui/components/header/Header";
import Input from "../../../shared/ui/components/input/Input";
import Select from "../../../shared/ui/components/input/Select";
import Textarea from "../../../shared/ui/components/input/Textarea";
import CreateProjectNav from "../CreateProjectNav";
import styles from "./Information.module.css";

export default function Information() {
  return (
    <div>
      <Header darkBackground={true} />
      <CreateProjectNav />
      <div className="containerXS">
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <h2>Обложка проекта</h2>
            <div className="stripe2"></div>
            <div className={styles.form}>
              <div className={styles.img_form}>
                <img
                  src={"/images/loginBg.png"}
                  alt="Sample_Project_Icon"
                  className={styles.coverImage}
                />
                <label style={{ color: "#141414", opacity: 0.5 }}>
                  Рекомендуемый размер <br />
                  320x320 px
                </label>
              </div>
              <div className={styles.btn_container}>
                <label
                  className={`${styles.button} ${styles.fileInput} ${styles.btn}`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  Изменить
                </label>
                <Button variant="default" className={styles.btn}>
                  Удалить
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.wrapper}>
            <h2>Направления проекта</h2>
            <div className="stripe2"></div>
            <div className={styles.formSelect}>
              <Select
                label={`Направление`}
                id={`specialization`}
                theme="white"
                options={[{ value: "SMM", label: "SMM" }]}
              />

              <Select
                label={`Ниша`}
                id={`specialization`}
                theme="white"
                options={[{ value: "Медицина", label: "Медицина" }]}
              />
            </div>
          </div>

          <div className={styles.wrapper}>
            <h2>О проекте</h2>
            <div className="stripe2"></div>
            <div className={styles.form}>
              <Input
                label={`Название проекта`}
                id={`projectName`}
                theme="white"
                style={{ width: "100%" }}
                className={styles.fullWidthInput}
              />
            </div>
            <div className={styles.form}>
              <Textarea
                label={`Описание проекта`}
                id={`projectDescription`}
                theme="white"
                className={styles.fullWidthInput}
              />
            </div>
          </div>

          <div className={styles.wrapper}>
            <h2>Ссылки на проект</h2>
            <div className="stripe2"></div>
            <div className={styles.formSelect}>
              <Input label={`Ссылка 1`} id={`projectLink1`} theme="white" />

              <Input label={`Ссылка 2`} id={`projectLink2`} theme="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
