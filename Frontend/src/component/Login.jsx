import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");

    const submitData = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://todo-dashboard-mu9i.onrender.com/api/auth/login",
                {
                    email,
                    password
                }
            );

            console.log("LOGIN RESPONSE:", response.data);

            // Save token
            localStorage.setItem("token", response.data.token);

            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            // Redirect
            navigate("/todo");

        } catch (error) {
            console.log("LOGIN ERROR:", error.response?.data);

            setError(
                error.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-box">

                <div className="terminal-label">
                    TODO SYSTEM
                </div>

                <h1>LOGIN ACCOUNT</h1>

                <p className="auth-subtitle">
                    &gt; ENTER YOUR CREDENTIALS_
                </p>

                <form onSubmit={submitData}>

                    <div className="input-group">
                        <label>EMAIL</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>PASSWORD</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    {error && (
                        <p className="error">
                            [ ERROR ] {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "LOGGING IN..." : "LOGIN"}
                    </button>

                </form>

                <p className="auth-switch">
                    DON'T HAVE AN ACCOUNT?{" "}
                    <Link to="/register">
                        REGISTER
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;