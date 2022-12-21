import React from "react";
import { TextField, Button, Box } from "@mui/material";

const Login = ({ loginUser }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const realData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    if (realData.email && realData.password) {
      const res = await loginUser(realData);
    }
  };
  return (
    <div>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        id="login-form"
        onSubmit={handleSubmit}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          name="email"
          label="Enter Password"
          variant="outlined"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Confirm Your Password"
          variant="outlined"
        />
        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, px: 5 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
