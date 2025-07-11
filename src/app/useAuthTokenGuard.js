import { useEffect } from "react";

import { useUserStore } from "../shared/store/userStore";

export default function useAuthTokenGuard() {
  useEffect(() => {
    useUserStore.getState().clearIfTokenExpired();
  }, []);
}
