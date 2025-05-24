import { useState } from "react";
import "./sign-up-form.styles.scss";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import axios from "../../api/axios";
import { useUserValue } from "../../context/user.context";

const SignUpForm = () => {
    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { setUser } = useUserValue();

    const { name, email, password, confirmPassword } = formFields;

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

        // Client-side validation
        if (password !== confirmPassword) {
            setErrors({ confirmPassword: ["Passwords do not match"] });
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await axios.post("/register", {
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            });

            // Store user data
            setUser(data.data.user);
            console.log("Registration successful:", data);
        } catch (error) {
            if (error.response?.status === 422) {
                // Validation errors from Laravel
                setErrors(error.response.data.errors || {});
            } else {
                console.error("Registration error:", error);
                setErrors({
                    general: ["Registration failed. Please try again."],
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sign-up-container">
            <h2>Don't have an account?</h2>
            <span>Sign up with your email and password</span>

            {errors.general && (
                <div className="error-message">{errors.general[0]}</div>
            )}

            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                />

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

                <FormInput
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    error={
                        errors.confirmPassword || errors.password_confirmation
                    }
                    required
                />

                <div className="buttons-container">
                    <CustomButton type="submit" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
