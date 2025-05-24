import { createContext, useState, useContext } from "react";

const UserContext = createContext({
    currentUser: null,
    token: null,
    setCurrentUser: () => {},
    setToken: () => {},
});

export const UserProvider = ({ children }) => {
    const [currentUser, _setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem("USER");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, _setToken] = useState(() => {
        return localStorage.getItem("ACCESS_TOKEN");
    });

    const setCurrentUser = (user) => {
        _setCurrentUser(user);
        if (user) {
            localStorage.setItem("USER", JSON.stringify(user));
        } else {
            localStorage.removeItem("USER");
        }
    };

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
            console.log(localStorage.getItem("ACCESS_TOKEN"));
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    return (
        <UserContext.Provider
            value={{ currentUser, token, setCurrentUser, setToken }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserValue = () => useContext(UserContext);
