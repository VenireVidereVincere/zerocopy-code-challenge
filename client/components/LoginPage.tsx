import React, { ReactElement } from "react";
import '../../src/public/assets/logo.png'
import type { UserDetails } from "../../types/User";
import { useAppDispatch } from "../../hooks/hooks";
import { setUserDetails } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage(): ReactElement {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  async function getUserInfo(): Promise<UserDetails | {}>{
    try {
      const response = await fetch("http://localhost:3000/user",{
        method: "GET",
        credentials: "include" 
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }
  
      const userDetails = await response.json();
      return userDetails;
    } catch (error) {
      console.error(error);
      return {} // Handle the error case, e.g., display an error message or redirect the user
    }
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
  
    const email = emailInput.value;
    const password = passwordInput.value;
  
    // Validate empty fields
    if (email.trim() === "" || password.trim() === "") {
      // Handle empty fields
      console.log("Fields can't be empty")
      return;
    }
    // Validate email
    const emailRegex = /^\S+@\S+\.\S+$/; // Basic email validation regex
    if (!emailRegex.test(email)) {
      // Handle invalid email
      console.log("Invalid email address.")
      return;
    }
  

  
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies in the request
      });
  
      if (response.ok) {
        // TODO - Handle successful login
        const userInfo = await getUserInfo();
        dispatch(setUserDetails(userInfo));
        navigate("/profile");
      } else {
        const { error } = await response.json();
        // TODO - Handle failed login
      }
    } catch (error) {
      navigate("error");
    }
  };

    return (
      <div className="box-layout"> 
        <div className="login-page centered">
          <div className='logo-container'>
            <img src={"/src/public/assets/logo.png"} alt="Logo" className="responsive-image" />
          </div>
          

          <div className="box-layout__box">
            <div className="textbox-container">
              <div className="label-align">
                <label htmlFor="email">Email Address:</label>
              </div>
              <input className="textbox" type="email" id="email" name="email" />
            </div>

            <div className="textbox-container">
              <div className="label-align">
                <label htmlFor="password">Password:</label>
              </div>              
              <input className="textbox" type="password" id="password" name="password" />
            </div>
            <button className="login-button button" type="submit" onClick={handleSubmit}>LOGIN</button>

          </div>
        </div>
      </div>

    );
}