import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./routes/dashboard/dashboard.component";
import Navigation from "./routes/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import Post from "./routes/post/post.component";
import PrivateRoute from "./components/private-route/private-route.component";
import Settings from "./routes/settings/settings.component";
import Analytics from "./routes/analytics/analytics.component";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigation />}>
                    <Route
                        index
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="post"
                        element={
                            <PrivateRoute>
                                <Post />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="settings"
                        element={
                            <PrivateRoute>
                                <Settings />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="analytics"
                        element={
                            <PrivateRoute>
                                <Analytics />
                            </PrivateRoute>
                        }
                    />
                    <Route path="auth" element={<Authentication />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
