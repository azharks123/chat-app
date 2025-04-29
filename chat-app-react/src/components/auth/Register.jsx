import React from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { register } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "../../utils/constants";

const Register = () => {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    email: "",
    password: "",
    role: "user",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    let hashedPassword = await hashPassword(values.password);
    await register({
      username: values.username,
      password: hashedPassword,
      email: values.email,
      role: values.role,
    })
      .then(() => {
        alert("User registered!");
        navigate("/login");
      })
      .catch((err) => alert("Registration failed"))
      .finally(() => setSubmitting(false));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({ isSubmitting, values }) => (
          <Form>
            <Field
              name="username"
              as={TextField}
              label="Username"
              fullWidth
              margin="normal"
            />
            <Field
              name="email"
              as={TextField}
              label="Email"
              fullWidth
              margin="normal"
            />
            <Field
              name="password"
              as={TextField}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
            >
              Register
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => {
                navigate("/login");
              }}
              disabled={!values}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Register;
