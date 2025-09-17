import { useEffect } from "react";

import api from "../../../shared/api/api";
import { useProfileDecorStore } from "../../../shared/store/profileDecorStore";

export default function useProfileDecorSettings() {
  const { decor, loading, error, setDecor, setLoading, setError } =
    useProfileDecorStore();

  useEffect(() => {
    if (!decor) {
      setLoading(true);
      api
        .get("/user/get-decor-settings")
        .then((res) => {
          setDecor(res.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => setLoading(false));
    }
  }, [decor, setDecor, setError, setLoading]);

  return {
    coverFileName: decor?.coverFileName || "",
    logoFileName: decor?.logoFileName || "",
    loading,
    error,
  };
}
