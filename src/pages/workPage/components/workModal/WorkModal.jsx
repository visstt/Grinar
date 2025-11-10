import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useUserStore } from "../../../../shared/store/userStore";
import Button from "../../../../shared/ui/components/button/Button";
import Modal from "../../../../shared/ui/components/modal/Modal";
import { getPhotoUrl } from "../../../../shared/utils/getProjectImageUrl";
import { useJob } from "../../hooks/useJob";
import styles from "./WorkModal.module.css";

const jobFormatMap = {
  office: "Офис",
  remote: "Удалённо",
  hybrid: "Гибрид",
  Удаленно: "Удалённо",
  Офис: "Офис",
  Гибрид: "Гибрид",
};

const employmentTypeMap = {
  "full-time": "Полная занятость",
  "part-time": "Частичная занятость",
  freelance: "Фриланс",
  contract: "Контракт",
  "Полная занятость": "Полная занятость",
  "Частичная занятость": "Частичная занятость",
  Фриланс: "Фриланс",
  Контракт: "Контракт",
};

const currencyMap = {
  RUB: "₽",
  rub: "₽",
  USD: "$",
  usd: "$",
  EUR: "€",
  eur: "€",
};

function isFullJob(job) {
  return job && job.whatToDo && job.expectations && job.weOffer;
}

export default function WorkModal({ open, onClose, jobId, job: jobProp }) {
  const [activeTab, setActiveTab] = useState("announcement");
  const navigate = useNavigate();
  const { user } = useUserStore();
  const id = jobProp?.id || jobId;
  const { job: jobApi, loading, error } = useJob(id);
  const job = isFullJob(jobProp) ? jobProp : jobApi;

  const handleContact = () => {
    if (!user) {
      toast.error("Зарегистрируйтесь перед тем как связаться с человеком");
      return;
    }
    // Используем userId, user.id или creatorId
    const contactUserId = job?.userId || job?.user?.id || job?.creatorId;
    if (contactUserId) {
      navigate(`/chat-page`, {
        state: { contactUserId },
      });
    } else {
      toast.error("Не удалось получить информацию о пользователе");
    }
  };

  if (!open) return null;
  if (!job && loading)
    return (
      <Modal open={open} onClose={onClose}>
        Загрузка...
      </Modal>
    );
  if (error)
    return (
      <Modal open={open} onClose={onClose}>
        Ошибка загрузки
      </Modal>
    );
  if (!job)
    return (
      <Modal open={open} onClose={onClose}>
        Нет данных
      </Modal>
    );

  return (
    <Modal open={open} onClose={onClose}>
      <h1 className={styles.title}>{job.name}</h1>
      <div className={styles.header}>
        <div className={styles.employerBlock}>
          <img
            src={getPhotoUrl("advertisement", job.photoName)}
            alt="Работодатель"
            className={styles.avatar}
          />
          <div>
            <p className={styles.employerLabel}>Работодатель</p>
            <h2 className={styles.employerName}>{job.companyName}</h2>
          </div>
        </div>
        <Button variant="primary" size="large" onClick={handleContact}>
          Связаться на площадке
        </Button>
      </div>
      <div className={styles.tabs}>
        <Button
          variant={activeTab === "announcement" ? "primary" : "default"}
          size="large"
          onClick={() => setActiveTab("announcement")}
        >
          Объявление
        </Button>
        <Button
          variant={activeTab === "contacts" ? "primary" : "default"}
          size="large"
          onClick={() => setActiveTab("contacts")}
        >
          Контакты
        </Button>
      </div>
      <div className={styles.modalContent}>
        {activeTab === "announcement" ? (
          <>
            <hr className={styles.divider} />
            <div className={styles.infoRow}>
              <div>
                <p className={styles.infoLabel}>Заработная плата:</p>
                <h3 className={styles.infoValue}>
                  от {job.minWage} до {job.maxWage}{" "}
                  {currencyMap[job.currency] || job.currency}
                </h3>
              </div>
              <div>
                <p className={styles.infoLabel}>Занятость:</p>
                <h3 className={styles.infoValue}>
                  {employmentTypeMap[job.employmentType] || job.employmentType}
                </h3>
              </div>
              <div>
                <p className={styles.infoLabel}>Формат работы:</p>
                <h3 className={styles.infoValue}>
                  {jobFormatMap[job.jobFormat] || job.jobFormat}
                </h3>
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Чем предстоит заниматься</h2>
              <p className={styles.sectionText}>{job.whatToDo}</p>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Что ждём от кандидата</h2>
              <p className={styles.sectionText}>{job.expectations}</p>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Что предлагаем</h2>
              <p className={styles.sectionText}>{job.weOffer}</p>
            </div>
          </>
        ) : (
          <>
            <hr className={styles.divider} />
            <div className={styles.contactsList}>
              <div className={styles.contactItem}>
                <img
                  src="/icons/pochta.svg"
                  alt="pochta"
                  className={styles.contactIcon}
                />
                <span>{job.email || "-"}</span>
              </div>
              <div className={styles.contactItem}>
                <img
                  src="/icons/telegram.svg"
                  alt="telegram"
                  className={styles.contactIcon}
                />
                <span>{job.telegram || "-"}</span>
              </div>
              <div className={styles.contactItem}>
                <img
                  src="/icons/vk.svg"
                  alt="vk"
                  className={styles.contactIcon}
                />
                <span>{job.vk || "-"}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
