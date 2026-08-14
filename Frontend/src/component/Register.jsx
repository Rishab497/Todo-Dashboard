import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");

    const submitData = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await axios.post(
                "https://todo-dashboard-mu9i.onrender.com/api/auth/register",
                {
                    name: name,
                    email: email,
                    password: password
                }
            );

            alert("Registration Successful");

            navigate("/login");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
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

                <h1>CREATE ACCOUNT</h1>

                <p className="auth-subtitle">
                    &gt; CREATE NEW USER_
                </p>

                <form onSubmit={submitData}>

                    <div className="input-group">
                        <label>NAME</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />
                    </div>

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
                            placeholder="Create your password"
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
                        {loading
                            ? "REGISTERING..."
                            : "CREATE ACCOUNT"}
                    </button>

                </form>

                <p className="auth-switch">
                    ALREADY HAVE AN ACCOUNT?{" "}
                    <Link to="/login">
                        LOGIN
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;