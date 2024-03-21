import * as React from 'react'
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import './common.css';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Stack, Button, Grid, TextField, Checkbox, Box, Typography, Modal, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, IconButton, TableFooter, TablePagination } from '@mui/material';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
import SnackBar from './SnackBar';
import Loader from './Loader';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function BitbankSetCreation() {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    // const serverUrl = `http://localhost:8080/test/`
    const serverUrl = securedLocalStorage.baseUrl + 'test/';
    const [checked, setChecked] = React.useState([]);
    const [allCheckBoxValue, setAllCheckBoxValue] = React.useState(false);
    const [questionData, setQuestionData] = React.useState([]);
    const [selectedQuestionsList, setSelectedQuestionsList] = React.useState([]);
    const [catagoryData, setCategoryData] = React.useState([]);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [showLoader, setShowLoader] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedQuestion, setSelectedQuestion] = React.useState([]);

    const fields = {
        title: ""
    }
    const [formData, setFormData] = React.useState(fields);

    async function fetchData() {
        setShowLoader(true);
        // const data = await api(null, serverUrl + 'set/bitbank/data', 'get');
        const catData = await api(null, serverUrl + 'get/categories', 'get');
        if (catData.status === 200) {
            setCategoryData(catData.data);
        }
        // if (data.status === 200) {
        //     setQuestionData(data.data?.res)
        // }
    }
    const onCloseMOdal = () => {
        setOpenModal(false);
    }


    //pagination
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
    // const onClickCheckBox = (id, index) => {
    //     if (selectedQuestionsList.includes(id)) {
    //         var Index = selectedQuestionsList.findIndex(x => x === id);
    //         selectedQuestionsList.splice(Index, 1);
    //         setSelectedQuestionsList([...selectedQuestionsList]);
    //     }
    //     else {
    //         selectedQuestionsList.push(id)
    //         setSelectedQuestionsList([...selectedQuestionsList]);

    //     }
    //     setAllCheckBoxValue(!allCheckBoxValue)
    //     questionData.map(q => q.checked = !allCheckBoxValue)
    //     setQuestionData(questionData);
    // }

    //working

    const onClickCheckBox = (id, index) => {
        if (id === 'selectAll') {
            // If the "Select All" checkbox is clicked
            const allQuestionIds = questionData?.map(q => q.q_id);
            if (selectedQuestionsList.length === allQuestionIds.length) {
                // Deselect all questions if all are currently selected
                setSelectedQuestionsList([]);
            } else {
                // Select all questions if not all are currently selected
                setSelectedQuestionsList(allQuestionIds);
            }
        } else {
            // If a specific question checkbox is clicked
            if (selectedQuestionsList.includes(id)) {
                var Index = selectedQuestionsList.findIndex(x => x === id);
                selectedQuestionsList.splice(Index, 1);
                setSelectedQuestionsList([...selectedQuestionsList]);
            } else {
                selectedQuestionsList.push(id)
                setSelectedQuestionsList([...selectedQuestionsList]);
            }
        }
        setAllCheckBoxValue(!allCheckBoxValue);
        questionData?.map(q => q.checked = !allCheckBoxValue);
        setQuestionData(questionData);
    };






    const oepnModalPopup = () => {
        setOpenModal(true);
    }
    const addToTestHandler = async () => {
        setOpenModal(false)

        const regex = /[^\w\s]/gi;

        // Remove special characters using the regular expression and replace method

        // Assuming selectedQuestionsList is an array of questions with properties q_id, question, and answer
        const questionDataToSend = selectedQuestionsList?.map(questionId => {
            const selectedQuestion = questionData.find(q => q.q_id === questionId);
            return {
                q_id: selectedQuestion.q_id,
                qus: selectedQuestion.question,
                ans: selectedQuestion.answer,
            };
        });
        console.log(questionDataToSend, 'question***');
        questionDataToSend.forEach(question => {
            if (typeof question.qus === 'string') {
                console.log(question.qus);
                // question.qus = question.qus.replace( /[\.,\-"“”\(\)&@:?!<>{}\*]/g, '');
                question.qus = JSON.stringify(question.qus).replace(/["“'*(){}\t]/g, '').replace(/\\r\\n/g, '').trim();
            }
            if (typeof question.ans === 'string') {
                console.log(question.ans);
                // question.qus = question.qus.replace( /[\.,\-"“”\(\)&@:?!<>{}\*]/g, '');
                question.ans = JSON.stringify(question.ans).replace(/["“'*(){}\t]/g, '').replace(/\\r\\n/g, '').trim();
            }
        });
        // }
        // console.log(questionDataToSend,  'questionDataToSend');
        // Create a payload with selected questions
        const payload = {
            title: formData.title,
            payload: JSON.stringify(questionDataToSend),
            // payload: questionDataToSend,

        };

        console.log(payload, 'pa***289');

        setShowLoader(true);
        const data = await api(payload, serverUrl + 'bitbank/set', 'post');
        console.log(data.config.data, 'data**255');

        // Check if 'data' is defined before accessing its properties
        if (data && data.status === 200) {
            setSelectedQuestionsList([]);
            setFormData(fields);
            setOpenSnackBar(true);
            const message = {
                type: "success",
                message: "Test added successfully!..."
            };
            setSnackBarData(message);
        } else {
            console.error('Error: Invalid data format or status code');
            setOpenSnackBar(true);
            const message = {
                type: "error",
                message: data?.response?.data?.error || "Unknown error"
            };
            console.log(message, 'message**327');
            setSnackBarData(message);
        }

        //  catch (error) {
        //     console.error('Error in addToTestHandler:', error);
        //     setOpenSnackBar(true);
        //     const message = {
        //         type: "error",
        //         message: "An unexpected error occurred"
        //     };
        //     setSnackBarData(message);
        // }
        setShowLoader(false);
    }

    function closeSnakBar() {
        setOpenSnackBar(false)
    }


    function handleChange(e) {
        const newData = {
            ...formData,
            [e.target.name]: e.target.value

        }
        setFormData(newData);
    }

    React.useEffect(() => {
        const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
        const tmpData = { viewData: catagoryData }
        const tmpResult = tmpData.viewData.flatMap(flat);
        // setResult([...tmpResult])
    }, [catagoryData]);



    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
        fetchData();
    }, []);
    React.useEffect(() => {
        async function getData() {
            const catIds = prepareCatIds();
            setShowLoader(true);
            let data;
            if (catIds && ((catIds[0] && catIds[0]?.length > 0)) || (catIds[1] && catIds[1]?.length > 0)
                || (catIds[2] && catIds[2]?.length > 0) || (catIds[3] && catIds[3]?.length > 0)) {
                data = await api({ catIds: catIds }, serverUrl + 'get/bitbank/bycategory', 'post');
            } else {
                data = await api(null, serverUrl + 'set/bitbank/data', 'get');
            }
            if (data.status === 200) {
                setQuestionData(data.data?.res)
                console.log(questionData, 'qu**320');
            }

            setShowLoader(false);
        }
        getData();
    }, [checked]);
    const getQuestions = (qData) => {
        return (
            <>
                <span>Question: {qData.question}</span>
                <br />
                <span>Answer: {qData.answer}</span>
            </>
        )
    }

    return (
        <div>
            {
                <Grid container spacing={1} >
                    <Grid item xs={12} >
                        <Stack spacing={8} direction="row" sx={{ color: 'action.active' }}>
                            <TextField
                                style={{
                                    width: "50%"
                                }}
                                label="Set Name"
                                required
                                id="outlined-start-adornment"
                                value={formData.title}
                                onChange={handleChange}
                                name="title"
                                error={false}
                                helperText={"" !== "" ? 'Test Name is reuired' : ' '}
                                disabled={!readAndWriteAccess}
                            />
                            <Button variant="contained" style={{ height: 'max-content' }} disabled={formData.title === "" || selectedQuestionsList?.length === 0} onClick={() => oepnModalPopup()}>Add Test</Button>
                            <Badge color="secondary" badgeContent={selectedQuestionsList?.length}>
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
                        {/* {questionData?.length > 0 && <><p>Select All:</p><input disabled={!readAndWriteAccess} checked={allCheckBoxValue} value={allCheckBoxValue} onClick={() => onClickCheckBox()} type="checkbox" /></>} */}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                disabled={!readAndWriteAccess}
                                                checked={selectedQuestionsList?.length === questionData?.length}
                                                onClick={() => onClickCheckBox('selectAll')}
                                            />
                                        </TableCell>
                                        <TableCell>Question</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? questionData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : questionData
                                    )?.map((qData, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    disabled={!readAndWriteAccess}
                                                    checked={selectedQuestionsList.includes(qData.q_id)}
                                                    onClick={() => onClickCheckBox(qData.q_id, i)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {/* Render your question content here */}
                                                {getQuestions(qData)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>.
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 25, 50, 100, { label: 'All', value: -1 }]}
                                            colSpan={5}
                                            count={questionData?.length}
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
                                        // disabled={!readAndWriteAccess}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>

                        {/* {questionData?.length > 0 &&
                            questionData?.map((qData, i) => {
                                return (
                                    <div style={{ padding: '5px' }} key={i}>

                                        <div>
                                            <div>
                                                <Checkbox {...label}
                                                    disabled={!readAndWriteAccess}
                                                    checked={selectedQuestionsList.includes(qData.q_id)}
                                                    onClick={() => onClickCheckBox(qData.q_id, i)}
                                                />
                                            </div> */}
                        {/* <div><input style={{ cursor: "pointer" }} disabled={!readAndWriteAccess} checked={selectedQuestionsList.includes(qData.q_id)} onClick={() => onClickCheckBox(qData.q_id, i)} type="checkbox" /></div> */}

                        {/* <div style={{
                                                paddingTop: '5px',
                                                border: '1px solid blue'
                                            }}>
                                                {getQuestions(qData)}

                                            </div>
                                        </div>

                                    </div>)
                            })
                        } */}
                    </Grid>
                </Grid>}


            {openSnackBar && <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />}
            {showLoader &&
                <Loader />
            }

            <Modal
                open={openModal}
                onClose={onCloseMOdal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        You have selected {selectedQuestionsList?.length} questons...!
                    </Typography>

                    <Button variant="contained" disabled={!readAndWriteAccess} onClick={() => onCloseMOdal()}>close</Button> &nbsp;
                    <Button variant="contained" disabled={!readAndWriteAccess} onClick={() => addToTestHandler()}>Save</Button>
                </Box>
            </Modal>

        </div>
    )
}