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

            const response = await axios.get(
                API_URL,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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

    const completedCount =
        todos.filter((todo) => todo.completed).length;

    const pendingCount =
        todos.filter((todo) => !todo.completed).length;

    return (
        <div className="todo-page">

            <div className="todo-container">

                {/* HEADER */}

                <header className="todo-header">

                    <div>

                        <div className="terminal-label">
                            &gt; TODO//SYSTEM
                        </div>

                        <h1>
                            TASK MANAGER
                        </h1>

                        <p className="todo-status">
                            ● SYSTEM ONLINE
                        </p>

                    </div>

                    <button
                        onClick={logout}
                        className="logout-button"
                    >
                        LOGOUT
                    </button>

                </header>


                {/* STATISTICS */}

                <section className="stats-panel">

                    <div className="stat-box">

                        <span className="stat-label">
                            TOTAL
                        </span>

                        <strong>
                            {todos.length}
                        </strong>

                    </div>

                    <div className="stat-box">

                        <span className="stat-label">
                            PENDING
                        </span>

                        <strong>
                            {pendingCount}
                        </strong>

                    </div>

                    <div className="stat-box">

                        <span className="stat-label">
                            COMPLETED
                        </span>

                        <strong>
                            {completedCount}
                        </strong>

                    </div>

                </section>


                {/* ADD TODO */}

                <section className="add-section">

                    <div className="section-title">
                        &gt; CREATE NEW TASK
                    </div>

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
                            + ADD TASK
                        </button>

                    </form>

                </section>


                {/* TASK LIST */}

                <section className="tasks-section">

                    <div className="tasks-heading">

                        <h2>
                            ACTIVE TASK DATABASE
                        </h2>

                        <span>
                            {todos.length} RECORD
                            {todos.length !== 1 ? "S" : ""}
                        </span>

                    </div>


                    {/* LOADING */}

                    {loading && (
                        <div className="system-message">
                            <span>&gt;</span>
                            LOADING TASK DATABASE...
                        </div>
                    )}


                    {/* ERROR */}

                    {error && (
                        <div className="error system-message">
                            <span>[ ERROR ]</span>
                            {error}
                        </div>
                    )}


                    {/* EMPTY */}

                    {!loading &&
                        todos.length === 0 && (
                            <div className="empty-todos">

                                <div className="empty-icon">
                                    [ _ ]
                                </div>

                                <h3>
                                    TASK DATABASE EMPTY
                                </h3>

                                <p>
                                    &gt; NO TASKS FOUND
                                </p>

                                <p>
                                    &gt; CREATE YOUR FIRST TASK ABOVE
                                </p>

                            </div>
                        )}


                    {/* TODO LIST */}

                    {!loading &&
                        todos.length > 0 && (

                            <div className="todo-list">

                                {todos.map((todo) => (

                                    <div
                                        className={
                                            todo.completed
                                                ? "todo-item completed-item"
                                                : "todo-item"
                                        }
                                        key={todo._id}
                                    >

                                        {editId === todo._id ? (

                                            <>

                                                <div className="edit-area">

                                                    <span className="edit-prefix">
                                                        &gt;
                                                    </span>

                                                    <input
                                                        className="edit-input"
                                                        value={editTitle}
                                                        onChange={(e) =>
                                                            setEditTitle(
                                                                e.target.value
                                                            )
                                                        }
                                                        autoFocus
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

                                            <>

                                                <div className="todo-content">

                                                    <div className="todo-main">

                                                        <button
                                                            className={
                                                                todo.completed
                                                                    ? "check-button checked"
                                                                    : "check-button"
                                                            }
                                                            onClick={() =>
                                                                toggleTodo(todo)
                                                            }
                                                        >
                                                            {todo.completed
                                                                ? "✓"
                                                                : "○"}
                                                        </button>

                                                        <p
                                                            className={
                                                                todo.completed
                                                                    ? "todo-title todo-completed"
                                                                    : "todo-title"
                                                            }
                                                        >
                                                            {todo.title}
                                                        </p>

                                                    </div>

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

                </section>


                {/* FOOTER */}

                <footer className="app-footer">

                    <span>
                        TODO//SYSTEM v1.0
                    </span>

                    <span>
                        STATUS: ONLINE
                    </span>

                </footer>

            </div>

        </div>
    );
}

export default Todo;