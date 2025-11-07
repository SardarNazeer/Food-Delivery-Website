import React, { useContext, useEffect, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {

  const {url,setToken} = useContext(StoreContext)

  const [currState, setCurrState] = useState("Login");

  const [data,setData] = useState({
    name:"",
    email:"",
    password:""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const onLogin =  async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      // Handle login logic here
      newUrl += "/api/user/login";
    } else {
      // Handle signup logic here
      newUrl += "/api/user/register"
    }

    const response = await axios.post(newUrl,data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token",response.data.token);
      setShowLogin(false)
    } else {
      alert(response.data.message)
    }
  };

  return (
    <div className='login-popup'>
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
            className="close-icon"
          />
        </div>

        <form  onSubmit={onLogin} className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder="Your Name" required />
          )}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Your Email" required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required />

          <button type="submit">
            {currState === "Sign Up" ? "Create Account" : "Login"}
          </button>
        </form>

        {currState === "Sign Up" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>
              By continuing, I agree to the terms of use & privacy policy.
            </p>
          </div>
        )}

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
