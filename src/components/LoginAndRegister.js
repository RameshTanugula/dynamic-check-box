import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import api from '../services/api';

import * as securedLocalStorage from "./SecureLocalaStorage";

export default function App(props) {
    const serverUrl = securedLocalStorage.baseUrl;
    const loginFields = {
        email: "",
        password: "",
        confirmpassword: ""
    }
    const errorObj = {
        email: "",
        password: "",
        confirmpassword: "",
    }
    const [loginForm, setLoginForm] = React.useState(loginFields);
    const [buttonName, setButtonName] = React.useState('login');
    const [errors, setErrors] = React.useState(errorObj);
    const [isValid, setIsValid] = React.useState(false);
    const [loginFiledMsg, setLoginFiledMsg] = React.useState("");
    const [successMsg, setSuccessMsg] = React.useState("");

    function handleChange(e) {
        const newData = {
            ...loginForm,
            [e.target.name]: e.target.value

        }
        setLoginForm(newData);
        checkValidation(e.target.name, e.target.value);
        if (loginFiledMsg !== "") {
            setLoginFiledMsg("");
            setSuccessMsg("");
        }
    }


    const checkValidation = (name, value) => {
        if (value === "") {
            errors[name] = name + " is reqiured";
        }
        else {
            if (name === "email") {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    errors[name] = "";
                }
                else {
                    errors[name] = "please enter valid email";
                }
            }
            else {
                errors[name] = "";
            }
        }
    };

    function valid() {
        let retunValue = false;
        let result = [];
        if (buttonName === "login") {
            delete loginForm['confirmpassword'];
        }
        result = Object.keys(loginForm).filter(ele => !loginForm[ele]);
        if (result.length === 0) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(loginForm.email)) {
                retunValue = true;
            }
            else {
                retunValue = false;
            }
        }
        else {
            for (const v of result) {
                errors[v] = v + " is required "
            }
            retunValue = false;
            setIsValid(true)
        }
        if (buttonName !== "login") {
            if (loginForm.password !== loginForm.confirmpassword) {
                retunValue = false;
                setLoginFiledMsg("Passwords dose not Match")
                setIsValid(true)
            }
        }

        return retunValue;
    }

    function resetForms() {
        setErrors(errorObj);
        setLoginForm(loginFields);
    }

    async function login() {
        setLoginFiledMsg("");
        if (valid()) {
            const resp = await api(loginForm, serverUrl + "users/login", 'post');
            if (resp.status === 200) {
                resetForms();
                securedLocalStorage.set("token", resp.data.userToken);
                props.loginData();
            }
            else {
                setLoginFiledMsg("Invalid Credentials..!");
            }

        }
    }

    async function forGotPassword() {
        setLoginFiledMsg("");
        if (valid()) {
            delete loginForm['confirmpassword'];
            const resp = await api(loginForm, serverUrl + "users/forgot/password", 'post');
            if (resp.status === 200) {
                setLoginFiledMsg("");
                setSuccessMsg(resp.data.message);
                resetForms();
            }
            else {
                setSuccessMsg("")
                setLoginFiledMsg("Invalid Credentials..!");
            }

        }
    }

    return (
        <div>
            <Grid container spacing={1} columns={12}>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <Card style={{ backgroundColor: "white", marginTop: "30%", transform: 'scale(0.8)', boxShadow: '0px 2px 6px,0px #ddd', borderRadius: "20px" }} sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Grid container spacing={0.5} columns={12} style={{ marginTop: "30px" }} >
                                <Grid item xs={2}></Grid>
                                <Grid item xs={10}>
                                    <TextField
                                        sx={{ width: '75%' }}
                                        required
                                        id="outlined-start-adornment"
                                        label="Email"
                                        variant="standard"
                                        name="email"
                                        value={loginForm.email}
                                        onChange={handleChange}
                                        inputProps={{ style: { fontSize: 20 } }}
                                        InputLabelProps={{ shrink: true, style: { fontSize: 25 } }}
                                        error={errors.email !== ""}
                                        helperText={errors.email !== "" ? <span style={{ fontSize: 20 }} >{errors.email}</span> : ' '}
                                    />
                                </Grid>

                                <Grid item xs={2}></Grid>
                                <Grid item xs={10}>
                                    <TextField
                                        required
                                        sx={{ width: '75%' }}
                                        id="outlined-start-adornment"
                                        label={buttonName === "login" ? "Password" : "New Password"}
                                        type={buttonName === "login" ? "password" : "text"}
                                        name="password"
                                        variant="standard"
                                        value={loginForm.password}
                                        onChange={handleChange}
                                        inputProps={{ style: { fontSize: 20 } }}
                                        InputLabelProps={{ shrink: true, style: { fontSize: 25 } }}
                                        error={errors.password !== ""}
                                        helperText={errors.password !== "" ? <span style={{ fontSize: 20 }} >{errors.password}</span> : ' '}
                                    />
                                </Grid>
                                {buttonName !== "login" &&
                                    <Grid item xs={2}></Grid>
                                }
                                {buttonName !== "login" &&
                                    <Grid item xs={10}>
                                        <TextField
                                            required
                                            sx={{ width: '75%' }}
                                            id="outlined-start-adornment"
                                            label="Confirm Password"
                                            type="password"
                                            name="confirmpassword"
                                            variant="standard"
                                            value={loginForm.confirmpassword}
                                            onChange={handleChange}
                                            inputProps={{ style: { fontSize: 20 } }}
                                            InputLabelProps={{ shrink: true, style: { fontSize: 25 } }}
                                            error={errors.confirmpassword !== ""}
                                            helperText={errors.confirmpassword !== "" ? <span style={{ fontSize: 20 }} >{errors.confirmpassword}</span> : ' '}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={3}></Grid>
                                <Grid item xs={9}  >
                                    {(loginFiledMsg !== "") &&
                                        <span style={{ color: "red", fontSize: 20, fontWidth: 500, }}>{loginFiledMsg}</span>
                                    }
                                      {(successMsg !== "") &&
                                        <span style={{ color: "green", fontSize: 20, fontWidth: 500, }}>{successMsg}...!</span>
                                    }
                                </Grid>
                                <Grid item xs={2}></Grid>
                                {buttonName === "login" &&
                                    <Grid item xs={10} >
                                        <Button sx={{ width: '75%' }} color="success" variant="contained" onClick={() => login()}>Login</Button>
                                    </Grid>
                                }
                                {buttonName !== "login" &&
                                    <Grid item xs={10} >
                                        <Button sx={{ width: '75%' }} color="success" variant="contained" onClick={() => forGotPassword()}>Submit</Button>
                                    </Grid>
                                }

                                <Grid item xs={2}></Grid>
                                <Grid item xs={10} >
                                    Clik here to  <Link
                                        component="button"
                                        variant="body2"
                                        onClick={() => {
                                            setButtonName(buttonName === "login" ? "forgotpassword" : "login");
                                            setLoginForm(loginFields);
                                            setLoginFiledMsg("");
                                            setErrors(errorObj);
                                            setSuccessMsg("");
                                        }}
                                    >
                                        {buttonName === "login" ? "Forgot password" : "Login"

                                        }
                                    </Link>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div >
    )
}
