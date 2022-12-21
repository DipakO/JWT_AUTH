import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import React from "react";
import UserAuthContext from "../context/userAuthContext";

const LogReg = ({ registerUser }) => {
  // const { registerUser } = UserAuthContext();
  const handleRegistration = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      password_Confirm: data.get("password_confirmation"),
      tc: data.get("tc"),
    };
    // console.log(actualData);
    if (
      actualData.name &&
      actualData.email &&
      actualData.password &&
      actualData.password_Confirm &&
      actualData.tc !== null
    ) {
      if (actualData.password === actualData.password_Confirm) {
        const res = await registerUser(actualData);
        // console.log(res);
      }
    }
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        id="registration-form"
        onSubmit={handleRegistration}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          name="name"
          label="Name"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          label="Email Address"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password_confirmation"
          name="password_confirmation"
          label="Confirm Password"
          type="password"
        />
        <FormControlLabel
          control={<Checkbox value={true} color="primary" name="tc" id="tc" />}
          label="I agree to term and condition."
        />
        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, px: 5 }}
          >
            submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LogReg;
