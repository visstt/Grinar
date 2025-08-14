import { useLocation } from "react-router-dom";

import Header from "../../shared/ui/components/header/Header";
import styles from "./ChatPage.module.css";
import ChatContent from "./components/ChatContent";
import { ChatProvider } from "./context/ChatContext";

export default function ChatPage() {
  const location = useLocation();
  const contactUserId = location.state?.contactUserId;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header darkBackground={true} />
      <ChatProvider contactUserId={contactUserId}>
        <div className={styles.chatPage}>
          <ChatContent initialShowSidebar={window.innerWidth > 700} />
        </div>
      </ChatProvider>
    </div>
  );
}
