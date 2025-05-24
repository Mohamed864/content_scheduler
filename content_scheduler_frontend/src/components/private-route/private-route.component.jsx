import { Navigate } from "react-router-dom";
import { useUserValue } from "../../context/user.context";

const PrivateRoute = ({ children }) => {
    const { currentUser } = useUserValue();
    console.log(currentUser);

    return currentUser ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
