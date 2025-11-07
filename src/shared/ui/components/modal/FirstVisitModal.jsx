import React, { useEffect, useRef, useState } from "react";

import { X } from "lucide-react";

import api from "../../../api/api";
import { getPhotoUrl } from "../../../utils/getProjectImageUrl";
import Button from "../button/Button";
import styles from "./FirstVisitModal.module.css";
import useClickOutside from "./useClickOutside";

export default function FirstVisitModal({ open, onClose }) {
  const modalRef = useRef(null);
  const [jobCard, setJobCard] = useState(null);
  const [originalJob, setOriginalJob] = useState(null); // Сохраняем оригинальные данные для навигации

  useClickOutside(modalRef, onClose);

  const handleCardClick = () => {
    if (originalJob) {
      // Закрываем модальное окно и переходим на страницу работы с параметром job
      onClose();
      window.location.href = `/work?job=${originalJob.id}`;
    }
  };

  useEffect(() => {
    async function fetchJobCard() {
      try {
        const response = await api.get("/advertisement/all-jobs");
        const jobs = response.data;

        console.log("[FirstVisitModal] All jobs:", jobs);

        // Ищем карточку с названием "SMM-специалист в Garda Wallet" (учитываем возможные пробелы)
        const smmJob = jobs?.find(
          (job) =>
            job.name?.includes("SMM-специалист") &&
            job.name?.includes("Garda Wallet"),
        );

        console.log("[FirstVisitModal] Found SMM job:", smmJob);

        if (smmJob) {
          const jobFormatMap = {
            office: "Офис",
            remote: "Удалённо",
            hybrid: "Гибрид",
            Удаленно: "Удалённо",
            Офис: "Офис",
            Гибрид: "Гибрид",
          };

          // Сохраняем оригинальные данные для навигации
          setOriginalJob(smmJob);

          setJobCard({
            title: smmJob.name,
            company: smmJob.companyName,
            location:
              jobFormatMap[smmJob.jobFormat] ||
              smmJob.jobFormat ||
              "Формат не указан",
            salary: `от ${smmJob.minWage?.toLocaleString()} ₽`,
            photoUrl: getPhotoUrl("advertisement", smmJob.photoName),
          });
        } else {
          // Фиксированная карточка если не найдена нужная вакансия
          setJobCard({
            title: "SMM-специалист в Garda Wallet",
            company: "Garda Wallet",
            location: "Удалённо",
            salary: "от 50 000 ₽",
            photoUrl: getPhotoUrl("advertisement", null),
          });
        }
      } catch (err) {
        // Фиксированная карточка при ошибке
        setJobCard({
          title: "SMM-специалист в Garda Wallet",
          company: "Garda Wallet",
          location: "Удалённо",
          salary: "от 50 000 ₽",
          photoUrl: getPhotoUrl("advertisement", null),
        });
        console.error("Error fetching jobs:", err);
      }
    }

    if (open) {
      fetchJobCard();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal} ref={modalRef}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        <div className={styles.content}>
          <div className={styles.title}>
            <h1>РАБОТА НА BENTY</h1>
            <p>На платформе новый раздел с вакансиями.</p>
          </div>
          <div className={styles.info}>
            <div className={styles.table}>
              <div className={styles.block}>
                <h3>01</h3>
                <h4>Регистрируйся на площадке</h4>
              </div>
              <div className={styles.block}>
                <h3>02</h3>
                <h4>Оформляй портфолио</h4>
              </div>
              <div className={styles.block}>
                <h3>03</h3>
                <h4>Откликайся и получай заказы</h4>
              </div>
            </div>
            <div className={styles.cardContainer}>
              {jobCard && (
                <div
                  className={styles.card}
                  onClick={handleCardClick}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.name}>
                    <p>Вакансия</p>
                    <h1>{jobCard.title}</h1>
                  </div>
                  <div className={styles.gap}>
                    <div className={styles.salary}>
                      <h2>{jobCard.salary}</h2>
                      <p>{jobCard.location}</p>
                    </div>
                    <div className={styles.user}>
                      <img src={jobCard.photoUrl} alt="company" />
                      <div>
                        <p>Работодатель</p>
                        <h3>{jobCard.company}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Button size="large">Зарегистрироваться и найти заказы</Button>
        </div>
      </div>
    </div>
  );
}
