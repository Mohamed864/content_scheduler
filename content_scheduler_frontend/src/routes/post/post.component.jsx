import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useUserValue } from "../../context/user.context";
import "./post.styles.scss";

const Post = () => {
    const { token } = useUserValue();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: null,
        platforms: [],
        scheduled_time: "",
        status: "",
    });
    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [charCount, setCharCount] = useState(0);
    const [maxChars, setMaxChars] = useState(280); // Default Twitter limit
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Fetch available platforms
    useEffect(() => {
        const fetchPlatforms = async () => {
            try {
                const response = await axios.get("/platforms", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAvailablePlatforms(response.data);
            } catch (error) {
                console.error("Error fetching platforms:", error);
            }
        };
        fetchPlatforms();
    }, [token]);

    // Update character count and platform-specific limits
    useEffect(() => {
        setCharCount(formData.content.length);

        const types = formData.platforms.map((p) => p?.type);

        if (types.includes("twitter")) {
            setMaxChars(280); // Twitter limit
        } else if (types.includes("linkedin")) {
            setMaxChars(3000); // LinkedIn limit
        } else if (types.includes("facebook")) {
            setMaxChars(63206); // Facebook post max approx 63k chars
        } else if (types.includes("instagram")) {
            setMaxChars(2200); // Instagram caption max chars
        } else if (types.includes("pinterest")) {
            setMaxChars(500); // Pinterest description max chars
        } else if (types.includes("reddit")) {
            setMaxChars(40000); // Reddit post max chars approx
        } else if (types.includes("tumblr")) {
            setMaxChars(25000); // Tumblr post max chars approx
        } else {
            setMaxChars(5000); // Default fallback limit
        }
    }, [formData.content, formData.platforms]);

    // Revoke object URL on cleanup (avoid memory leak)
    useEffect(() => {
        let objectUrl;
        if (formData.image) {
            objectUrl = URL.createObjectURL(formData.image);
        }
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [formData.image]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleImageChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handlePlatformToggle = (platform) => {
        if (!platform?.id) return;
        setFormData((prev) => ({
            ...prev,
            platforms: prev.platforms.some((p) => p.id === platform.id)
                ? prev.platforms.filter((p) => p.id !== platform.id)
                : [...prev.platforms, platform],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Client-side validation
        const newErrors = {};
        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.content) newErrors.content = "Content is required";
        if (!formData.status) newErrors.status = "Status is required";
        if (formData.content.length > maxChars)
            newErrors.content = `Content exceeds ${maxChars} character limit`;
        if (formData.platforms.length === 0)
            newErrors.platforms = "Select at least one platform";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const formPayload = new FormData();
            formPayload.append("title", formData.title);
            formPayload.append("content", formData.content);
            formPayload.append("status", formData.status);
            if (formData.scheduled_time)
                formPayload.append("scheduled_time", formData.scheduled_time);
            formData.platforms.forEach((p) =>
                formPayload.append("platform_ids[]", p.id)
            );
            if (formData.image) formPayload.append("image", formData.image);

            await axios.post("/posts", formPayload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            navigate("/dashboard"); // Redirect to posts list
        } catch (error) {
            console.error("Error creating post:", error);

            if (error.response?.data) {
                console.error(
                    "Backend validation errors:",
                    error.response.data
                );
                setErrors(
                    error.response.data.errors || {
                        general:
                            error.response.data.message ||
                            "Failed to create post.",
                    }
                );
            } else {
                setErrors({
                    general: "Failed to create post. Please try again.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="post-editor-container">
            <h2>Create New Post</h2>
            {errors.general && (
                <div className="error-message">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Title Field */}
                <div className="form-group">
                    <label htmlFor="title">Title*</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={errors.title ? "error" : ""}
                    />
                    {errors.title && (
                        <span className="error-message">{errors.title}</span>
                    )}
                </div>

                {/* Content Field with Character Counter */}
                <div className="form-group">
                    <label htmlFor="content">Content*</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className={errors.content ? "error" : ""}
                        rows={6}
                    />
                    <div
                        className={`char-counter ${
                            charCount > maxChars ? "error" : ""
                        }`}
                    >
                        {charCount}/{maxChars} characters
                    </div>
                    {errors.content && (
                        <span className="error-message">{errors.content}</span>
                    )}
                </div>

                {/* Image Upload */}
                <div className="form-group">
                    <label htmlFor="image">Image (Optional)</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {formData.image && (
                        <div className="image-preview">
                            <img
                                src={URL.createObjectURL(formData.image)}
                                alt="Preview"
                                className="preview-image"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        image: null,
                                    }))
                                }
                                className="remove-image"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                {/* Platform Selector */}
                <div className="form-group">
                    <label>Platforms*</label>
                    {errors.platforms && (
                        <span className="error-message">
                            {errors.platforms}
                        </span>
                    )}
                    <div className="platform-selector">
                        {availablePlatforms.map((platform) => (
                            <div
                                key={platform.id}
                                className={`platform-option ${
                                    formData.platforms.some(
                                        (p) => p.id === platform.id
                                    )
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => handlePlatformToggle(platform)}
                            >
                                <span>{platform.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Selection */}
                <div className="form-group">
                    <label htmlFor="status">Status*</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={errors.status ? "error" : ""}
                    >
                        <option value="">-- Select Status --</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                        {/* Add more status options if your backend supports */}
                    </select>
                    {errors.status && (
                        <span className="error-message">{errors.status}</span>
                    )}
                </div>

                {/* Date/Time Picker */}
                <div className="form-group">
                    <label htmlFor="scheduled_time">
                        Schedule Post (Leave empty for immediate posting)
                    </label>
                    <input
                        type="datetime-local"
                        id="scheduled_time"
                        name="scheduled_time"
                        value={formData.scheduled_time}
                        onChange={handleChange}
                        min={new Date().toISOString().slice(0, 16)}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Publishing..." : "Publish Post"}
                </button>
            </form>
        </div>
    );
};

export default Post;
