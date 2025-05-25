import "./navigation.styles.scss";
import { Outlet, Link } from "react-router-dom";
import { Fragment } from "react";
import { useUserValue } from "../../context/user.context";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import logger from "../../utils/Logger";

const Navigation = () => {
    const { currentUser, setCurrentUser, setToken } = useUserValue();
    const navigate = useNavigate();

    const signOutUser = async (e) => {
        e.preventDefault();
        console.log("Sign out");

        try {
            await axios.post("/logout", null);
            logger.log("Logout successful");
            setCurrentUser(null);
            setToken(null);
            navigate("/auth");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Fragment>
            <div className="navigation">
                <Link className="logo-container" to="/">
                    DASHBOARD
                </Link>
                <div className="nav-links-container">
                    <Link className="nav-link" to="analytics">
                        ANALYTICS
                    </Link>
                    <Link className="nav-link" to="/post">
                        POST
                    </Link>
                    <Link className="nav-link" to="/settings">
                        SETTINGS
                    </Link>
                    {currentUser ? (
                        <span className="nav-link" onClick={signOutUser}>
                            SIGN OUT
                        </span>
                    ) : (
                        <Link className="nav-link" to="/auth">
                            SIGN IN
                        </Link>
                    )}
                </div>
            </div>
            <Outlet />
        </Fragment>
    );
};

export default Navigation;
