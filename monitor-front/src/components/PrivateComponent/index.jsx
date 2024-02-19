import { Navigate } from "react-router-dom";
import { useAuth } from "../../providers/Auth/hooks";

const PrivateComponent = ({ children, is_component = false }) => {
  const { user } = useAuth();
  if (!user) {
    // if user isn't authenticated, redirect to login page
    return is_component ? null : <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateComponent;
