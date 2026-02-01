import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { token, user } = useSelector((state) => state.auth);
console.log("AUTH STATE:", { token, user });

  if (!token) return <Navigate to="/login" />;

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
