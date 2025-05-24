import "./sign-in-form.styles.scss";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
    const [formFields, setFormFields] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formFields;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const { data } = await axios.post("/login", {
                email,
                password,
            });

            // Store token and user data
            localStorage.setItem("ACCESS_TOKEN", data.data.token);
            localStorage.setItem("USER", JSON.stringify(data.data.user));

            console.log("Login successful:", data);
            navigate("/"); // Redirect to home after login
        } catch (error) {
            if (error.response?.status === 422) {
                // Validation errors from Laravel
                setErrors(error.response.data.errors || {});
            } else if (error.response?.status === 401) {
                setErrors({
                    password: ["Invalid credentials. Please try again."],
                });
            } else {
                console.error("Login error:", error);
                setErrors({
                    general: [
                        "An unexpected error occurred. Please try again.",
                    ],
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sign-up-container">
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            {errors.general && (
                <div className="error-message">{errors.general[0]}</div>
            )}
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                />

                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                />
                <div className="buttons-container">
                    <CustomButton type="submit" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
};

export default SignInForm;
