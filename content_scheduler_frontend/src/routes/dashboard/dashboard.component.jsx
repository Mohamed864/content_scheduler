import { useState, useEffect } from "react";
import axios from "../../api/axios";
import logger from "../../utils/Logger";

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const fetchPosts = async () => {
        setLoading(true);
        setErrors(null); //clear previous errors

        try {
            const response = await axios.get("/posts/filterByStatusAndDate", {
                params: {
                    status: statusFilter || undefined,
                    date: dateFilter || undefined,
                },
            });
            logger.log("Fetched posts:", response.data.data);
            setPosts(response.data.data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            if (error.response?.data) {
                console.error("Backend errors:", error.response.data);
                setErrors(
                    error.response.data.errors || {
                        general:
                            error.response.data.message ||
                            "Failed to fetch posts.",
                    }
                );
            } else {
                setErrors({
                    general: "Failed to fetch posts. Please try again.",
                });
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [statusFilter, dateFilter]);

    return (
        <div>
            <h1>Dashboard</h1>

            {/* Filters */}
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Status:
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </label>

                <label style={{ marginLeft: "1rem" }}>
                    Date:
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </label>
            </div>

            {/* Errors */}
            {errors?.general && (
                <div style={{ color: "red", marginBottom: "1rem" }}>
                    {errors.general}
                </div>
            )}

            {/* Posts List */}
            {loading ? (
                <p>Loading posts...</p>
            ) : (
                <ul>
                    {posts.length === 0 && <li>No posts found.</li>}
                    {posts.map((post) => (
                        <li key={post.id}>
                            <strong>{post.title}</strong> -{" "}
                            <em>Status: {post.status}</em> - Scheduled:{" "}
                            {new Date(post.scheduled_time).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
