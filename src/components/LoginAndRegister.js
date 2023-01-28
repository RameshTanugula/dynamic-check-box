import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import api from '../services/api';

import * as securedLocalStorage from "./SecureLocalaStorage";

export default function App(props) {
    const serverUrl = `http://3.110.42.205:8080/`;
    const loginFields = {
        email: "",
        password: ""
    }
    const errorObj = {
        email: "",
        password: ""
    }
    const [loginForm, setLoginForm] = React.useState(loginFields);
    const [errors, setErrors] = React.useState(errorObj);
    const [isValid, setIsValid] = React.useState(false);
    const [loginFiledMsg, setLoginFiledMsg] = React.useState("");

    function handleChange(e) {
        const newData = {
            ...loginForm,
            [e.target.name]: e.target.value

        }
        setLoginForm(newData);
        checkValidation(e.target.name, e.target.value);
        if (loginFiledMsg !== "") {
            setLoginFiledMsg("")
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
                                        label="Password"
                                        type="password"
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
                                <Grid item xs={3}></Grid>
                                <Grid item xs={9}  >
                                    {(loginFiledMsg !== "") &&
                                        <span style={{ color: "red", fontSize: 20, fontWidth: 500, }}>{loginFiledMsg}</span>
                                    }
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={10} >
                                    <Button sx={{ width: '75%' }} color="success" variant="contained" onClick={() => login()}>Login</Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div >
    )
}
