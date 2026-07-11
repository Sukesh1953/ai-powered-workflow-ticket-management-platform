import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateTicket from "./pages/CreateTicket";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                path="/create-ticket"
                element={
                <ProtectedRoute>
                    <CreateTicket />
                    </ProtectedRoute>
                }
                />

                <Route

                    path="/dashboard"

                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }

                />

            </Routes>

        </BrowserRouter>

    );

}