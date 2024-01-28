import * as React from 'react'
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import './common.css';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SnackBar from './SnackBar';
import Loader from './Loader';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import AddNewQuestions from './AddNewQuestion';
import { Dialog, DialogContent } from '@mui/material';
import { Button, Checkbox, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableFooter, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import QuestionPreview from './questionPreview';

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
    const [isAddNewQuestionsModalOpen, setAddNewQuestionsModalOpen] = React.useState(false);
    const [manualQuestions, setManualQuestions] = React.useState([])
    const [preViewForm, setPreViewForm] = React.useState(false)
    const [isPreviewOpen, setPreviewOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedQuestionsData, setSelectedQuestionsData] = React.useState([])

    //pagination

    // const emptyRows =
    // page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questionData.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const BpIcon = styled('span')(({ theme }) => ({
        borderRadius: '50%',
        width: '65%',
        height: 16,
        boxShadow:
            theme.palette.mode === 'dark'
                ? '0 0 0 1px rgb(16 22 26 / 40%)'
                : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
        backgroundImage:
            theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
                : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background:
                theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
        },
    }));

    const BpCheckedIcon = styled(BpIcon)({
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    });

    function TablePaginationActions(props) {
        const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
        const theme = useTheme();
        const { count, page, rowsPerPage, onPageChange } = props;

        const handleFirstPageButtonClick = (event) => {
            onPageChange(event, 0);
        };

        const handleBackButtonClick = (event) => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = (event) => {
            onPageChange(event, page + 1);
        };

        const handleLastPageButtonClick = (event) => {
            onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };
        React.useEffect(() => {
            const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
            if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
                setReadAndWriteAccess(true);
            }
        }, []);

        return (
            <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0 && !readAndWriteAccess}
                    aria-label="first page"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page === 0 && !readAndWriteAccess}
                    aria-label="previous page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1 && !readAndWriteAccess}
                    aria-label="next page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1 && !readAndWriteAccess}
                    aria-label="last page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </Box>
        );
    }
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
        console.log(data, 'data');
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
    
    const onClickCheckBox = (id, i) => {
        console.log(id, 'id');
        const index = page * rowsPerPage + i;

        console.log(index, 'index');
        // const Data = 
        if (id && index >= 0) {
            setAllCheckBoxValue(false);
            if (selectedQuestionsList.includes(id)) {
                var Index = selectedQuestionsList.findIndex(x => x === id);
                selectedQuestionsList.splice(Index, 1);
                setSelectedQuestionsList([...selectedQuestionsList]);
                console.log(selectedQuestionsList, 'selectedQuestionsList1');
            }
            else {
                if ((selectedQuestionsList.length + manualQuestions?.length) < parseInt(testForm.numberOfQuestions)) {
                    selectedQuestionsList.push(id) //,  qData
                    // setSelectedQuestionsList(prevList => [...prevList, id]);
                    setSelectedQuestionsList([...selectedQuestionsList]);
                    console.log(selectedQuestionsList, 'selectedQuestionsList');
                }
                else {
                    alert(`You are able select maximum ${testForm.numberOfQuestions} questions only.`)
                }

            }
        } else {
            setAllCheckBoxValue(!allCheckBoxValue)
            questionData.map(q => q.checked = !allCheckBoxValue)
            console.log();
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

        setShowLoader(true);
        let manualQIds = [];
        if (manualQuestions?.length > 0) {
            for (let i = 0; i < manualQuestions.length; i++) {
                const data1 = await api(manualQuestions[i], securedLocalStorage.baseUrl + 'question/' + 'create/questions/mcq', 'post');
                console.log(data1, 'data1');
                if (data1.status === 200) {
                    manualQIds.push(data1.data.res.insertId)
                }
            }
        }
        const payload = {
            test_name: testForm.testName,
            test_duration: testForm.testDuration,
            test_description: testForm.testDescription,
            no_of_questions: testForm.numberOfQuestions,
            no_of_attempts: testForm.nuberOfAttempts,
            scheduled_date: scheduledDate !== null ? CheckAccess.getDateInFormat(scheduledDate) : null,
            question_ids: selectedQuestionsList.concat(manualQIds),
            is_online: isOnline,
            is_omr: isOMR,
            is_active: 1,
            created_by: 1,
            update_by: 1
        }
        const data = await api(payload, serverUrl + 'add/test', 'post');
        if (data.status === 200) {
            setShowForm(true);
            resetForm();
            setSelectedQuestionsList([]);
            setOpenSnackBar(true);
            setManualQuestions([])
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
                            <span className='mcq1-left'>{String.fromCharCode(65 + i)}. {a} </span>
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
                <div>
                  {qData.part_a && qData.part_a?.split(',').map((a, i) => (
                   <div key={i}>
                        <br />
                       <div style={{ width: "100%" }}>
                      <span>{String.fromCharCode(65 + i)}.{a}</span>
         
                       </div>
                   </div>
                   ))}
                 </div>
                <br />
                {/* <span>B: {qData.part_b}</span> */}
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
    const openAddNewQuestionsModal = () => {
        setAddNewQuestionsModalOpen(true);
    };
    const closeAddNewQuestionsModal = (data) => {
        setManualQuestions(manualQuestions.concat(data))
        setAddNewQuestionsModalOpen(false);
    };

    const closePreviewForm = () => {
        setPreviewOpen(false);
    };


    const handleDeleteQuestion = (questionId, questionTitle) => {
        console.log(questionId, 'questionId');
        console.log(questionTitle, 'questionTitle');
        // Update state by removing the deleted question
          const isQuestionExist = selectedQuestionsList.find(id => id === questionId);
        //    console.log(isQuestionExist, 'isQuestionExist');
           if (isQuestionExist) {

            const updatedQuestionsList = selectedQuestionsList.filter(id => id !== questionId);
            console.log(updatedQuestionsList, 'updatedQuestionsList11111');
            const updatedQuestionsData = selectedQuestionsData.filter(question => question.q_id !== questionId);
            setSelectedQuestionsList(updatedQuestionsList);
            setSelectedQuestionsData(updatedQuestionsData);
            // console.log(selectedQuestionsData, 'manualSelectedQuestionsData');
        } else {

            // Remove manual question with matching title
            const updatedQuestionsListByTitle = selectedQuestionsList.filter(question => question.title !== questionId);
            // console.log(updatedQuestionsListByTitle, 'updatedQuestionsListByTitle');
            const updatedQuestionsDataByTitle = selectedQuestionsData.filter(question => question.title !== questionId);
            // console.log(updatedQuestionsDataByTitle, '***updatedQuestionsDataByTitle*****')

            const Questions = manualQuestions.filter((q)=>q.title !== questionId)

            setSelectedQuestionsList(updatedQuestionsListByTitle);
            setSelectedQuestionsData(updatedQuestionsDataByTitle);
            setManualQuestions(Questions)
            
        }
    };


    const openPreviewForm = () => {
        if (selectedQuestionsList.length + manualQuestions.length > 0) {
            const selectedQData = questionData.filter(question => selectedQuestionsList.includes(question.q_id));
            console.log(selectedQData, 'selectedQData');
            setSelectedQuestionsData(selectedQData.concat(manualQuestions));
            console.log(selectedQuestionsData, 'setSelectedQuestionsData');
            setPreviewOpen(true);
        } else {
            console.error("selectedQuestionsList is empty.");
        }
    };



    return (
        <div>
            {!showForm &&
                <Grid container spacing={1} >
                    <Grid item xs={12} style={{ position: "absolute", right: "50px" }}>
                        <Stack spacing={4} direction="row" sx={{ color: 'action.active' }}>
                            <Button variant="contained" disabled={selectedQuestionsList.length + manualQuestions.length === parseInt(testForm.numberOfQuestions)} onClick={openAddNewQuestionsModal}>Add New Question</Button>
                            <Button variant="contained" onClick={() => setShowForm(true)}>Back</Button>
                            <Button variant="contained" disabled={selectedQuestionsList.length + manualQuestions.length === 0} onClick={openPreviewForm} >Preview</Button>
                            <Button variant="contained" disabled={selectedQuestionsList.length + manualQuestions.length !== parseInt(testForm.numberOfQuestions)} onClick={() => addToTestHandler()}>Add Test</Button>
                            <Badge color="secondary" badgeContent={selectedQuestionsList.length + manualQuestions.length + "/" + parseInt(testForm.numberOfQuestions)}>
                                <span style={{ marginTop: "7px" }}> <ShoppingCartIcon /></span>
                            </Badge>
                        </Stack>
                    </Grid>
                    {isAddNewQuestionsModalOpen && (
                        <AddNewQuestions isOpen={isAddNewQuestionsModalOpen} onClose={closeAddNewQuestionsModal} />
                    )}

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
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                Action
                                            </TableCell>
                                            <TableCell align="center">Questions </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {(rowsPerPage > 0 ? questionData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : questionData
                                        ).map((qData, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="center">
                                                    <span>
                                                        <input
                                                            style={{ cursor: "pointer" }}
                                                            disabled={!readAndWriteAccess}
                                                            checked={selectedQuestionsList.includes(qData.q_id)}
                                                            onClick={() => onClickCheckBox(qData.q_id, i)}
                                                            type="checkbox"
                                                        />
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {/* Render your statements here based on the question type */}
                                                    {((!qData.type) || (qData.type === "null")) && getQuestions(qData)}
                                                    {(qData.type === 'MCQ1') && getMCQ1Questions(qData)}
                                                    {(qData.type === 'MCQ2') && getMCQ2Questions(qData)}
                                                    {(qData.type === 'IMG') && getImageQuestions(qData)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        }
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[10, 25, 50, 100, { label: 'All', value: -1 }]}
                                                colSpan={4}
                                                count={questionData.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                SelectProps={{
                                                    inputProps: {
                                                        'aria-label': 'questionData per page',
                                                    },
                                                    native: true,
                                                }}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                ActionsComponent={TablePaginationActions}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>}
                        {/* {questionData?.length > 0 &&
                            questionData?.map((qData, i) => {
                                return (
                                    <div style={{ padding: '5px' }}>

                                        <div>
                                            <div><input style={{ cursor: "pointer" }} disabled={!readAndWriteAccess} checked={selectedQuestionsList.includes(qData.q_id)} onClick={() => onClickCheckBox(qData.q_id, i)} type="checkbox" /></div> */}
                        {/* <div style={{
                                                paddingTop: '5px',
                                                border: '1px solid blue'
                                            }}> 
                                            
                                            {(qData.type==='MCQ2') && <span>{qData.part_a}</span>}

                                             {(qData.QUrls && qData.QUrls !=='' ) ?  <img style={{height: '10rem',
                                                width: 'auto'}} src={qData.QUrls}/>
                                                : <span>Question: {qData.question}</span>} <br />
                                                <span>Answer: {qData.answer}</span> 
                                            </div>
                                            <div style={{
                                                paddingTop: '5px',
                                                border: '1px solid blue'
                                            }}>
                                                {((!qData.type) || (qData.type === "null")) && getQuestions(qData)}
                                                {(qData.type === 'MCQ1') && getMCQ1Questions(qData)}
                                                {(qData.type === 'MCQ2') && getMCQ2Questions(qData)}
                                                {(qData.type === 'IMG') && getImageQuestions(qData)}
                                            </div>
                                        </div>

                                    </div>)
                            })
                        } */}
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
            {/* QuestionPreviewDialog */}
            <Dialog open={isPreviewOpen} onClose={closePreviewForm} maxWidth="md" fullWidth>
                <DialogContent>
                    <QuestionPreview selectedQuestionsList={selectedQuestionsData} onClose={closePreviewForm} onDelete={handleDeleteQuestion} />
                </DialogContent>
            </Dialog>


            {openSnackBar && <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />}
            {showLoader &&
                <Loader />
            }

        </div>
    )
}