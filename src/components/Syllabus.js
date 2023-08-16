
import * as React from 'react';
import * as CheckAccess from "./CheckAccess";
import * as securedLocalStorage from "./SecureLocalaStorage";
import api from '../services/api';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { convertBase64 } from "../common/commonFun";

export default function Syllabus() {
    const serverUrl = securedLocalStorage.baseUrl + 'syllabus/';
    const syllabusFields = {
        title: "",
        course: ""
    }
    const errorseFields = {
        title: "",
        course: ""

    }
    const [errors, setErrors] = React.useState(errorseFields);
    const [syllabusForm, setSyllabusForm] = React.useState(syllabusFields);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState([]);
    const [fileError, setFileError] = React.useState("");
    const courseList = ['DSC', 'GROUPS'];
    function handleChange(e) {
        const newData = {
            ...syllabusForm,
            [e.target.name]: e.target.value

        }
        setSyllabusForm(newData);
        checkIsValid(e.target.name, e.target.value)
    }
    function handleChangeCourse(e) {
        const newData = {
            ...syllabusForm,
            [e.target.name]: e.target.value

        }
        setSyllabusForm(newData);
        checkIsValid(e.target.name, e.target.value)
    }

    const checkIsValid = (name, value) => {
        if (value === "") {
            errors[name] = name;
        }
        else {
            errors[name] = "";
        }
    };

    const onFileChange = event => {
        if (event.target.files[0].type === "application/pdf") {
            setSelectedFile(event.target.files);
            setFileError("");
        }
        else {
            document.getElementById("file").value = "";
            setSelectedFile([]);
            setFileError("Please upload only pdf");
        }

    };

    function resetForm() {
        setSyllabusForm(syllabusFields);
        document.getElementById("file").value = "";
    }



    async function save() {
        if (selectedFile.length === 0) {
            setFileError("File is required");
        }
        else {
            setFileError("");
            const formData = new FormData();
            for (let i = 0; i < selectedFile?.length; i++) {
                formData.append(
                    "files", selectedFile[i],
                );
            }
            const paylod = syllabusForm;
            paylod["base64"] = await convertBase64(selectedFile[0]);
            formData.append('data',
                JSON.stringify(syllabusForm))
            try {
                const resp = await api(formData, serverUrl + "save", 'post');
                alert('Syllabus saved succesfully!');
                resetForm();
            } catch (err) {
                alert('Something went wrong!')
            }
        }
    }

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
    }, []);

    return (
        <div>
            <Grid container spacing={1} >
                <Grid item xs={4} >
                    <TextField
                        required
                        label="Title"
                        id="outlined-start-adornment"
                        sx={{ width: '100%' }}
                        value={syllabusForm.title}
                        onChange={handleChange}
                        name="title"
                        error={errors.title !== ""}
                        helperText={errors.title !== "" ? 'Title is reuired' : ' '}
                        disabled={!readAndWriteAccess}
                    />
                </Grid>
                <Grid item xs={4} >
                    <>
                        <FormControl sx={{ minWidth: 300 }} style={{ marginLeft: "16px" }}>
                            <InputLabel id="demo-simple-select-label">Course</InputLabel>
                            <Select
                                sx={{ minWidth: 300 }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={syllabusForm.course}
                                // placeholder='Course'
                                label="Course"
                                name="course"
                                onChange={handleChangeCourse}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {courseList.map((data, i) => (
                                    <MenuItem key={i} value={data}>
                                        {data}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={4} >
                <Grid item xs={6} >
                    <span>File *</span>
                    <div >
                        <input id="file" type="file" multiple onChange={onFileChange} disabled={!readAndWriteAccess} />
                    </div>
                    {fileError !== "" ? <span style={{ color: "#d32f2f" }}> {fileError} </span> : ""}

                </Grid>
                <Grid item xs={5} />
                <Grid item xs={1} />
                <Grid item xs={11} >
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" disabled={!readAndWriteAccess} onClick={() => resetForm()}>Reset</Button>
                        <Button variant="contained" disabled={!readAndWriteAccess} onClick={() => save("")}>Save</Button>
                    </Stack>
                </Grid>
            </Grid>
        </div >
    )
}