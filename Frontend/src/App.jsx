import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Register from "./component/Register";
import Login from "./component/Login";
import Todo from "./component/Todo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<Todo />} />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;