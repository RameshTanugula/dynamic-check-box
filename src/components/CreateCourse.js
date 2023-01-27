import * as React from 'react';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
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
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from "moment";
import SnackBar from './SnackBar';

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

    const vertical = "bottom";
    const horizontal = "center";
    const serverUrl = `http://3.111.29.120:8080/course/`;
    // const academyList = ["g"];
    const categoryList = ["DSC", "GROUPS"];
    const [isValid, setIsValid] = React.useState(false);
    const [showSreen, setShowSreen] = React.useState("Grid");
    const [courseList, setCourseList] = React.useState([]);
    const [expanded, setExpanded] = React.useState(0);
    const [expanded1, setExpanded1] = React.useState(0);
    const [expanded2, setExpanded2] = React.useState(0);
    const [selectedList, setSelectedList] = React.useState([]);
    const [multiSelectList, setmultiSelectList] = React.useState([]);
    const [errorMsg, setErrorMsg] = React.useState("");

    const [editData, setEditData] = React.useState("");
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState([]);

    const [publishedDate, setPublishedDate] = React.useState(null);
    const [expiryDate, setExpiryDate] = React.useState(null);

    const [topicTypesList, setTopicTypesList] = React.useState(
        [
            { id: 1, type: "PDF" },
            { id: 2, type: "Learning Card" },
            { id: 3, type: "Flash Card" },
            { id: 4, type: "Test" },
        ]

    );
    const [subjectList, setSubjectList] = React.useState([]);

    const [createCourseForm, setCreateCourseForm] = React.useState({
        courseTitle: "",
        instructor: "",
        tags: "",
        academy: "",
        category: "",
        description: "",
        listPrice: "",
        offerPrice: "",
    });
    const [errors, setErrors] = React.useState({
        courseTitle: "",
        instructor: "",
        tags: "",
        // academy: "",
        category: "",
        description: "",
        listPrice: "",
        offerPrice: "",
    });


    const [expiryDateError, setExpiryDateError] = React.useState("");
    const [publishedDateError, setPublishedDateError] = React.useState("")
    const [coverPageError, setCoverPageError] = React.useState("")

    const [selctForm, setSelctForm] = React.useState({
        topicName: "",
        topicType: "",
        selectedData: ""
    });

    const defaultCourseSection = [
        {
            courseName: "",
            subjects: [
                {
                    subjectName: "",
                    topics: [
                        {
                            topicName: "",
                            tapicData: [],
                            premium: "No",
                        },
                    ]
                },
            ]
        },

    ]

    const [courseSection, setCourseSection] = React.useState(defaultCourseSection);

    function handleChangeSelectData(e) {
        let value = e.target.value;
        if (e.target.name === "selectedData") {
            setSelectedList(
                typeof value === 'string' ? value.split(',') : value,
            );
            value = e.target.value.length === 0 ? "" : e.target.value;
        }
        const newData = {
            ...selctForm,
            [e.target.name]: value

        }
        setSelctForm(newData);
        if (e.target.name === "topicType" && newData.topicName !== "" && newData.topicType !== "") {
            getTopicssList(newData);
        }
    }

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
    const handleChange3 = (panel) => (event, newExpanded) => {
        setExpanded2(newExpanded ? panel : false);
    };


    function removeCourse(i) {
        courseSection.splice(i, 1);
        setCourseSection([...courseSection])
    }

    function removeChapter(i, j) {
        courseSection[i].subjects.splice(j, 1);
        setCourseSection([...courseSection])
    }
    function removeTopic(i, j, k) {
        courseSection[i].subjects[j].topics.splice(k, 1);
        setCourseSection([...courseSection])
    }

    function addCourse(i) {
        rsetSelectForm();
        const newValue = {
            courseName: "",
            subjects: [
                {
                    subjectName: "",
                    topics: [
                        {
                            topicName: "",
                            tapicData: [],
                            premium: "No",
                        },
                    ]
                }

            ]
        }

        courseSection.splice(i + 1, 0, newValue);
        setCourseSection([...courseSection])
    }

    function addChapter(i, j) {
        rsetSelectForm();
        const newValue = {
            subjectName: "",
            topics: [
                {
                    topicName: "",
                    tapicData: [],
                    premium: "No",
                },
            ]
        }
        courseSection[i].subjects.splice(j + 1, 0, newValue);
        setCourseSection([...courseSection])
    }

    function addTopic(i, j, k) {
        rsetSelectForm();
        const newValue = {
            topicName: "",
            tapicData: [],
            premium: "No",
        }
        courseSection[i].subjects[j].topics.splice(k + 1, 0, newValue);
        setCourseSection([...courseSection])
    }

    function addCourseValue(value, i) {
        courseSection[i].courseName = value;
        setCourseSection([...courseSection])
    }

    function addChapterValue(value, i, j) {
        courseSection[i].subjects[j].subjectName = value;
        setCourseSection([...courseSection])
    }

    function addTopicValue(value, i, j, k, label) {
        if (label === "premium") {
            courseSection[i].subjects[j].topics[k][label] = value === "No" ? "Yes" : "No";
        }
        else {
            courseSection[i].subjects[j].topics[k][label] = value;
        }
        setCourseSection([...courseSection])
    }

    function AddSubjectData(i, j, k) {
        var data = ""
        var showList = [];
        console.log(selectedList)
        if (selectedList.length > 0) {
            selectedList.forEach(ele => {
                data = data + ele + ",";
                multiSelectList?.forEach(obj => {
                    if (obj.id == ele) {
                        showList.push(obj.title)
                    }
                })
            });
            const obj = {
                id: courseSection[i].subjects[j].topics[k].tapicData.length,
                topicName: selctForm.topicName,
                topicType: selctForm.topicType,
                selectedData: data,
                selectedDataShow: showList,
            }
            courseSection[i].subjects[j].topics[k].tapicData = [...courseSection[i].subjects[j].topics[k].tapicData, obj]
            setCourseSection([...courseSection]);
            rsetSelectForm();
        }
        else {
            setErrorMsg("Please select Topic");
        }

        setTimeout(() => {
            setErrorMsg("")
        }, 6000);
    }

    function rsetSelectForm() {
        setSelctForm({
            topicName: "",
            topicType: "",
            selectedData: ""
        })
        setSelectedList([]);
        setmultiSelectList([])
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

    function deleData(i, j, k, l) {
        courseSection[i].subjects[j].topics[k].tapicData.splice(l, 1);
        setCourseSection([...courseSection])
    }


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

        if (publishedDate === null || publishedDate === "") {
            retunValue = false;
            setPublishedDateError("error");
        }

        if (expiryDate === null || expiryDate === "") {
            retunValue = false;
            setExpiryDateError("error")
        }
        if (selectedFile.length === 0) {
            retunValue = false;
            setCoverPageError("error")
        }

        return retunValue;

    }

    const createCourse = async () => {
        if (valid()) {
            const formData = new FormData();
            createCourseForm.publishedDate = moment(new Date(publishedDate)).format('DD/MM/YYYY');
            createCourseForm.expiryDate = moment(new Date(expiryDate)).format('DD/MM/YYYY');
            for (let i = 0; i < selectedFile?.length; i++) {
                formData.append(
                    "files", selectedFile[i],
                );
            }
            formData.append('createCourseObj',
                JSON.stringify(createCourseForm))
            const resp = await api(formData, serverUrl + "add", 'post');
            if (resp.status === 200) {
                setShowSreen("Grid");
                setOpenSnackBar(true);
                const data = {
                    type: "success",
                    message: "Course Created Sucessfully!...."
                }
                setSnackBarData(data);
            }
        }
    }
    function CloseSnakBar() {
        setOpenSnackBar(false);
    }

    async function editCourse(row) {
        setEditData(row)
        setShowSreen("Edit");
        const url = serverUrl + "get/data/bycourse/" + row.id;
        const resp = await api(null, url, 'get');
        if (resp.status == 200) {
            console.log(resp.data)
            if (resp?.data?.courseList.length > 0) {
                setCourseSection(resp?.data?.courseList)
            }
            else {
                setCourseSection(defaultCourseSection)
            }
        }
    }


    async function saveData() {
        const obj = {
            course_id: editData.id,
            courseList: courseSection
        }
        const url = serverUrl + "add/update";
        const resp = await api(obj, url, 'post');
        if (resp.status == 200) {
            setShowSreen("Grid");
            setOpenSnackBar(true);
            const data = {
                type: "success",
                message: "Course updated successfully!..."
            }
            setSnackBarData(data)
        }
    }

    async function getCourseList() {
        const resp = await api(null, serverUrl + "list", 'get');
        if (resp.status === 200) {
            setCourseList(resp.data);
        }
    }

    async function getSubjectsList() {
        const resp = await api(null, serverUrl + "get/subjects", 'get');
        if (resp.status === 200) {
            setSubjectList(resp.data);
        }
    }

    function findNameById(id, arrayName) {
        let displayName;
        if (arrayName === "topicType") {
            topicTypesList?.forEach(ele => {
                if (ele.id === id) {
                    displayName = ele.type;
                }
            });
        }
        else {
            subjectList?.forEach(ele => {
                if (ele.id === id) {
                    displayName = ele.subject_name;
                }
            });
        }
        return displayName;
    }

    async function getTopicssList(data) {
        const url = serverUrl + "get/topic/data/" + data.topicType + "/" + data.topicName;
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {
            setmultiSelectList(resp.data);
            setSelectedList([]);
        }
    }

    function closeSnakBar() {
        setOpenSnackBar(false)
    }

    const onFileChange = event => {
        setSelectedFile(event.target.files);
        setCoverPageError("");
    };

    React.useEffect(() => {
        setErrors(errors);
    }, [isValid]);

    React.useEffect(() => {
        getCourseList();
    }, []);
    React.useEffect(() => {
        getSubjectsList();
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
                        <Grid item xs={.5} ></Grid>
                        <Grid item xs={11} >
                            <span style={{ fontWeight: "bold", fontSize: "30px" }}>Create Course</span>
                        </Grid>

                        <Grid item xs={1} ></Grid>
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
                        <Grid item xs={2} ></Grid>
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

                        <Grid item xs={1} ></Grid>
                        <Grid item xs={3} >
                            <FormControl sx={{ m: 1, minWidth: 300 }} style={{ marginLeft: "2px", marginTop: "-5px" }}>
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
                        </Grid>
                        <Grid item xs={3} >
                            <span>Cover Page</span>
                            <div >
                                <input type="file" multiple onChange={onFileChange} />
                            </div>
                            {coverPageError !== "" ? <span style={{ color: "#d32f2f" }}> Cover Page is reuired </span> : ""}

                        </Grid>
                        <Grid item xs={3} style={{ marginTop: "-2px" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Published Date"
                                    value={publishedDate}
                                    inputFormat="DD/MM/YYYY"
                                    onChange={(newValue) => {
                                        setPublishedDate(newValue);
                                        setPublishedDateError("");
                                    }}
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}

                                />
                            </LocalizationProvider>
                            {publishedDateError !== "" ? <span style={{ color: "#d32f2f" }}> Publishe dDate is reuired </span> : ""}
                        </Grid>
                        <Grid item xs={2} ></Grid>
                        <Grid item xs={1} ></Grid>
                        <Grid item xs={3} style={{ marginTop: "5px" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Expiry Date"
                                    value={expiryDate}
                                    inputFormat="DD/MM/YYYY"

                                    onChange={(newValue) => {
                                        setExpiryDate(newValue);
                                        setExpiryDateError("");
                                    }}
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}

                                />
                            </LocalizationProvider>
                            {expiryDateError !== "" ? <span style={{ color: "#d32f2f" }}> Expiry Date is reuired </span> : ""}

                        </Grid>
                        <Grid item xs={3} style={{ marginTop: "5px" }}>
                            <TextField
                                label="List Price"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={createCourseForm.listPrice}
                                name="listPrice"
                                onChange={handleChange}
                                error={errors.listPrice !== ""}
                                helperText={errors.listPrice !== "" ? 'ListPrice is required' : ' '}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={3} style={{ marginTop: "5px" }}>
                            <TextField
                                label="Offer Price"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={createCourseForm.offerPrice}
                                name="offerPrice"
                                onChange={handleChange}
                                error={errors.offerPrice !== ""}
                                helperText={errors.offerPrice !== "" ? 'OfferPrice is required' : ' '}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2} >
                        </Grid>
                        <Grid item xs={1} ></Grid>
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
                                <Button variant="contained" onClick={() => createCourse()}>Submit</Button>
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
                        {courseSection?.map((data, i) => (
                            <span key={i}>
                                <Grid container spacing={1} style={{ marginTop: "2px" }} >
                                    <Grid item xs={10} style={{ marginLeft: "20px" }} >
                                        <Accordion expanded={expanded === i} onChange={handleChange1(i)}>
                                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                                <Typography>
                                                    {data?.courseName}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <TextField sx={{ width: '91%' }} id="outlined-basic" value={data?.courseName} label={"Course " + i} onChange={(e) => addCourseValue(e.target?.value, i,)} variant="outlined" />
                                                </Typography>
                                            </AccordionDetails>
                                            {data?.subjects?.map((data, j) => (
                                                <span key={j}>
                                                    <Grid container spacing={1} style={{ marginTop: "-15px" }}>
                                                        <Grid item xs={10} style={{ marginLeft: "20px", marginBottom: "10px" }}>
                                                            <Accordion expanded1={expanded1 === j} onChange={handleChange2(j)}>
                                                                <AccordionSummary
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                >
                                                                    <Typography>{data?.subjectName}
                                                                    </Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Typography>
                                                                        <TextField sx={{ width: '91%' }} id="outlined-basic" value={data?.subjectName} label={"Subject " + j} onChange={(e) => addChapterValue(e.target?.value, i, j)} variant="outlined" />
                                                                    </Typography>
                                                                </AccordionDetails>

                                                                {data?.topics?.map((data, k) => (
                                                                    <span key={k}>
                                                                        <Grid container spacing={1} style={{ marginTop: "-15px" }}>
                                                                            <Grid item xs={10} style={{ marginLeft: "20px", marginBottom: "10px" }}>
                                                                                <Accordion expanded2={expanded2 === k} onChange={handleChange3(k)}>
                                                                                    <AccordionSummary
                                                                                        aria-controls="panel1a-content"
                                                                                        id="panel1a-header"
                                                                                    >
                                                                                        <Typography>{data?.topicName}
                                                                                        </Typography>
                                                                                    </AccordionSummary>
                                                                                    <AccordionDetails>
                                                                                        <Typography>
                                                                                            <TextField sx={{ width: '72%' }} id="outlined-basic" value={data?.topicName} label={"Topic " + k} onChange={(e) => addTopicValue(e.target?.value, i, j, k, 'topicName')} variant="outlined" />
                                                                                            <FormControl sx={{ m: 1, minWidth: 490 }} style={{ marginLeft: "-3px" }}>
                                                                                                <InputLabel id="demo-simple-select-label">Subject Name</InputLabel>
                                                                                                <Select
                                                                                                    labelId="demo-simple-select-label"
                                                                                                    id="demo-simple-select"
                                                                                                    name="topicName"
                                                                                                    value={selctForm.topicName}
                                                                                                    onChange={(e) => handleChangeSelectData(e)}

                                                                                                >
                                                                                                    <MenuItem value="">
                                                                                                        <em>None</em>
                                                                                                    </MenuItem>
                                                                                                    {subjectList.map((data, s) => (
                                                                                                        <MenuItem key={s} value={data.id}>
                                                                                                            {data.subject_name}
                                                                                                        </MenuItem>
                                                                                                    ))}

                                                                                                </Select>
                                                                                                <FormHelperText>Subject Name is Required</FormHelperText>
                                                                                            </FormControl>
                                                                                            <FormControl sx={{ m: 1, minWidth: 490 }} style={{ marginLeft: "-3px" }}>
                                                                                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                                                                                <Select
                                                                                                    labelId="demo-simple-select-label"
                                                                                                    id="demo-simple-select"
                                                                                                    name="topicType"
                                                                                                    value={selctForm.topicType}
                                                                                                    onChange={(e) => handleChangeSelectData(e)}
                                                                                                >
                                                                                                    <MenuItem value="">
                                                                                                        <em>None</em>
                                                                                                    </MenuItem>
                                                                                                    {topicTypesList.map((data, s) => (
                                                                                                        <MenuItem key={s} value={data.id}>
                                                                                                            {data.type}
                                                                                                        </MenuItem>
                                                                                                    ))}
                                                                                                </Select>
                                                                                                <FormHelperText>Type is Required</FormHelperText>
                                                                                            </FormControl>
                                                                                            <FormControl sx={{ width: 490 }}>
                                                                                                <InputLabel id="demo-multiple-checkbox-label">Topic Select</InputLabel>
                                                                                                <Select
                                                                                                    labelId="demo-multiple-checkbox-label"
                                                                                                    id="demo-multiple-checkbox"
                                                                                                    multiple
                                                                                                    name="selectedData"
                                                                                                    value={selectedList}
                                                                                                    onChange={(e) => handleChangeSelectData(e)}
                                                                                                    label="selectedData"
                                                                                                    renderValue={(selected) => selected.join(', ')}
                                                                                                    MenuProps={MenuProps}
                                                                                                >
                                                                                                    {multiSelectList.map((data) => (
                                                                                                        <MenuItem key={data.id} value={data.id}>
                                                                                                            <Checkbox checked={selectedList.indexOf(data.id) > -1} />
                                                                                                            <ListItemText primary={data.title} />
                                                                                                        </MenuItem>
                                                                                                    ))}
                                                                                                </Select>
                                                                                                <FormHelperText>Please select Subject Name and Type</FormHelperText>
                                                                                            </FormControl>
                                                                                            <br />

                                                                                            <FormControlLabel
                                                                                                control={
                                                                                                    <Checkbox
                                                                                                        checked={data?.premium === "Yes"}
                                                                                                        value={data?.premium}
                                                                                                        onChange={(e) => addTopicValue(e.target?.value, i, j, k, 'premium')}
                                                                                                    />
                                                                                                }
                                                                                                label="Premium"
                                                                                            />
                                                                                            <Stack direction="row" >
                                                                                                <Button variant="contained" onClick={() => AddSubjectData(i, j, k)}>Add Topic</Button>
                                                                                            </Stack>
                                                                                            <br />
                                                                                            <span style={{ fontWeight: "bold", color: "red" }}>{errorMsg}</span>
                                                                                            {(data?.tapicData?.length > 0) &&
                                                                                                <TableContainer component={Paper}>
                                                                                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                                                                        <TableHead>
                                                                                                            <TableRow>
                                                                                                                <TableCell>Topic Name</TableCell>
                                                                                                                <TableCell>Type</TableCell>
                                                                                                                <TableCell>Selected Data</TableCell>
                                                                                                                <TableCell>Action</TableCell>
                                                                                                            </TableRow>
                                                                                                        </TableHead>
                                                                                                        <TableBody>
                                                                                                            {data?.tapicData.map((row, index) => (
                                                                                                                <TableRow
                                                                                                                    key={row.id}
                                                                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                                                                >

                                                                                                                    <TableCell >{findNameById(row.topicName, "")}</TableCell>
                                                                                                                    <TableCell >{findNameById(row.topicType, "topicType")}</TableCell>
                                                                                                                    <TableCell >{row.selectedDataShow}</TableCell>
                                                                                                                    <TableCell >
                                                                                                                        <Button variant="contained" onClick={() => deleData(i, j, k, index)}>Delete</Button>
                                                                                                                    </TableCell>
                                                                                                                </TableRow>
                                                                                                            ))}
                                                                                                        </TableBody>
                                                                                                    </Table>
                                                                                                </TableContainer>
                                                                                            }

                                                                                        </Typography>
                                                                                    </AccordionDetails>
                                                                                </Accordion>
                                                                            </Grid>
                                                                            <Grid item xs={1} style={{ marginLeft: "-10px" }} >
                                                                                <IconButton>
                                                                                    <AddIcon color="primary" onClick={() => addTopic(i, j, k)} />
                                                                                </IconButton>
                                                                            </Grid>
                                                                            <Grid item xs={1} style={{ marginLeft: "-40px" }} >
                                                                                <IconButton>
                                                                                    <DeleteIcon onClick={() => removeTopic(i, j, k)} />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </span>
                                                                ))
                                                                }
                                                            </Accordion>
                                                        </Grid>
                                                        <Grid item xs={1} style={{ marginLeft: "-10px" }} >
                                                            <IconButton>
                                                                <AddIcon color="primary" onClick={() => addChapter(i, j)} />
                                                            </IconButton>
                                                        </Grid>
                                                        <Grid item xs={1} style={{ marginLeft: "-60px" }} >
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

            {openSnackBar &&
                <SnackBar data={snackBarData} CloseSnakBar={CloseSnakBar} />
            }
        </div >
    )
}