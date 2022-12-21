import React, { useEffect, useContext } from "react";
import { createContext } from "react";

const auth = createContext();
const UserAuthContext = ({ children }) => {
  let once = false;
  const host = `http://localhost:2000/users`;

  const authToken = async () => {
    const token = window.localStorage.getItem("token");
    const res = await fetch(`$(host)/`, {
      headers: new Headers({ authorization: token }),
    });
    console.log("authToken : ", res.status);
    if (res.status === 200) {
      console.log("true");
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
    console.log({ token });
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
      console.log("hii");
    }

    console.log("Login Succesfully");
  };
  return (
    <auth.Provider value={{ authToken, loginUser, registerUser }}>
      {children}
    </auth.Provider>
  );
};

export const AuthContext = () => {
  return useContext(auth);
};

export default UserAuthContext;
