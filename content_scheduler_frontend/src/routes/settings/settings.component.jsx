import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import logger from "../../utils/Logger";
import "./settings.styles.scss";

const Settings = () => {
    const [platforms, setPlatforms] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState("");
    const [loadingPlatforms, setLoadingPlatforms] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [error, setError] = useState("");

    // Fetch platforms
    const fetchPlatforms = async () => {
        setLoadingPlatforms(true);
        setError("");
        try {
            const response = await axios.get("/platforms");
            logger.log("Fetched Platforms", response.data || []);
            setPlatforms(response.data || []);
        } catch (err) {
            console.error("Failed to fetch platforms", err);
            setError("Could not load platforms.");
        } finally {
            setLoadingPlatforms(false);
        }
    };

    // Fetch posts for post selection dropdown
    const fetchPosts = async () => {
        setLoadingPosts(true);
        setError("");
        try {
            const response = await axios.get("/posts"); // adjust endpoint if needed
            logger.log("Fetched Posts", response.data.data || []);
            setPosts(response.data.data || []);
        } catch (err) {
            console.error("Failed to fetch posts", err);
            setError("Could not load posts.");
        } finally {
            setLoadingPosts(false);
        }
    };

    // Toggle platform status for the selected post
    const togglePlatform = async (platformId) => {
        if (!selectedPostId) {
            setError("Please select a post first.");
            return;
        }

        try {
            await axios.post(`/platforms/${platformId}/toggle`, {
                post_id: selectedPostId,
            });

            //logger
            logger.log(
                "Toggle Platform",
                `Toggled platform ID ${platformId} for post ${selectedPostId}`
            );
            //refresh platforms list to show updated status
            fetchPlatforms();
            setError("");
        } catch (err) {
            logger.log(
                "Toggle Platform Failed",
                `Platform ID ${platformId}, Post ID ${selectedPostId}, Error: ${err.message}`
            );
            console.error("Failed to toggle platform", err);

            if (err.response?.status === 422 && err.response?.data) {
                console.error(
                    "Validation errors:",
                    err.response.data.errors || err.response.data.message
                );
                setError(
                    err.response.data.errors
                        ? Object.values(err.response.data.errors)
                              .flat()
                              .join(", ")
                        : err.response.data.message || "Validation failed."
                );
            } else {
                setError("Toggling failed. Please try again.");
            }
        }
    };

    useEffect(() => {
        fetchPlatforms();
        fetchPosts();
    }, []);

    return (
        <div className="settings">
            <h2>Platform Management</h2>

            {error && <p className="error">{error}</p>}

            <label>
                Select Post:{" "}
                {loadingPosts ? (
                    <span>Loading posts...</span>
                ) : (
                    <select
                        value={selectedPostId}
                        onChange={(e) => setSelectedPostId(e.target.value)}
                    >
                        <option value="">-- Select a post --</option>
                        {posts.map((post) => (
                            <option key={post.id} value={post.id}>
                                {post.title}
                            </option>
                        ))}
                    </select>
                )}
            </label>

            {loadingPlatforms ? (
                <p>Loading platforms...</p>
            ) : (
                <ul className="platform-list">
                    {platforms.length === 0 && <li>No platforms found.</li>}
                    {platforms.map((platform) => (
                        <li key={platform.id}>
                            <div className="platform-info">
                                <span className="name">{platform.name}</span>
                                <span
                                    className={`status ${
                                        platform.enabled
                                            ? "enabled"
                                            : "disabled"
                                    }`}
                                >
                                    {platform.enabled ? "Enabled" : "Disabled"}
                                </span>
                            </div>
                            <button onClick={() => togglePlatform(platform.id)}>
                                Toggle
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Settings;
