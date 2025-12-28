import { Navigate } from "react-router-dom";
import authStore from "../store/auth.store";

interface PrivateRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "agent" | "customer";
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userRole = authStore.currentUser?.role;

    // בדיקה 1: האם מחובר?
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // בדיקה 2: האם יש הרשאה?
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    // הכל בסדר, הצג את הדף
    return <>{children}</>;
};

export default PrivateRoute;
