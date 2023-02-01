import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import moment from "moment";
import api from '../services/api';
import { DataGrid } from '@mui/x-data-grid';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";

const columns = [
    { field: 'coupon_code', headerName: 'Coupon Code', minWidth: 200, },
    { field: 'course', headerName: 'Course', minWidth: 200, },
    { field: 'created_by', headerName: 'Created By', minWidth: 200, },
    {
        field: 'discount', headerName: 'Discount', minWidth: 200,
        valueGetter: (params) =>
            `${params.row.discount}%`,

    },
    { field: 'expiry_date', headerName: 'Expiry Date', minWidth: 200, },
    { field: 'first_purchase', headerName: 'First Purchase', minWidth: 200, },
];


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'DSC',
    'GROUPS',
];
const serverUrl = securedLocalStorage.baseUrl + `promocodes/`;

const modelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

export default function CouponCode() {
    const [tableShow, setTableShow] = React.useState(false);
    const [tableData, settableData] = React.useState([]);
    const [openModel, setOpenModel] = React.useState(false);
    const [submitValid, setSubmitValid] = React.useState(true);
    const [courseNames, setCourseNames] = React.useState([]);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);

    const [date, setDate] = React.useState(null);
    const [errors, setErrors] = React.useState({
        couponCode: "",
        course: "",
        discount: "",
    });

    const [formFields, setFormFields] = React.useState({
        couponCode: "",
        course: "",
        discount: "",
        expiryDate: "",
        firstPurchase: "",
    });

    function handleChange(e) {
        let value = e.target.value;
        if (e.target.name === "firstPurchase") {
            if (value === "" || value === "false") {
                value = true
            }
            else {
                value = false
            }
        }
        if (e.target.name === "course") {
            setCourseNames(
                typeof value === 'string' ? value.split(',') : value,
            );
            value = e.target.value.length === 0 ? "" : e.target.value;
        }
        if (e.target.name === "couponCode") {
            const letterNumber = /^[0-9a-zA-Z]+$/;
            if (value.match(letterNumber) && value.length < 4) {
                value = e.target.value;
            }
            else {
                if (value.length === 0) {
                    value = ""
                }
                else {
                    value = formFields.couponCode;
                }
            }

        }
        if (e.target.name === "discount") {
            const number = /^\d*\.?\d*$/;
            if (value.match(number)) {
                value = e.target.value;
            }
            else {
                value = formFields.discount;
            }
        }

        const newData = {
            ...formFields,
            [e.target.name]: value

        }
        setFormFields(newData);
        checkIsValid(e.target.name, value)

    }

    const checkIsValid = (name, value) => {
        if (value === "") {
            errors[name] = name;
        }
        else {
            errors[name] = "";
        }
    };

    function resetForm() {
        setFormFields({
            couponCode: "",
            course: "",
            discount: "",
            expiryDate: "",
            firstPurchase: false,
        })
        setCourseNames([]);
        setDate(null)
    }

    function preView() {
        if (formFields.couponCode === "") {
            errors['couponCode'] = "error";
            setSubmitValid(false)
        }
        if (formFields.course === "") {
            errors.course = "error";
            setSubmitValid(false)
        }
        if (formFields.discount === "") {
            errors.discount = "error";
            setSubmitValid(false)
        }
        if (formFields.couponCode !== "" && formFields.course !== "" && formFields.discount !== "") {
            setSubmitValid(true);
            setOpenModel(true)
            var course = ""
            courseNames.forEach(ele => {
                course = course + ele + ",";
            });
            formFields.course = course;
            var date1 = new Date(date);
            formFields.expiryDate = moment(date1).format('DD/MM/YYYY')
        }

    }

    function closeModel() {
        setOpenModel(false);
    }

    async function submit() {
        const coupencode = (Math.random() + 1).toString(36).substring(7);
        const payload = {
            couponCode: formFields.couponCode + coupencode.substring(0, 3),
            course: formFields.course,
            discount: formFields.discount,
            expiryDate: formFields.expiryDate,
            firstPurchase: formFields.firstPurchase === "" ? false : formFields.firstPurchase
        }
        setTableShow(true);
        const resp = await api(payload, serverUrl + "add", 'post');
        if (resp.status === 200) {
            resetForm();
            setOpenModel(false);
            setTableShow(true);
            const res = await api(payload, serverUrl + "list", 'post');
            settableData(res.data)
        }
    }
    React.useEffect(() => {
        setErrors(errors);
    }, [submitValid]);

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
    }, []);

    return (
        <div>
            {
                (!tableShow) &&
                <Box sx={{ flexGrow: 1 }}  >
                    <Grid container spacing={1} columns={16}>
                        <Grid item xs={16}>
                            <TextField
                                label="Coupon Code"
                                id="outlined-start-adornment"
                                sx={{ width: '25%' }}
                                value={formFields.couponCode}
                                onChange={handleChange}
                                name="couponCode"
                                error={errors.couponCode !== ""}
                                helperText={errors.couponCode !== "" ? 'Coupon Code is reuired' : ' '}
                                disabled={!readAndWriteAccess}
                            />
                        </Grid>
                        <Grid item xs={16}>
                            <FormControl sx={{ width: 310 }}>
                                <InputLabel id="demo-multiple-checkbox-label">Course</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    name="course"
                                    value={courseNames}
                                    onChange={handleChange}
                                    label="Course"
                                    renderValue={(selected) => selected.join(', ')}
                                    error={errors.course !== ""}
                                    helperText={errors.course !== "" ? 'Please select at least one Course' : ' '}
                                    MenuProps={MenuProps}
                                    disabled={!readAndWriteAccess}
                                >
                                    {names.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={courseNames.indexOf(name) > -1} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={16}></Grid>
                        <Grid item xs={16} style={{ marginTop: "8px" }}>
                            <TextField
                                label="Dicsount"
                                id="outlined-start-adornment"
                                sx={{ width: '25%' }}
                                value={formFields.discount}
                                name="discount"
                                onChange={handleChange}
                                error={errors.discount !== ""}
                                helperText={errors.discount !== "" ? 'Discount is required' : ' '}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                disabled={!readAndWriteAccess}
                            />
                        </Grid>
                        <Grid item xs={16}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Expiry Date"
                                    value={date}
                                    name="expiryDate"
                                    inputFormat="DD/MM/YYYY"
                                    onChange={(newValue) => {
                                        setDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} sx={{ width: '25%' }} />}
                                    disabled={!readAndWriteAccess}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={16}></Grid>
                        <Grid item xs={16}>
                            <FormLabel component="legend">New Promo Code</FormLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={formFields.firstPurchase} disabled={!readAndWriteAccess} value={formFields.firstPurchase} onChange={handleChange} name="firstPurchase" />
                                }
                                label="First Purchase Only"
                            />
                        </Grid>
                        <Grid item xs={16}>
                            <Stack spacing={2} direction="row">
                                <Button variant="contained" disabled={!readAndWriteAccess} onClick={() => preView()} >Confirm</Button>
                                <Button variant="outlined" disabled={!readAndWriteAccess} onClick={() => resetForm()}>Reset</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box >
            }
            {
                (tableShow) &&
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={tableData}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disabled={!readAndWriteAccess}
                    />
                </div>
            }
            <Modal
                open={openModel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modelStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginTop: "-30px" }}>
                        <h1>Coupen Details</h1>
                    </Typography>
                    <Grid container spacing={1} columns={16}>
                        <Grid item xs={16}>
                            <span style={{ fontWeight: "bold" }}>Coupen Code:</span> {formFields.couponCode}
                        </Grid>
                        <Grid item xs={16}>
                            <span style={{ fontWeight: "bold" }}>Course:</span> {formFields.course}
                        </Grid>
                        <Grid item xs={16}>
                            <span style={{ fontWeight: "bold" }}>Discount:</span> {formFields.discount}%
                        </Grid>
                        <Grid item xs={16}>
                            <span style={{ fontWeight: "bold" }}>Expiry Date:</span> {formFields.expiryDate}
                        </Grid>
                        <Grid item xs={16}>
                            <span style={{ fontWeight: "bold" }}>First Purches:</span> {` ${formFields.firstPurchase}`}
                        </Grid>
                    </Grid>
                    <Stack spacing={2} direction="row" style={{ marginTop: "30px" }}>
                        <Button variant="contained" disabled={!readAndWriteAccess} onClick={() => submit()} >submit</Button>
                        <Button variant="outlined" disabled={!readAndWriteAccess} onClick={() => closeModel()}>Close</Button>
                    </Stack>
                </Box>
            </Modal>
        </div>

    )
}

