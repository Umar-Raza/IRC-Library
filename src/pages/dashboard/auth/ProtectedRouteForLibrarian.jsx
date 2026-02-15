import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRouteForLibrarian = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null; 

    if (user && user.email === "umar@gmail.com") {
        return children;
    } else {
        return <Navigate to="/librarian-login" />;
    }
};