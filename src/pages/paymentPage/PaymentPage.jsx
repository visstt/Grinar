import Header from "../../shared/ui/components/header/Header";
import styles from "./PaymentPage.module.css";

export default function PaymentPage() {
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
                  <img src="/icons/payment/user.svg" alt="user" />
                  <p>
                    <b>Выделяющийся профиль</b> — станете заметнее среди
                    конкурентов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img src="/icons/payment/wallet.svg" alt="wallet" />
                  <p>
                    <b>Эксклюзивные заказы более 50 тыс. руб</b> — привлекайте
                    крупных клиентов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img src="/icons/payment/top.svg" alt="top" />
                  <p>
                    <b>Дополнительный рейтинг +10%</b> — поднимитесь выше в
                    списке исполнителей.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img src="/icons/payment/user.svg" alt="user" />
                  <p>
                    <b>Два направления работы</b> — укажите компетенции для
                    роста заказов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img src="/icons/payment/user.svg" alt="user" />
                  <p>
                    Размещение большого объёма текста сверх лимита в 1024
                    символа в разделе блог.
                  </p>
                </div>
              </div>
                <button className={styles.btnpro}>Оформить PRO</button>
            </div>

            <div className={styles.block_premium}>
              <div className={styles.header}>
                <h3 className={styles.prem}>PREMIUM</h3>
                <p>2000₽/месяц</p>
              </div>
              <div className={styles.main}>
                <div className={styles.line}>
                  <img src="/icons/payment/userPrem.svg" alt="user" />
                  <p>
                    <b>Выделяющийся профиль</b> — станете заметнее среди
                    конкурентов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img src="/icons/payment/walletPrem.svg" alt="wallet" />
                  <p>
                    <b>Эксклюзивные заказы более 100 тыс. руб</b> — привлекайте
                    крупных клиентов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img src="/icons/payment/topPrem.svg" alt="top" />
                  <p>
                    <b>Дополнительный рейтинг +20%</b> — поднимитесь выше в
                    списке исполнителей.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img src="/icons/payment/userPrem.svg" alt="user" />
                  <p>
                    <b>Три направления работы</b> — укажите максимум компетенций
                    для роста заказов.
                  </p>
                </div>
                <div className="stripe3"></div>
                <div className={styles.line}>
                  <img src="/icons/payment/userPrem.svg" alt="user" />
                  <p>
                    Размещение большого объёма текста сверх лимита в 1024
                    символа в разделе блог.
                  </p>
                </div>
              </div>
                <button className={styles.btnprem}>Оформить PREMIUM</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
