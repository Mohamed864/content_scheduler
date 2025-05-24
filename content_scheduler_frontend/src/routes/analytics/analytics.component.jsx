import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get("/analytics");
                setAnalytics(response.data);
            } catch (err) {
                setError("Error fetching analytics.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="analytics">
            <h2>Post Analytics</h2>
            <p>
                <strong>Total Posts:</strong> {analytics.total_posts} |{" "}
                <strong>Published:</strong> {analytics.total_published} |{" "}
                <strong>Scheduled:</strong> {analytics.total_scheduled} |{" "}
                <strong>Success Rate:</strong> {analytics.overall_success_rate}%
            </p>

            <table>
                <thead>
                    <tr>
                        <th>Platform</th>
                        <th>Total</th>
                        <th>Published</th>
                        <th>Scheduled</th>
                        <th>Success Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {analytics.platforms.map((platform) => (
                        <tr key={platform.id}>
                            <td>{platform.name}</td>
                            <td>{platform.posts_count}</td>
                            <td>{platform.published_count}</td>
                            <td>{platform.scheduled_count}</td>
                            <td>{platform.success_rate}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Analytics;
