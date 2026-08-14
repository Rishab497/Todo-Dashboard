import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Todo() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [todos, setTodos] = useState([]);

    const [editId, setEditID] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const token = localStorage.getItem("token");

    const API_URL =
        "https://todo-dashboard-mu9i.onrender.com/api/todos";

    const getTodo = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTodos(response.data);

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to view tasks"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        getTodo();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const addTodo = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a task");
            return;
        }

        try {
            await axios.post(
                API_URL,
                {
                    title: title,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTitle("");

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to add a task"
            );
        }
    };

    const updateTask = async (id) => {
        if (!editTitle.trim()) {
            alert("Please enter a task");
            return;
        }

        try {
            await axios.put(
                `${API_URL}/${id}`,
                {
                    title: editTitle,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEditID(null);
            setEditTitle("");

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };

    const toggleTodo = async (todo) => {
        try {
            await axios.put(
                `${API_URL}/${todo._id}`,
                {
                    completed: !todo.completed,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };

    const startEdit = (todo) => {
        setEditID(todo._id);
        setEditTitle(todo.title);
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(
                `${API_URL}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    return (
        <div className="todo-page">

            <div className="todo-container">

                {/* HEADER */}

                <div className="todo-header">

                    <div>
                        <div className="terminal-label">
                            TODO SYSTEM
                        </div>

                        <h1>TODO DASHBOARD</h1>
                    </div>

                    <button
                        onClick={logout}
                        className="logout-button"
                    >
                        LOGOUT
                    </button>

                </div>

                {/* ADD TODO */}

                <form
                    onSubmit={addTodo}
                    className="todo-add"
                >

                    <input
                        type="text"
                        placeholder="ENTER NEW TASK..."
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <button type="submit">
                        ADD
                    </button>

                </form>

                {/* LOADING */}

                {loading && (
                    <p className="loading">
                        &gt; LOADING TASKS...
                    </p>
                )}

                {/* ERROR */}

                {error && (
                    <p className="error">
                        [ ERROR ] {error}
                    </p>
                )}

                {/* EMPTY */}

                {!loading && todos.length === 0 && (
                    <div className="empty-todos">
                        &gt; NO TASKS FOUND_
                        <br />
                        &gt; ADD YOUR FIRST TASK
                    </div>
                )}

                {/* TODO LIST */}

                {!loading && todos.length > 0 && (

                    <div className="todo-list">

                        {todos.map((todo) => (

                            <div
                                className="todo-item"
                                key={todo._id}
                            >

                                {editId === todo._id ? (

                                    /* EDIT MODE */

                                    <>

                                        <div className="todo-content">

                                            <input
                                                className="edit-input"
                                                value={editTitle}
                                                onChange={(e) =>
                                                    setEditTitle(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                        <div className="todo-actions">

                                            <button
                                                onClick={() =>
                                                    updateTask(
                                                        todo._id
                                                    )
                                                }
                                            >
                                                SAVE
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditID(null);
                                                    setEditTitle("");
                                                }}
                                            >
                                                CANCEL
                                            </button>

                                        </div>

                                    </>

                                ) : (

                                    /* NORMAL MODE */

                                    <>

                                        <div className="todo-content">

                                            <p
                                                className={
                                                    todo.completed
                                                        ? "todo-title todo-completed"
                                                        : "todo-title"
                                                }
                                            >
                                                {todo.title}
                                            </p>

                                            <div className="todo-status">

                                                {todo.completed
                                                    ? "[ COMPLETED ]"
                                                    : "[ PENDING ]"}

                                            </div>

                                        </div>

                                        <div className="todo-actions">

                                            <button
                                                onClick={() =>
                                                    toggleTodo(todo)
                                                }
                                            >
                                                {todo.completed
                                                    ? "UNDO"
                                                    : "DONE"}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    startEdit(todo)
                                                }
                                            >
                                                EDIT
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteTodo(
                                                        todo._id
                                                    )
                                                }
                                            >
                                                DELETE
                                            </button>

                                        </div>

                                    </>

                                )}

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Todo;