import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";

const PrivateComponent = ({ children, is_component = false }) => {
  const { user } = useAuth();
  if (!user) {
    // l'utilisateur n'est pas authentifié
    return is_component ? null : <Navigate to="/login" />;
  }
  return children;
};

export default PrivateComponent;
