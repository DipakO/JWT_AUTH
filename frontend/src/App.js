import React, { useEffect } from "react";
import Login from "./pages/Login";
import LogReg from "./pages/LogReg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  let once = false;
  const host = `http://localhost:2000/users`;

  const authToken = async () => {
    const token = window.localStorage.getItem("token");
    const res = await fetch(`$(host)/`, {
      headers: new Headers({ authorization: token }),
    });
    if (res.status === 200) {
      // Navigate("/home");
    } else {
      console.log("false");
    }
  };

  useEffect(() => {
    if (!once) {
      authToken();

      once = true;
    }
  }, []);

  const registerUser = async (actualData) => {
    const res = await fetch(`${host}/register`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(actualData),
    });
    if (res.status !== 200) {
      console.log("Failed to save data");
      return;
    }
    const token = (await res.json()).token;
    console.log(token);
    window.localStorage.setItem("token", token);

    console.log("Save Data Succesfully ..");
    authToken();
  };

  const loginUser = async (realData) => {
    const res = await fetch(`${host}/login`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(realData),
    });
    console.log(res);
    if (res.status !== 200) {
      console.log("Failed to Login user");
    }
    const token = (await res.json()).token;
    console.log({ token });
    window.localStorage.setItem("token", token);

    console.log("Login Succesfully");
    authToken();
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login loginUser={loginUser} />} />
          <Route path="/" element={<LogReg registerUser={registerUser} />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
