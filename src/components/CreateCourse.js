import * as React from 'react';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import api from '../services/api';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CeateCourse() {

    const serverUrl = `http://3.111.29.120:8080/course/`;
    const academyList = ["g"];
    const categoryList = ["h"];
    const [isValid, setIsValid] = React.useState(false);
    const [showSreen, setShowSreen] = React.useState("Grid");
    const [courseList, setCourseList] = React.useState([]);
    const [expanded, setExpanded] = React.useState(0);
    const [expanded1, setExpanded1] = React.useState(0);

    const [createCourseForm, setCreateCourseForm] = React.useState({
        courseTitle: "",
        instructor: "",
        tags: "",
        academy: "",
        category: "",
        description: ""
    });
    const [errors, setErrors] = React.useState({
        courseTitle: "",
        instructor: "",
        tags: "",
        // academy: "",
        category: "",
        description: ""
    });

    const [courseSection, setCourseSection] = React.useState(
        [
            {
                "courseName": "test1",
                "chapters": [
                    {
                        "chapterName": "1.1"
                    },
                    {
                        "chapterName": "1.2"
                    }
                ]
            },
            {
                "courseName": "test2",
                "chapters": [
                    {
                        "chapterName": "2.1"
                    },
                    {
                        "chapterName": "2.2"
                    }
                ]
            }
        ]
    );

    function resetForm() {
        setCreateCourseForm({
            courseTitle: "",
            instructor: "",
            tags: "",
            academy: "",
            category: "",
            description: ""
        });
        setErrors({
            courseTitle: "",
            instructor: "",
            tags: "",
            // academy: "",
            category: "",
            description: ""
        });
        setIsValid(false)
    }
    const handleChange1 = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const handleChange2 = (panel) => (event, newExpanded) => {
        setExpanded1(newExpanded ? panel : false);
    };


    function removeCourse(i) {
        courseSection.splice(i, 1);
        setCourseSection([...courseSection])
    }

    function removeChapter(i, j) {
        courseSection[i].chapters.splice(j, 1);
        setCourseSection([...courseSection])
    }

    function addCourse(i) {
        const newValue = {
            "courseName": "",
            "chapters": [
                {
                    "chapterName": ""
                },
            ]
        }

        courseSection.splice(i + 1, 0, newValue);
        setCourseSection([...courseSection])
    }

    function addChapter(i, j) {
        const newValue = {
            "chapterName": ""
        }
        courseSection[i].chapters.splice(j + 1, 0, newValue);
        setCourseSection([...courseSection])
    }

    function addCourseValue(value, i) {
        courseSection[i].courseName = value;
        setCourseSection([...courseSection])
    }

    function addChapterValue(value, i, j) {
        courseSection[i].chapters[j].chapterName = value;
        setCourseSection([...courseSection])
    }

    const columns = [
        { field: 'title', headerName: 'Course Title', minWidth: 150, },
        { field: 'instructor', headerName: 'Instructor', minWidth: 200, },
        { field: 'tags', headerName: 'Tags', minWidth: 200, },
        { field: 'academy', headerName: 'Academy', minWidth: 150, },
        { field: 'category', headerName: 'Category', minWidth: 200, },
        { field: 'description', headerName: 'Description', minWidth: 150, },
        {
            field: '', headerName: 'Action', minWidth: 150,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => editCourse(params.row)} >Edit</Button>
                    </Stack>)
            }
        },
    ];

    function handleChange(e) {
        const newData = {
            ...createCourseForm,
            [e.target.name]: e.target.value

        }
        setCreateCourseForm(newData);
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

    function valid() {
        let retunValue = false;
        let result = [];
        result = Object.keys(createCourseForm).filter(ele => !createCourseForm[ele]);
        if (result.includes("academy")) {
            result.splice(result.indexOf('academy'), 1);
        }
        if (result.length === 0) {
            retunValue = true;
        }
        else {
            setIsValid(true);
            for (const v of result) {
                errors[v] = v
            }
            retunValue = false;
        }
        return retunValue;

    }

    const submit = async () => {
        if (valid()) {
            const resp = await api(createCourseForm, serverUrl + "add", 'post');
            if (resp.status === 200) {
            }
        }
    }

    async function getCourseList() {
        const resp = await api(null, serverUrl + "list", 'get');
        if (resp.status === 200) {
            setCourseList(resp.data);
        }
    }

    function editCourse(row) {
        console.log(row);
        setShowSreen("Edit")
    }


    function saveData() {
        console.log(courseSection)
    }
    React.useEffect(() => {
        setErrors(errors);
    }, [isValid]);

    React.useEffect(() => {
        getCourseList();
    }, []);
    return (
        <div>
            <span>
                {(showSreen === "Grid") &&
                    <div>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <Stack spacing={2} direction="row" >
                                    <Button variant="contained" onClick={() => setShowSreen("Create")}>Create Course</Button>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} >
                                <div style={{ height: 400, width: '100%' }}>
                                    <DataGrid
                                        rows={courseList}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                }
            </span>
            <span>
                {(showSreen === "Create") &&
                    <Grid container spacing={1} >
                        <Grid item xs={12} >
                            <span style={{ fontWeight: "bold", fontSize: "30px" }}>Create Course</span>
                        </Grid>
                        <Grid item xs={1} >
                        </Grid>
                        <Grid item xs={3} >
                            <TextField
                                label="Course Title"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={createCourseForm.courseTitle}
                                onChange={handleChange}
                                name="courseTitle"
                                error={errors.courseTitle !== ""}
                                helperText={errors.courseTitle !== "" ? 'Course Title is reuired' : ' '}
                            />
                        </Grid>
                        <Grid item xs={3} >
                            <TextField
                                label="Instructor"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={createCourseForm.instructor}
                                onChange={handleChange}
                                name="instructor"
                                error={errors.instructor !== ""}
                                helperText={errors.instructor !== "" ? 'Instructor is reuired' : ' '}
                            />
                        </Grid>
                        <Grid item xs={5} >
                        </Grid>
                        <Grid item xs={1} ></Grid>
                        <Grid item xs={3} >
                            <TextField
                                label="Tags"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={createCourseForm.tags}
                                onChange={handleChange}
                                name="tags"
                                error={errors.tags !== ""}
                                helperText={errors.tags !== "" ? 'Tags is reuired' : ' '}
                            />
                        </Grid>
                        {/* <FormControl sx={{ m: 1, minWidth: 300 }} style={{ marginLeft: "16px", marginTop: "15px" }}>
                <InputLabel id="demo-simple-select-label">Academy</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={createCourseForm.academy}
                    name="academy"
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {academyList.map((data, i) => (
                        <MenuItem key={i} value={data}>
                            {data}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}
                        {/* <Grid item xs={4} >
            </Grid>
            <Grid item xs={1} >
            </Grid> */}
                        <FormControl sx={{ m: 1, minWidth: 300 }} style={{ marginLeft: "8px", marginTop: "8px" }}>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={createCourseForm.category}
                                name="category"
                                onChange={handleChange}
                                error={errors.category !== ""}
                                helperText={errors.category !== "" ? 'Category is reuired' : ' '}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {categoryList.map((data, i) => (
                                    <MenuItem key={i} value={data}>
                                        {data}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* <Grid item xs={7} >
            </Grid> */}
                        <Grid item xs={4} >
                        </Grid>
                        <Grid item xs={1} >
                        </Grid>
                        <Grid item xs={11} >
                            <TextField
                                id="outlined-multiline-static"
                                label="Description"
                                sx={{ width: '54%' }}
                                multiline
                                value={createCourseForm.description}
                                name="description"
                                onChange={handleChange}
                                rows={4}
                                error={errors.description !== ""}
                                helperText={errors.description !== "" ? 'Description is reuired' : ' '}
                            />
                        </Grid>
                        <Grid item xs={1} >
                        </Grid>
                        <Grid item xs={10} >
                            <Stack spacing={2} direction="row" >
                                <Button variant="contained" onClick={() => setShowSreen("Grid")}>Back</Button>
                                <Button variant="contained" onClick={() => resetForm()}>reset</Button>
                                <Button variant="contained" onClick={() => submit()}>Submit</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                }
            </span>
            <span>
                {(showSreen === "Edit") &&
                    <div>
                        <Stack spacing={2} direction="row" >
                            <Button variant="contained" onClick={() => setShowSreen("Grid")} style={{ marginLeft: "20px" }}>Bakck</Button>
                            <Button variant="contained" onClick={() => saveData()} >Save</Button>
                        </Stack>
                        {courseSection.map((data, i) => (
                            <span key={i}>
                                <Grid container spacing={1} style={{ marginTop: "2px" }} >
                                    <Grid item xs={7} style={{ marginLeft: "20px" }} >
                                        <Accordion expanded={expanded === i} onChange={handleChange1(i)}>
                                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                                <Typography>
                                                    {data.courseName}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <TextField sx={{ width: '75%' }} id="outlined-basic" value={data.courseName} label={"Course " + i} onChange={(e) => addCourseValue(e.target?.value, i,)} variant="outlined" />
                                                </Typography>
                                            </AccordionDetails>
                                            {data.chapters.map((data, j) => (
                                                <span key={j}>
                                                    <Grid container spacing={1} style={{ marginTop: "-15px" }}>
                                                        <Grid item xs={8} style={{ marginLeft: "20px", marginBottom: "10px" }}>
                                                            <Accordion expanded1={expanded1 === j} onChange={handleChange2(j)}>
                                                                <AccordionSummary
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                >
                                                                    <Typography>{data.chapterName}
                                                                    </Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Typography>
                                                                        <TextField sx={{ width: '75%' }} id="outlined-basic" value={data.chapterName} label={"Chapter " + j} onChange={(e) => addChapterValue(e.target?.value, i, j)} variant="outlined" />
                                                                    </Typography>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </Grid>
                                                        <Grid item xs={1} style={{ marginLeft: "-10px" }} >
                                                            <IconButton>
                                                                <AddIcon color="primary" onClick={() => addChapter(i, j)} />
                                                            </IconButton>
                                                        </Grid>
                                                        <Grid item xs={1} style={{ marginLeft: "-30px" }} >
                                                            <IconButton>
                                                                <DeleteIcon onClick={() => removeChapter(i, j)} />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </span>
                                            ))
                                            }
                                        </Accordion>
                                    </Grid>
                                    <Grid item xs={1} style={{ marginLeft: "-10px" }}  >
                                        <IconButton>
                                            <AddIcon color="primary" onClick={() => addCourse(i)} />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={1} style={{ marginLeft: "-70px" }} >
                                        <IconButton>
                                            <DeleteIcon onClick={() => removeCourse(i)} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </span>
                        ))
                        }
                    </div>
                }
            </span >
        </div >
    )
}