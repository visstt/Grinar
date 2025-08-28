import { useMemo } from "react";

import Header from "../../shared/ui/components/header/Header";
import styles from "./PaymentPage.module.css";
import {
  useCreatePaymentLink,
  useSubscriptions,
} from "./hooks/useSubscriptions";

export default function PaymentPage() {
  const { subscriptions, loading: subsLoading } = useSubscriptions();
  const { createLink, loading: payLoading } = useCreatePaymentLink();

  // Получаем id нужных подписок
  const proId = useMemo(
    () => subscriptions.find((s) => s.name?.toLowerCase() === "pro")?.id,
    [subscriptions],
  );
  const premiumId = useMemo(
    () => subscriptions.find((s) => s.name?.toLowerCase() === "premium")?.id,
    [subscriptions],
  );

  const handlePay = async (subscriptionId) => {
    const res = await createLink(subscriptionId);
    // Проверяем, что ссылка лежит в res.data.paymentLink
    if (res && res.data && res.data.paymentLink) {
      window.location.href = res.data.paymentLink;
    }
  };

  return (
    <div>
      <Header darkBackground={true} />
      <div className={styles.container}>
        <div className="container">
          <div className={styles.content_wrappper}>
            <h1>Подписка на BENTY</h1>
          </div>
          <div className={styles.blocks}>
            <div className={styles.block_pro}>
              <div className={styles.header}>
                <h3>PRO</h3>
                <p>1200₽/месяц</p>
              </div>
              <div className={styles.main}>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-pro.svg"
                    alt="tick-square-pro"
                  />
                  <p>
                    <b>Выделяющийся профиль</b> — станете заметнее среди
                    конкурентов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-pro.svg"
                    alt="tick-square-pro"
                  />
                  <p>
                    <b>Эксклюзивные заказы более 50 тыс. руб</b> — привлекайте
                    крупных клиентов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-pro.svg"
                    alt="tick-square-pro"
                  />
                  <p>
                    <b>Дополнительный рейтинг +10%</b> — поднимитесь выше в
                    списке исполнителей.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-pro.svg"
                    alt="tick-square-pro"
                  />
                  <p>
                    <b>Два направления работы</b> — укажите компетенции для
                    роста заказов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-pro.svg"
                    alt="tick-square-pro"
                  />
                  <p>
                    Размещение большого объёма текста сверх лимита в 1024
                    символа в разделе блог.
                  </p>
                </div>
              </div>
              <button
                className={styles.btnpro}
                disabled={subsLoading || payLoading || !proId}
                onClick={() => handlePay(proId)}
              >
                Оформить PRO
              </button>
            </div>

            <div className={styles.block_premium}>
              <div className={styles.header}>
                <h3 className={styles.prem}>PREMIUM</h3>
                <p>2000₽/месяц</p>
              </div>
              <div className={styles.main}>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-prem.svg"
                    alt="tick-square-prem"
                  />
                  <p>
                    <b>Выделяющийся профиль</b> — станете заметнее среди
                    конкурентов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-prem.svg"
                    alt="tick-square-prem"
                  />
                  <p>
                    <b>Эксклюзивные заказы более 100 тыс. руб</b> — привлекайте
                    крупных клиентов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-prem.svg"
                    alt="tick-square-prem"
                  />
                  <p>
                    <b>Дополнительный рейтинг +20%</b> — поднимитесь выше в
                    списке исполнителей.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-prem.svg"
                    alt="tick-square-prem"
                  />
                  <p>
                    <b>Три направления работы</b> — укажите максимум компетенций
                    для роста заказов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img
                    src="/icons/payment/tick-square-prem.svg"
                    alt="tick-square-prem"
                  />
                  <p>
                    Размещение большого объёма текста сверх лимита в 4000
                    символа в разделе блог.
                  </p>
                </div>
              </div>
              <button
                className={styles.btnprem}
                disabled={subsLoading || payLoading || !premiumId}
                onClick={() => handlePay(premiumId)}
              >
                Оформить PREMIUM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
