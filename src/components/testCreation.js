import * as React from 'react'
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import './common.css';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SnackBar from './SnackBar';
import Loader from './Loader';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';

export default function TestCreation() {
    // const serverUrl = `http://localhost:8080/test/`
    const serverUrl = securedLocalStorage.baseUrl + 'test/';
    const [checked, setChecked] = React.useState([]);
    const [allCheckBoxValue, setAllCheckBoxValue] = React.useState(false);
    const [questionData, setQuestionData] = React.useState([]);
    const [selectedQuestionsList, setSelectedQuestionsList] = React.useState([]);
    const [showForm, setShowForm] = React.useState(true);
    const [catagoryData, setCategoryData] = React.useState([]);
    const [result, setResult] = React.useState([]);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [scheduledDate, setScheduledDate] = React.useState(null);
    const [isValid, setIsValid] = React.useState(false);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [showLoader, setShowLoader] = React.useState(false);
    const [isOnline, setIsOnline] = React.useState(false);
    const [isOMR, setIsOMR] = React.useState(false);
    const [testTypeError, setTestTypeError] = React.useState("");

    const defaultTestFields = {
        testName: "",
        testDescription: "",
        testDuration: "",
        numberOfQuestions: "",
        nuberOfAttempts: "",
    }

    const [testForm, setTestForm] = React.useState(defaultTestFields);
    const errorTestFields = {
        testName: "",
        testDescription: "",
        testDuration: "",
        numberOfQuestions: "",

    }
    const [errors, setErrors] = React.useState(errorTestFields);

    function handleChange(e) {
        let value = e.target.value;
        const newData = {
            ...testForm,
            [e.target.name]: value
        }
        setTestForm(newData);
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

    async function fetchData() {
        setShowLoader(true);
        const data = await api(null, serverUrl + 'get/data', 'get');
        const catData = await api(null, serverUrl + 'get/categories', 'get');
        if (catData.status === 200) {
            setCategoryData(catData.data);
        }
        if (data.status === 200) {
            setQuestionData(data.data?.res)
        }
        setShowLoader(false);
    }



    const prepareCatIds = () => {
        let ids1 = [];
        let ids2 = [];
        let ids3 = [];
        let ids4 = [];
        const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
        if (catagoryData && catagoryData.length > 0) {
            const l1 = { viewData: [catagoryData[0]] };
            const l2 = { viewData: [catagoryData[1]] };
            const l3 = { viewData: [catagoryData[2]] };
            const l4 = { viewData: [catagoryData[3]] };
            const tmpResult1 = l1.viewData.flatMap(flat);
            const tmpResult2 = l2.viewData.flatMap(flat);
            const tmpResult3 = l3.viewData.flatMap(flat);
            const tmpResult4 = l4.viewData.flatMap(flat);
            const examCatIds = tmpResult1.map(e => e.id);
            const subjectCatIds = tmpResult2.map(e => e.id);
            const conceptCatIds = tmpResult3.map(e => e.id);
            const sourceCatIds = tmpResult4.map(e => e.id);

            for (let i = 0; i < checked.length; i++) {
                const examIdExist = examCatIds.find(ec => ec === checked[i]);
                const subIdExist = subjectCatIds.find(sc => sc === checked[i]);
                const conceptIdExist = conceptCatIds.find(cc => cc === checked[i]);
                const sourceIdExist = sourceCatIds.find(soc => soc === checked[i]);
                if (examIdExist) {
                    ids1.push(checked[i]);
                }
                if (subIdExist) {
                    ids2.push(checked[i]);
                }
                if (conceptIdExist) {
                    ids3.push(checked[i]);
                }
                if (sourceIdExist) {
                    ids4.push(checked[i]);
                }
            }

        }
        return [ids1, ids2, ids3, ids4]
    }
    const onClickCheckBox = (id, index) => {
        if (id && index >= 0) {
            setAllCheckBoxValue(false);
            if (selectedQuestionsList.includes(id)) {
                var Index = selectedQuestionsList.findIndex(x => x === id);
                selectedQuestionsList.splice(Index, 1);
                setSelectedQuestionsList([...selectedQuestionsList]);
            }
            else {
                if (selectedQuestionsList.length < parseInt(testForm.numberOfQuestions)) {
                    selectedQuestionsList.push(id)
                    setSelectedQuestionsList([...selectedQuestionsList]);
                }
                else {
                    alert(`You are able select maximum ${testForm.numberOfQuestions} questions only.`)
                }

            }
        } else {
            setAllCheckBoxValue(!allCheckBoxValue)
            questionData.map(q => q.checked = !allCheckBoxValue)
        }
        setQuestionData(questionData);
    }

    function valid() {
        let retunValue = false;
        let result = [];
        result = Object.keys(testForm).filter(ele => !testForm[ele]);
        if (result.includes("nuberOfAttempts")) {
            result.splice(result.indexOf('nuberOfAttempts'), 1);
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
        if (!isOnline && !isOMR) {
            retunValue = false;
            setIsValid(true);
            setTestTypeError("error");
        }
        else {
            setTestTypeError("");
        }
        return retunValue;
    }

    function submitTestForm() {
        if (valid()) {
            setShowForm(false)
        }
    }

    function resetForm() {
        setTestForm(defaultTestFields);
        setErrors(errorTestFields);
        setScheduledDate(null);
        setTestTypeError("");
        setIsOMR(false);
        setIsOnline(false);
        setIsValid(false)
    }

    const addToTestHandler = async () => {
        const payload = {
            test_name: testForm.testName,
            test_duration: testForm.testDuration,
            test_description: testForm.testDescription,
            no_of_questions: testForm.numberOfQuestions,
            no_of_attempts: testForm.nuberOfAttempts,
            scheduled_date: scheduledDate !== null ? CheckAccess.getDateInFormat(scheduledDate) : null,
            question_ids: selectedQuestionsList,
            is_online: isOnline,
            is_omr: isOMR,
            is_active: 1,
            created_by: 1,
            update_by: 1
        }
        setShowLoader(true);
        const data = await api(payload, serverUrl + 'add/test', 'post');
        if (data.status === 200) {
            setShowForm(true);
            resetForm();
            setSelectedQuestionsList([]);
            setOpenSnackBar(true);
            const message = {
                type: "success",
                message: "Test added successfully!..."
            }
            setSnackBarData(message);
        }
        else {
            setOpenSnackBar(true);
            const message = {
                type: "error",
                message: data.response.data.error
            }
            setSnackBarData(message);
        }
        setShowLoader(false);
    }

    function closeSnakBar() {
        setOpenSnackBar(false)
    }

    React.useEffect(() => {
        const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
        const tmpData = { viewData: catagoryData }
        const tmpResult = tmpData.viewData.flatMap(flat);
        setResult([...tmpResult])
    }, [catagoryData]);

    React.useEffect(() => {
        async function getData() {
            const catIds = prepareCatIds();
            setShowLoader(true);
            const data = await api({ catIds: catIds }, serverUrl + 'get/questions/bycategory', 'post');
            if (data.status === 200) {
                setQuestionData(data.data?.res)
            }
            setShowLoader(false);
        }
        getData();
    }, [checked]);

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
        fetchData();
    }, []);
    const getQuestions = (qData) => {
        return (
            <>
                <span>Question: {qData.question}</span>
                <br />
                <span>Answer: {qData.answer}</span>
            </>
        )
    }
    const getMCQ1Questions = (row) => {
        return (
            <><span>Question: {row.question}</span>
                <br />
                {row.part_a && row.part_b && <div>

                    <span className='mcq1-left'>PART A</span>

                    <span className='mcq1-left'>PART B</span>
                </div>}
                {row.part_a && row.part_b && row.part_a?.split(',').map((a, i) => {
                    return (<div >
                        <br />
                        <div style={{ width: "100%" }} >
                            <span className='mcq1-left'>{i + 1}. {a} </span>
                            <span className='mcq1-right'>  &nbsp;&nbsp;&nbsp;&nbsp; {i + 1}. {row.part_b?.split(',')[i]} </span>
                        </div>
                    </div>)
                })
                }
                <br />
                <div style={{ paddingTop: '6rem', fontWeight: 600 }}>
                    <span>Answer: {row.answer}</span>
                </div>
            </>
        )
    }
    const getMCQ2Questions = (qData) => {
        return (
            <>
                <span>Question: {qData.question}</span> <br />
                <span>A: {qData.part_a}</span> <br />
                <span>B: {qData.part_b}</span>
                <br />
                <span>Answer: {qData.answer}</span>
            </>
        )
    }
    const getImageQuestions = (qData) => {
        return (
            <>
                <div>Question: {qData.question}</div>
                <div>
                    <img style={{
                        height: '10rem',
                        width: 'auto'
                    }} src={qData.QUrls} />
                </div>
                <br />
                <span>Answer: {qData.answer}</span>
            </>
        )
    }
    return (
        <div>
            {!showForm &&
                <Grid container spacing={1} >
                    <Grid item xs={12} style={{ position: "absolute", right: "50px" }}>
                        <Stack spacing={4} direction="row" sx={{ color: 'action.active' }}>
                            <Button variant="contained" onClick={() => setShowForm(true)}>Back</Button>
                            <Button variant="contained" disabled={selectedQuestionsList.length !== parseInt(testForm.numberOfQuestions)} onClick={() => addToTestHandler()}>Add Test</Button>
                            <Badge color="secondary" badgeContent={selectedQuestionsList.length + "/" + parseInt(testForm.numberOfQuestions)}>
                                <span style={{ marginTop: "7px" }}> <ShoppingCartIcon /></span>
                            </Badge>
                        </Stack>
                    </Grid>
                    <Grid item xs={1} style={{ width: '100%', float: 'left', paddingLeft: '5%', paddingTop: '5%' }}>
                        {catagoryData?.length > 0 && <CheckboxTree
                            // nodes={treeViewData}
                            nodes={catagoryData}
                            checked={checked}
                            onCheck={checked => setChecked(checked)}
                            onClick={(e) => onClickCheckBox(e)}
                            disabled={!readAndWriteAccess}
                        />
                        }
                    </Grid>

                    <Grid item xs={12} style={{ overflow: "auto", height: "900px", marginTop: "10px" }} >
                        {questionData?.length > 0 &&
                            questionData?.map((qData, i) => {
                                return (
                                    <div style={{ padding: '5px' }}>

                                        <div>
                                            <div><input style={{ cursor: "pointer" }} disabled={!readAndWriteAccess} checked={selectedQuestionsList.includes(qData.q_id)} onClick={() => onClickCheckBox(qData.q_id, i)} type="checkbox" /></div>
                                            {/* <div style={{
                                                paddingTop: '5px',
                                                border: '1px solid blue'
                                            }}> 
                                            
                                            {(qData.type==='MCQ2') && <span>{qData.part_a}</span>}

                                             {(qData.QUrls && qData.QUrls !=='' ) ?  <img style={{height: '10rem',
                                                width: 'auto'}} src={qData.QUrls}/>
                                                : <span>Question: {qData.question}</span>} <br />
                                                <span>Answer: {qData.answer}</span> 
                                            </div> */}
                                            <div style={{
                                                paddingTop: '5px',
                                                border: '1px solid blue'
                                            }}>
                                                {(!qData.type) && getQuestions(qData)}
                                                {(qData.type === 'MCQ1') && getMCQ1Questions(qData)}
                                                {(qData.type === 'MCQ2') && getMCQ2Questions(qData)}
                                                {(qData.type === 'IMG') && getImageQuestions(qData)}
                                            </div>
                                        </div>

                                    </div>)
                            })
                        }
                    </Grid>
                </Grid>}
            {showForm &&
                <Grid container spacing={1} >
                    <Grid item xs={1} ></Grid>
                    <Grid item xs={4} >
                        <TextField
                            label="Test Name"
                            required
                            id="outlined-start-adornment"
                            sx={{ width: '100%' }}
                            value={testForm.testName}
                            onChange={handleChange}
                            name="testName"
                            error={errors.testName !== ""}
                            helperText={errors.testName !== "" ? 'Test Name is reuired' : ' '}
                            disabled={!readAndWriteAccess}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            label="Number Of Questions"
                            required
                            id="outlined-start-adornment"
                            sx={{ width: '100%' }}
                            value={testForm.numberOfQuestions}
                            onChange={handleChange}
                            name="numberOfQuestions"
                            type="number"
                            error={errors.numberOfQuestions !== ""}
                            helperText={errors.numberOfQuestions !== "" ? 'Number Of Questions is reuired' : ' '}
                            disabled={!readAndWriteAccess}
                        />
                    </Grid>
                    <Grid item xs={3} ></Grid>
                    <Grid item xs={1} ></Grid>
                    <Grid item xs={4} >
                        <TextField
                            label="Test Duration"
                            required
                            id="outlined-start-adornment"
                            sx={{ width: '100%' }}
                            value={testForm.testDuration}
                            onChange={handleChange}
                            name="testDuration"
                            type="number"
                            error={errors.testDuration !== ""}
                            helperText={errors.testDuration !== "" ? 'Test Duration is reuired' : ' '}
                            disabled={!readAndWriteAccess}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        {/* <span style={{font}}>Test Type</span> */}
                        <InputLabel style={{ fontWeight: "bold" }} id="demo-multiple-checkbox-label">Test Type *</InputLabel>
                        <FormControlLabel
                            label="Online"
                            control={
                                <Checkbox
                                    disabled={!readAndWriteAccess}
                                    checked={isOnline}
                                    onClick={() => { setIsOnline(!isOnline); setTestTypeError("") }}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />}
                        />
                        <FormControlLabel
                            label="OMR"
                            control={
                                <Checkbox
                                    disabled={!readAndWriteAccess}
                                    checked={isOMR}
                                    onClick={() => { setIsOMR(!isOMR);; setTestTypeError("") }}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />}
                        />
                        <br />
                        {testTypeError !== "" && <span style={{ color: "red" }}>Test type is required</span>}
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={1} />
                    <Grid item xs={4} >
                        <TextField
                            label="Number Of Attempts"
                            id="outlined-start-adornment"
                            sx={{ width: '100%' }}
                            value={testForm.nuberOfAttempts}
                            onChange={handleChange}
                            name="nuberOfAttempts"
                            type="number"
                            disabled={!readAndWriteAccess}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Scheduled Date"
                                value={scheduledDate}
                                inputFormat="DD/MM/YYYY"
                                onChange={(newValue) => {
                                    setScheduledDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                disabled={!readAndWriteAccess}

                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={1} />
                    <Grid item xs={7} >
                        <TextField
                            label="Test Description "
                            required
                            id="outlined-start-adornment"
                            sx={{ width: '100%' }}
                            value={testForm.testDescription}
                            onChange={handleChange}
                            name="testDescription"
                            multiline
                            rows={4}
                            error={errors.testDescription !== ""}
                            helperText={errors.testDescription !== "" ? 'Test Description is reuired' : ' '}
                            disabled={!readAndWriteAccess}
                        />

                    </Grid>
                    <Grid item xs={4} ></Grid>
                    <Grid item xs={1} ></Grid>
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => resetForm()} disabled={!readAndWriteAccess}>reset</Button>
                        <Button variant="contained" onClick={() => submitTestForm()} disabled={!readAndWriteAccess} >submit</Button>
                    </Stack>
                </Grid>
            }

            {openSnackBar && <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />}
            {showLoader &&
                <Loader />
            }

        </div>
    )
}