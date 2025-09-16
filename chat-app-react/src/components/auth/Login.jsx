import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {login} from "../../api/api"
import { CONST, hashPassword } from "../../utils/constants";
const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    // email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().min(4, "Too short").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      localStorage.clear()
      let hashedPassword = await hashPassword(values.password);
      console.log(hashedPassword);
      
      await login({username: values.username, password: hashedPassword})
        .then((res) => {
          if (res?.data?.access) {
            const is_admin = res?.data?.user.role === 'admin' ? 'true' : ''
            localStorage.setItem(CONST.TOKEN, res?.data?.access);
            localStorage.setItem(CONST.REFRESH, res?.data?.refresh);
            localStorage.setItem(CONST.USER_ID, res?.data?.user.id);
            localStorage.setItem(CONST.USER_NAME, res?.data?.user.username);
            localStorage.setItem(CONST.User_ROLE, res?.data?.user.role);
            localStorage.setItem(CONST.IS_ADMIN, is_admin);
            navigate("/dashboard")
          }
          else {
            alert("Invalid credentials")
          }
        })
        .catch((err) => alert("Invalid credentials"))
        .finally(() => setSubmitting(false));
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors, values }) => (
            <Form>
              <Field
                as={TextField}
                label="Username"
                name="username"
                fullWidth
                margin="normal"
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />

              <Field
                as={TextField}
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={()=>{navigate('/register')}}
                disabled={!values}
              >
                Sign-up
              </Button>
            </Form>
          )}
        </Formik>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert onClose={() => setError("")} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
