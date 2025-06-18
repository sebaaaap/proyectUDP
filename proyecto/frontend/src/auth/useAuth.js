import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAuth = ({ redirectTo = "/" } = {}) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/me", { withCredentials: true })
      .then((res) => {
        setUsuario(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate(redirectTo);
      });
  }, [navigate, redirectTo]);

  return { usuario, loading };
};

export default useAuth;