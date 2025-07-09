import { useEffect, useState } from "react";

import api from "../../../shared/api/api";

export default function useProfileDecorSettings() {
  const [coverFileName, setCoverFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/user/get-decor-settings")
      .then((res) => {
        const coverFileName = res.data?.coverFileName;

        setCoverFileName(coverFileName || "");
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { coverFileName, loading, error };
}
