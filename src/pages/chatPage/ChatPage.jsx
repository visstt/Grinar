import Header from "../../shared/ui/components/header/Header";
import styles from "./ChatPage.module.css";
import ChatHeader from "./components/chatContent/chatHeader/ChatHeader";
import ChatSidebar from "./components/chatSidebar/ChatSidebar";

export default function ChatPage() {
  return (
    <div>
      <Header darkBackground={true} />
      <div className={styles.chatPage}>
        <ChatSidebar />
        <div className={styles.chatContent}>
          <ChatHeader />
          <div className={styles.messages}>
            <div className={styles.messageWrapper}>
              <div className={styles.myMessage}>
                <p>
                  Она вечно ревновала: к баристе, к соседке, к старой подруге,
                  даже к кошке. Телефон мой — под замком, хотя я ей всё
                  показывал. А потом как-то задержалась на ночь у "подруги". Я
                  не дурак — проверил. Там не подруга, там коллега по цеху с
                  татухой на шее и губами, как у уточки. Сценарий банальный: "Мы
                  просто пили, ничего не планировали, всё само случилось…" А я
                  вспоминаю, как однажды забыл лайк убрать с фото фитоняшки, и
                  мне устроили допрос с пристрастием. Вывод? Кто больше всех
                  орёт "где ты и с кем" — тот, скорее всего, сам с кем-то.
                </p>
              </div>
              <span className={styles.messageTime}>14:30</span>
            </div>
            <div className={styles.messageWrapper}>
              <div className={styles.otherMessage}>
                <p>
                  Я не ревную, но иногда мне кажется, что ты слишком близко
                  общаешься с другими.
                </p>
              </div>
              <span className={styles.messageTime}>14:32</span>
            </div>
          </div>
          <div className={styles.inputField}>
            <img
              src="/icons/chat/folder.svg"
              alt="folder"
              className={styles.icon}
            />
            <input type="text" />
            <img
              src="/icons/chat/emoji.svg"
              alt="emoji"
              className={styles.icon}
            />
            <img
              src="/icons/chat/send.svg"
              alt="send"
              className={styles.icon}
            />
            <img
              src="/icons/chat/microphone.svg"
              alt="microphone"
              className={styles.icon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
