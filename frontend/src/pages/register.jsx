import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        username: "",

        email: "",

        password: ""

    });

    const register = async () => {

        try {

            await api.post("/register", form);

            alert("Registration Successful");

            navigate("/login");

        } catch (err) {

            alert("Registration Failed");

        }

    };

    return (

        <div style={{padding:"40px"}}>

            <h2>Register</h2>

            <input
                placeholder="Username"
                onChange={(e)=>setForm({...form,username:e.target.value})}
            />

            <br/><br/>

            <input
                placeholder="Email"
                onChange={(e)=>setForm({...form,email:e.target.value})}
            />

            <br/><br/>

            <input
                type="password"
                placeholder="Password"
                onChange={(e)=>setForm({...form,password:e.target.value})}
            />

            <br/><br/>

            <button onClick={register}>

                Register

            </button>

            <br/><br/>

            <Link to="/login">

                Already have an account?

            </Link>

        </div>

    );

}