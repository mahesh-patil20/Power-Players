import React, {useState} from "react";
import "../../css_files/login.css";
import { toast } from "react-toastify";
import axios from "axios";
const {useNavigate} = require("react-router-dom");

const Login = (props) => {
  const { role, setRole } = props.details;
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const onRegisterChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  }
  const navigate = useNavigate();
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/signin`, login);
      if(response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("name", response.data.name);
        setRole(response.data.role);
        toast.success(response.data.msg);
        navigate('/')
      }
    }
    catch (error) {
      console.log(error)
      if (error.response) {
        toast.error(error.response.data.error);
      }
      else {
        toast.error("Some error occured");
      }
    }
  }

  const submitRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/signup`, register);
      if(response.status === 200) {
        toast.success(response.data.msg);
      }
    }
    catch (error) {
      console.log(error)
      if (error.response) {
        toast.error(error.response.data.error);
      }
      else {
        toast.error("Some error occured");
      }
    }
  }



  return (
    <>
      <div className="login_container">
        <div className="login_main">
          <input type="checkbox" id="login_chk" aria-hidden="true" />

          <div className="login_login">
            <form className="login_form" onSubmit={submitLogin}>
              <label
                className="login_label"
                htmlFor="login_chk"
                aria-hidden="true"
              >
                Log in
              </label>
              <input
                className="login_input"
                type="email"
                name="email"
                placeholder="Email"
                required
                value={login.email}
                onChange={onLoginChange}
                />
              <input
                className="login_input"
                type="password"
                name="password"
                placeholder="Password"
                required
                value={login.password}
                onChange={onLoginChange}
              />
              <button onClick={submitLogin}>Log in</button>
            </form>
          </div>

          <div className="login_register">
            <form className="login_form" onSubmit={submitRegister}>
              <label
                className="login_label"
                htmlFor="login_chk"
                aria-hidden="true"
              >
                Register
              </label>
              <input
                className="login_input"
                type="text"
                name="name"
                placeholder="Name"
                required
                value={register.name}
                onChange={onRegisterChange}
                />
              <input
                className="login_input"
                type="email"
                name="email"
                placeholder="Email"
                required
                value={register.email}
                onChange={onRegisterChange}
                />
              <input
                className="login_input"
                type="password"
                name="password"
                placeholder="Password"
                required
                value={register.password}
                onChange={onRegisterChange}
              />
              <button onClick={submitRegister}>Register</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
