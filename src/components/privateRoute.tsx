import { Navigate } from "react-router-dom";
import authStore from "../store/auth.store";
import { observer } from "mobx-react-lite";

interface PrivateRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "agent" | "customer";
}

const PrivateRoute: React.FC<PrivateRouteProps> = observer(({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userRole = authStore.currentUser?.role;

    // בדיקה 1: האם מחובר?
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // אם המשתמש מחובר אבל המידע שלו עדיין לא נטען מהשרת, נחכה (או נציג טעינה)
    if (!authStore.currentUser && authStore.token) {
        return null; // או קומפוננטת טעינה
    }

    // בדיקה 2: האם יש הרשאה?
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    // הכל בסדר, הצג את הדף
    return <>{children}</>;
});

export default PrivateRoute;
