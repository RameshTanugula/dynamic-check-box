import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as securedLocalStorage from "./SecureLocalaStorage";
import jwt_decode from "jwt-decode";
import * as CheckAccess from "./CheckAccess";
import api from '../services/api';
import './common.css';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

/**
 * add manual question starts
 */
const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: '50%',
    width: 16,
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
/**
 * add manual question ends
 */
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

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function Questions() {
    // const serverUrl = `http://localhost:8080/question/`
    const serverUrl = securedLocalStorage.baseUrl + 'question/'
    const [questionData, setQuestionData] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [from, setFrom] = React.useState(null);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [to, setTo] = React.useState(null);
    const [users, setUsers] = React.useState([]);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);

    React.useEffect(() => {
        async function fetchData() {
            const userData = await api(null, securedLocalStorage.allActiveUsersUrl, 'get');
            if (userData.status === 200) {
                setUsers(userData.data)
            }
            const data = await api(null, serverUrl + 'get/data/' + from + '/' + to, 'get');
            if (data.status === 200) {
                setSelectedUser(null);
                setQuestionData(data.data?.res)
            }
        }
        fetchData()
    }, [])

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
    }, []);
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questionData.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const onClickCheckBox = (index) => {
        questionData[index]['checked'] = !questionData[index]['checked'];
        setQuestionData([...questionData]);
    }
    const getQuestions = async () => {
        const qData = await api(null, serverUrl + 'get/data/' + from + '/' + to, 'get');
        if (qData.status === 200) {
            setSelectedUser(null);
            setQuestionData(qData.data?.res);
        }
    }
    const getQuestionsByUser = async (value) => {
        setSelectedUser(value);
        const qData = await api(null, serverUrl + 'get/data/by/user/' + value, 'get');
        if (qData.status === 200) {
            setQuestionData(qData.data?.res);
        }
    }
    const handleQuestions = async (status) => {
        const selectedIds = questionData?.filter(q => q.checked)?.map(qq => qq.QuestionId);
        const data = await api({ selectedIds: selectedIds, type: 'questions', status }, serverUrl + 'status/change', 'post');

        if (data.status === 200) {
            getQuestionsByUser(selectedUser);
        }
    }
    return (
        <div>
            <div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <TextField disabled={!readAndWriteAccess} placeholder='From' sx={{ paddingBottom: '20px' }} onChange={(e) => setFrom(e.target.value)} value={from} />
                &nbsp;&nbsp;&nbsp;&nbsp;<TextField placeholder='To' sx={{ paddingBottom: '20px' }} onChange={(e) => setTo(e.target.value)} value={to} />
                &nbsp;&nbsp;<Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedUser}
                    onChange={(e) => getQuestionsByUser(e.target.value)}
                    disabled={!readAndWriteAccess}
                >
                    <MenuItem value="">Select User</MenuItem>
                    {users.map((tl) => { return (<MenuItem value={tl.id}>{tl.first_name} {tl.last_name}</MenuItem>) })}
                </Select>
                &nbsp;&nbsp;{<Button disabled={!readAndWriteAccess} variant="contained" onClick={() => { getQuestions() }}>Get Questions</Button>}
                <br />
                &nbsp;&nbsp;{questionData?.filter(q => q.checked)?.length > 0 &&
                    <Button disabled={!readAndWriteAccess} variant="contained" sx={{ marginBottom: '1rem' }} onClick={() => handleQuestions('1')}>Accept Questions</Button>
                }
                &nbsp;&nbsp;{questionData?.filter(q => q.checked)?.length > 0 &&
                    <Button disabled={!readAndWriteAccess} variant="contained" sx={{ marginBottom: '1rem' }} onClick={() => handleQuestions('3')}>Reject Questions</Button>
                }
                &nbsp;&nbsp;{questionData?.filter(q => q.checked)?.length > 0 &&
                    <Button disabled={!readAndWriteAccess} variant="contained" sx={{ marginBottom: '1rem' }} onClick={() => handleQuestions('2')}>Edit Questions</Button>
                }
                {selectedUser && <div><b>No.of Questions:</b>{questionData?.length}</div>}
            </div>
            {questionData?.length > 0 && <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align="center">Question Title</TableCell>
                                <TableCell align="center">Action</TableCell>
                                <TableCell align="center">Option1</TableCell>
                                <TableCell align="center">Option2</TableCell>
                                <TableCell align="center">Option3</TableCell>
                                <TableCell align="center">Option4</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? questionData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : questionData
                            ).map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <input disabled={!readAndWriteAccess} checked={row.checked} onClick={() => onClickCheckBox(i)} type="checkbox" />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.QuestionTitle && row.QuestionTitle}
                                        {row.QUrls && <img style={{
                                            height: '10rem',
                                            width: 'auto'
                                        }} src={row.QUrls} />}
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
                                        {/* <div >
                                            <br />{row.part_a && row.part_b &&
                                                <div style={{ width: "100%" }}>
                                                    <span className='mcq1-left'> {row.part_a.split(',')[1]} </span>
                                                    <span className='mcq1-right'>  &nbsp;&nbsp;&nbsp;&nbsp; {row.part_b?.split(',')[1]} </span>
                                                </div>}
                                        </div> */}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.type === 'MCQ1' ? row.Option1?.split(',')?.map((o, i) => {
                                            return (
                                                <>
                                                    <span>{i + 1}</span>-<span>{parseInt(o) + 1}</span><br />
                                                </>
                                            )
                                        }) : row.Option1}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.type === 'MCQ1' ? row.Option2?.split(',')?.map((o, i) => {
                                            return (
                                                <>
                                                    <span>{i + 1}</span>-<span>{parseInt(o) + 1}</span><br />
                                                </>
                                            )
                                        }) : row.Option2}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.type === 'MCQ1' ? row.Option3?.split(',')?.map((o, i) => {
                                            return (
                                                <>
                                                    <span>{i + 1}</span>-<span>{parseInt(o) + 1}</span><br />
                                                </>
                                            )
                                        }) : row.Option3}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.type === 'MCQ1' ? row.Option4?.split(',')?.map((o, i) => {
                                            return (
                                                <>
                                                    <span>{i + 1}</span>-<span>{parseInt(o) + 1}</span><br />
                                                </>
                                            )
                                        }) : row.Option4}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100, { label: 'All', value: -1 }]}
                                    colSpan={5}
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
                                    disabled={!readAndWriteAccess}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>}
            {questionData?.length === 0 && <div>
                <p>No Questions available</p>
            </div>}
        </div>
    );
}
