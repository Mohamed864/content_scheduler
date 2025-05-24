import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import Post from "./routes/post/post.component";
import PrivateRoute from "./components/private-route/private-route.component";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigation />}>
                    <Route
                        index
                        element={
                            <PrivateRoute>
                                <Home />
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
                    <Route path="auth" element={<Authentication />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
