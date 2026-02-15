import { Navigate } from "react-router-dom";

export const PublicRouteForLibrarian = ({ children }) => {
    const librarian = JSON.parse(localStorage.getItem("librarian"));
    if (librarian?.email === "umar@gmail.com") {
        return <Navigate to="/librarian-dashboard" />;
    }
    return children;
};