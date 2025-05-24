import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    const isPublic = ["/login", "/register", "/logout"].some((url) =>
        config.url.includes(url)
    );

    if (!isPublic && token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    console.log("Calling:", config.url);
    console.log(
        "Authorization Header:",
        config.headers?.Authorization || "None"
    );

    return config;
});

export default instance;

instance.interceptors.response.use(
    (response) => {
        const { data } = response;
        console.log(data.data.user);
        console.log(data.data.token);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("USER");
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    }
);
