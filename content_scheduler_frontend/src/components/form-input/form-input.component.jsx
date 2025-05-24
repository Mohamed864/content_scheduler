import "./form-input.styles.scss";

const FormInput = ({ label, error, ...otherProps }) => {
    return (
        <div className="group">
            <input
                className={`form-input ${error ? "error" : ""}`}
                {...otherProps}
            />
            {label && (
                <label
                    className={`${
                        otherProps.value?.length ? "shrink" : ""
                    } form-input-label`}
                >
                    {label}
                </label>
            )}
            {error && (
                <span className="error-message">
                    {Array.isArray(error) ? error[0] : error}
                </span>
            )}
        </div>
    );
};

export default FormInput;
