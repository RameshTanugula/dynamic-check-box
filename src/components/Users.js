import * as React from 'react';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import SnackBar from './SnackBar';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import api from '../services/api';
import { DataGrid } from '@mui/x-data-grid';
import Loader from './Loader';

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Users() {
    const serverUrl = securedLocalStorage.baseUrl + 'users/';
    const userFields = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        mobile: "",
        role: ""
    }

    const errorseFields = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        mobile: "",
        role: ""
    }
    const [errors, setErrors] = React.useState(errorseFields);
    const [useForm, setUserForm] = React.useState(userFields);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [formType, setFormType] = React.useState("");
    const [roles, setRoles] = React.useState([]);
    const [isValid, setIsValid] = React.useState(false);
    const [tableData, setTableData] = React.useState([]);
    const [updateRow, setUpdateRow] = React.useState("");
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [isActive, setIsActive] = React.useState("0");
    const [showLoader, setShowLoader] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState("Super Admin");

    const columns = [
        { field: 'user_name', headerName: 'User Name', minWidth: 250, },
        { field: 'email', headerName: 'Email', minWidth: 300, },
        { field: 'role_name', headerName: 'Role', minWidth: 250, },
        { field: 'mobile', headerName: 'Phone Number', minWidth: 200, },
        {
            field: '', headerName: 'Action', minWidth: 150,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" disabled={!readAndWriteAccess} onClick={() => update(params.row)} >Update</Button>
                    </Stack>)
            }
        },
    ];

    function update(row) {
        resetForm();
        setFormType("Update User");
        setUpdateRow(row);
        useForm.firstName = row.first_name;
        useForm.lastName = row.last_name;
        useForm.email = row.email;
        useForm.role = row.role;
        useForm.password = row.password;
        useForm.mobile = row.mobile;
        setIsActive(row.is_active);
        setUserForm(useForm);
    }

    function handleChange(e) {
        const newData = {
            ...useForm,
            [e.target.name]: e.target.value

        }
        setUserForm(newData);
        checkIsValid(e.target.name, e.target.value)
    }

    const checkIsValid = (name, value) => {
        if (value === "") {
            errors[name] = "Email is required"
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
        result = Object.keys(useForm).filter(ele => !useForm[ele]);
        if (result.length === 0) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(useForm.email)) {
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


    function resetForm() {
        setUserForm(userFields);
        setErrors(errorseFields);
        setIsValid(false)
    }


    async function getUerList() {
        setShowLoader(true);
        const url = serverUrl + "list/all/" + selectedRole;
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {
            setTableData(resp.data);
            setShowLoader(false);
        }
    }
    async function getRoles() {
        const url = serverUrl + "roles";
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {
            setRoles(resp.data)
        }
    }

    async function createOrUpdateUser() {
        setShowLoader(true);
        if (valid()) {
            let message = "created";
            useForm["course"] = "";
            if (formType === "Update User") {
                let pwdUpdated = false;
                if (updateRow.password !== useForm.password) {
                    pwdUpdated = true;
                }
                useForm["id"] = updateRow.user_id;
                useForm["isPasswordUpdated"] = pwdUpdated;
                useForm["is_active"] = isActive;
                message = "updated"
            }
            const url = serverUrl + "register";
            const resp = await api(useForm, url, 'post');
            if (resp.status === 200) {
                resetForm();
                const data = {
                    type: "success",
                    message: "User " + message + " successfully...!"
                }
                setOpenSnackBar(true);
                setSnackBarData(data);
                setFormType("");
                getUerList();
                setShowLoader(false);
            }
            else {
                const data = {
                    type: "error",
                    message: resp.response.data.errorMsg
                }
                setOpenSnackBar(true);
                setSnackBarData(data);
            }
        }
    }
    function closeSnakBar() {
        setOpenSnackBar(false);
    }

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
        getRoles();
        getUerList();
    }, []);

    React.useEffect(() => {
        setErrors(errors);
    }, [isValid]);

    return (
        <div>
            <Grid container spacing={1} >
                <Grid item xs={4} >
                    <FormControl sx={{ m: 1, minWidth: 360 }} style={{ marginLeft: "2px", marginTop: "-2px" }}>
                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                            }}
                            disabled={!readAndWriteAccess}
                        >
                            {roles.map((data, i) => (
                                <MenuItem key={i} value={data.name}>
                                    {data.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} style={{marginTop:"10px"}} >
                    <Button disabled={!readAndWriteAccess} variant="contained" onClick={() => getUerList()}>Applay</Button>
                </Grid>
                <Grid item xs={2} style={{marginTop:"10px"}}>
                    <Button disabled={!readAndWriteAccess} variant="contained" onClick={() => { setFormType("Create User"); resetForm() }}>Create User</Button>
                </Grid>
            </Grid>
            <div style={{ height: 370, width: '100%', marginTop: "5px" }}>
                <DataGrid
                    rows={tableData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    getRowId={(row) => row.user_id}
                />
            </div>

            <Modal
                open={formType !== ""}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginTop: "-20px" }}>
                        {formType}
                    </Typography>
                    <br />
                    <Grid container spacing={1} >
                        <Grid item xs={6} >
                            <TextField
                                label="First Name"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={useForm.firstName}
                                onChange={handleChange}
                                name="firstName"
                                error={errors.firstName !== ""}
                                helperText={errors.firstName !== "" ? 'First Name is reuired' : ' '}
                                disabled={!readAndWriteAccess}
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                label="Last Name"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={useForm.lastName}
                                onChange={handleChange}
                                name="lastName"
                                error={errors.lastName !== ""}
                                helperText={errors.lastName !== "" ? 'Last Name is reuired' : ' '}
                                disabled={!readAndWriteAccess}
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                type="email"
                                label="Email"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={useForm.email}
                                onChange={handleChange}
                                name="email"
                                error={errors.email !== ""}
                                helperText={errors.email !== "" ? errors.email : ' '}
                                disabled={!readAndWriteAccess}
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                type="password"
                                label="Password"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={useForm.password}
                                onChange={handleChange}
                                name="password"
                                error={errors.password !== ""}
                                helperText={errors.password !== "" ? 'Password is reuired' : ' '}
                                disabled={!readAndWriteAccess}
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <FormControl sx={{ m: 1, minWidth: 360 }} style={{ marginLeft: "2px", marginTop: "-2px" }}>
                                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={useForm.role}
                                    name="role"
                                    onChange={handleChange}
                                    error={errors.role !== ""}
                                    helperText={errors.role !== "" ? 'Role is reuired' : ' '}
                                    disabled={!readAndWriteAccess}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {roles.map((data, i) => (
                                        <MenuItem key={i} value={data.id}>
                                            {data.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                type="number"
                                label="Phone Number"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={useForm.mobile}
                                onChange={handleChange}
                                name="mobile"
                                error={errors.mobile !== ""}
                                helperText={errors.mobile !== "" ? 'Phone Number is reuired' : ' '}
                                disabled={!readAndWriteAccess}
                            />
                        </Grid>
                        {formType === "Update User" &&
                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isActive === 1}
                                            value={isActive}
                                            disabled={!readAndWriteAccess}
                                            onChange={() => setIsActive(isActive === 1 ? 0 : 1)}
                                        />
                                    }
                                    label="Active"
                                />
                            </Grid>
                        }
                    </Grid>

                    <Stack spacing={2} direction="row" style={{ marginTop: "30px" }}>
                        <Button disabled={!readAndWriteAccess} variant="outlined" onClick={() => setFormType("")}>Close</Button>
                        <Button disabled={!readAndWriteAccess} variant="contained" onClick={() => resetForm()} >Reset</Button>
                        <Button disabled={!readAndWriteAccess} variant="contained" onClick={() => createOrUpdateUser()} >{formType === "Create User" ? "Save" : "Update"}</Button>
                    </Stack>
                </Box>
            </Modal>

            {openSnackBar &&
                <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />
            }
            {showLoader &&
                <Loader />
            }
        </div>
    )
}