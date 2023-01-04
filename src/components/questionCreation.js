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

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import TextareaAutosize from '@mui/base/TextareaAutosize';

import api from '../services/api';
import './common.css';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TextField } from '@mui/material';

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

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
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

export default function CustomPaginationActionsTable() {
    // const serverUrl = `http://localhost:8080/question/`
    const serverUrl = `http://3.111.29.120:8080/question/`
    const [questionData, setQuestionData] = React.useState([]);
    const [titlesList, setTitlesList] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedTitle, setSelectedTitle] = React.useState("");
    const [titleOptionsList, setTitleOptionsList] = React.useState("");
    const [selectedTitleOption, setSelectedTitleOption] = React.useState("");
    const [inputOptionValue, setInputOptionValue] = React.useState("");
    const [inputOptionNumber, setInputOptionNumber] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    const [selectedOptions, setSelectedOptions] = React.useState([]);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [selectedRow, setSelectedRow] = React.useState(null)

    const [showForm, setShowForm] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [questionValue, setQuestionValue] = React.useState("");
    React.useEffect(() => {
        async function fetchData() {
            // You can await here  
            const data = await api(null, serverUrl + 'get/data', 'get');
            const titleData = await api(null, serverUrl + 'get/titles', 'get');
            if (titleData.status === 200) {
                setTitlesList(titleData.data?.res)
            }
            if (data.status === 200) {
                setQuestionData(data.data?.res)
            }
        }
        fetchData();
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
    const SetOption = (row, i) => {
        const isExistOption = selectedOptions.find(so => so.inputOptionNumber === inputOptionNumber);
        const isExistValue = selectedOptions.find(so => so.inputOptionValue === inputOptionValue);

        if ((inputOptionNumber < 2) || (inputOptionNumber > 4)) {
            alert('please start selecting between Option 2 and Option 4')
        } else if (isExistOption) {
            alert('Option ' + inputOptionNumber + ' is already added');
        } else if (isExistValue) {
            alert('This value already configured to another Option')
        } else if (selectedOptions && selectedOptions.length <= 3) {
            if (!row.isChecked) {
                if (!inputOptionValue) {
                    alert('please select the option value for ' + inputOptionNumber)
                } else {
                    selectedOptions.push({ inputOptionNumber: inputOptionNumber, inputOptionValue: inputOptionValue });

                    setSelectedTitle("");
                    setTitleOptionsList([]);
                    setSelectedTitleOption("");
                    setInputOptionValue("");
                    setInputOptionNumber("");
                    setSelectedOptions([...selectedOptions]);
                }
            }
            if (row.isChecked) {
                const optionValue = titleOptionsList.find(to => to.OptionListId === selectedTitleOption)?.OptionNames;
                if (!optionValue) {
                    alert('please select the option value for ' + inputOptionNumber)

                } else {
                    selectedOptions.push({ inputOptionNumber: inputOptionNumber, inputOptionValue: optionValue });

                    setSelectedTitle("");
                    setTitleOptionsList([]);
                    setSelectedTitleOption("");
                    setInputOptionValue("");
                    setInputOptionNumber("");
                    setSelectedOptions([...selectedOptions]);
                }
            }
        } else {
            alert("Maximum options generated!, please Create question");
        }
    }
    const onCloseHandler = () => {
        setSelectedTitle("");
        setTitleOptionsList([]);
        setSelectedTitleOption("");
        setInputOptionValue("");
        setInputOptionNumber("");
        setSelectedOptions([]);
        setOpen(false);
    }
    /**
     * 
     * @param {modal PopUp} event 
     * @param {*} i 
     */
    const openModal = (i) => {
        setOpen(true);
        setSelectedIndex(i)
    }
    const createQuestion = async (row) => {
        if (selectedOptions && selectedOptions?.length < 3) {
            alert('Please select minimum 3 options')
        } else {
            const response = await api({ bitBankObj: row, selectedOptions }, serverUrl + 'create/question', 'post');
            if (response.status === 200) {
                alert('Question Created Succesfully!');
                setSelectedTitle("");
                setTitleOptionsList([]);
                setSelectedTitleOption("");
                setInputOptionValue("");
                setInputOptionNumber("");
                setSelectedOptions([]);
                setOpen(false);
                const data = await api(null, serverUrl + 'get/data', 'get');
                if (data.status === 200) {
                    setQuestionData(data.data?.res)
                }
            }
        }
    }
    const renderModal = () => {
        return (
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    // onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500000000000000000,
                        invisible: true
                    }}
                >
                    {/* <Fade in={open}> */}

                    <Box sx={style}>
                        {selectedOptions?.length > 0 && <div className='selected-options'>
                            {selectedOptions && selectedOptions.map((so, i) => {
                                return (<><span>Option{so.inputOptionNumber}: <b>{so.inputOptionValue}</b></span> <br /></>)
                            })}
                        </div>}
                        {allotOptions(selectedRow, selectedIndex)}
                        {getOptionNumberInputBox(selectedRow, selectedIndex)}
                        <br />
                        {!selectedRow.isChecked && getInputBox(selectedRow, selectedIndex)}
                        <br />
                        {selectedRow.isChecked && getTitles(selectedRow, selectedIndex)}
                        <br />

                        {(selectedTitle && titleOptionsList) && getTitleOptions(selectedRow, selectedIndex)}

                        <Button onClick={() => SetOption(selectedRow, selectedIndex)}>Set Option</Button> <br />
                        <Button onClick={() => createQuestion(selectedRow, selectedIndex)}>Create Question</Button>
                        <br />
                        <Button onClick={() => onCloseHandler()}>close</Button>

                    </Box>
                    {/* </Fade> */}
                </Modal>
            </div>
        );

    }
    const onChangeTitle = async (value, row, i) => {
        setSelectedTitle(value)
        if (value) {
            const titleOptionData = await api(null, serverUrl + 'get/title/options/' + value, 'get');
            if (titleOptionData.status === 200) {
                setTitleOptionsList(titleOptionData.data?.res)
            }
        }
    };
    const getTitles = (row, i) => {
        return (<div>
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedTitle}
                onChange={(e) => onChangeTitle(e?.target?.value)}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {titlesList.map((tl) => { return (<MenuItem value={tl.OptionTitleId}>{tl.Title}</MenuItem>) })}
            </Select>
        </div>)
    }
    const getTitleOptions = (row, i) => {
        return (<div>
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedTitleOption}
                onChange={(e) => setSelectedTitleOption(e?.target?.value)}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {titleOptionsList?.map((tl) => { return (<MenuItem value={tl.OptionListId}>{tl.OptionNames}</MenuItem>) })}
            </Select>
        </div>)
    }
    const checkBoxHandler = (row, i) => {
        questionData[i].isChecked = !questionData[i].isChecked;
        setQuestionData([...questionData]);
        setSelectedTitle("");
        setTitleOptionsList([]);
        setSelectedTitleOption("");
        setInputOptionValue("");
        setInputOptionNumber("");
    }
    const allotOptions = (row, i) => {
        return (<div>Titles:<input type="checkbox" checked={row?.isChecked} onClick={() => checkBoxHandler(row, i)} /></div>)
    }
    const getInputBox = (row, i) => {
        return (<div>Option Value &nbsp;&nbsp;<input type="text" value={inputOptionValue} onChange={(e) => setInputOptionValue(e.target?.value)} /></div>)
    }
    const getOptionNumberInputBox = (row, i) => {
        return (<div>Option Number &nbsp;&nbsp;<input type="text" value={inputOptionNumber} onChange={(e) => setInputOptionNumber(e.target?.value)} /></div>)
    }
    const openModalHandler = (row, i) => {
        setOpen(true);
        setSelectedIndex(i);
        row.isChecked = false;
        setSelectedRow(row);
    }
    const onClickAddOptions = () => {
        if (options.length === 4) {
            alert("You can choose maximum four options only!")
        } else {
            options.push({ checked: false, value: '', label: '' });
            setOptions([...options]);
        }
    }
    function BpRadio(props) {
        return (
            <Radio
                disableRipple
                color="default"
                checkedIcon={<BpCheckedIcon />}
                icon={<BpIcon />}
                {...props}
            />
        );
    }
    const onClickRadio = (i) => {
        options.map(op => op.checked = false);
        options[i].checked = true;
        setOptions([...options])
    }
    const onChangeOption = (i, value) => {
        options[i].value = value;
        setOptions([...options])

    }
    const onClickAddQuestion = async () => {
        if (!questionValue) {
            alert('Please enter question value');
        } else if (options?.length < 4) {
            alert('Please provide 4 options');
        } else {
            const response = await api({ title: questionValue, options }, serverUrl + 'create/question/manual', 'post');
            if (response.status === 200) {
                alert(`${questionValue} added succesfully`);
                setQuestionValue('');
                setOptions([]);
                setShowForm(false);
            } else {
                alert(`Something wenr wrong!`)
            }
        }
    }
    return (
        <div>
            <div style={{ paddingBottom: '20px', textAlign: 'end' }}>
                <Button variant="contained" onClick={() => setShowForm(!showForm)}>Add New Question</Button>

            </div>
            {!showForm && questionData?.length > 0 && <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align="center">Question Title</TableCell>
                                <TableCell align="center">Option1</TableCell>
                                {/* <TableCell align="right">Option2</TableCell>
                                <TableCell align="right">Option3</TableCell>
                                <TableCell align="right">Option4</TableCell>
                                <TableCell align="right">Option5</TableCell> */}
                                <TableCell align="right">Apply Options</TableCell>
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
                                        {row.B_QUESTION}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.B_Q_ANS}
                                    </TableCell>
                                    {/* <TableCell style={{ width: 160 }} align="right">
                                        {row?.option2}
                                   </TableCell> */}
                                    {/* <TableCell style={{ width: 160 }} align="right">
                                    {row?.option3}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                  {row.option4}
                                   </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                  {row?.option5}
                                  </TableCell> */}
                                    <TableCell style={{ width: 160 }} align="right">
                                        {/* <Button variant='primary' onClick={()=>setOpen(true)}>Create Question</Button> */}

                                        <Button onClick={() => openModalHandler(row, i)}>Create Question</Button>
                                        {open && renderModal()}
                                        {/* {allotOptions(row, i)}
                                    { getOptionNumberInputBox(row, i)}
                                    <br />
                                    {!row.isChecked && getInputBox(row, i)}
                                    <br />
                                    {row.isChecked && getTitles(row, i)}
                                    <br />
                                   
                                    {(row.isChecked && row.selectedTitle && titleOptionsList) && getTitleOptions(row, i)} */}

                                        {/* {!row.option2 && !row.option3 && !row.option4 && !row.option5 && allotOptions(row, i)}
                                        {!row.isChecked &&!row.option2 && !row.option3 && !row.option4 && !row.option5 && getOptionNumberInputBox(row, i)}
                                        {!row.isChecked &&!row.option2 && !row.option3 && !row.option4 && !row.option5 && getInputBox(row, i)}
                                         {!(row.option2 && row.option3 && row.option4 && row.option5) && getTitles(row, i)} 
                                        {(!row.option2 && row.isChecked && row.selectedTitle && titleOptionsList) && getTitleOptions(row, i)}
                                        {(!row.option2 && row.isChecked && row.selectedTitle && row.selectedTitleOption) && getSetButton(row, i)} */}

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
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>}
            {questionData?.length === 0 && <div>
                <p>No Questions available</p>
            </div>}
            {showForm && <div>
                <TextareaAutosize
                    value={questionValue}
                    onChange={(e) => setQuestionValue(e.target?.value)}
                    aria-label="Question"
                    placeholder="Create a Question"
                    style={{ width: 500, height: 100 }}
                />
                <div style={{ textAlign: 'center' }}>
                    <Button onClick={() => onClickAddOptions()} variant="contained">Add options</Button>

                </div>
                {options?.length > 0 && <div>
                    <RadioGroup
                        defaultValue="female"
                        aria-labelledby="demo-customized-radios"
                        name="customized-radios"
                        sx={{ display: 'inline' }}
                    >
                        {options?.map((op, i) => {
                            return (<><FormControlLabel value={op.value} onClick={() => onClickRadio(i)} control={<BpRadio />} />
                                <TextField placeholder='option1' sx={{ paddingBottom: '20px' }} onChange={(e) => onChangeOption(i, e.target?.value)} value={op.value} /> <br /></>)
                        })}
                    </RadioGroup>
                    <div style={{ paddingTop: '20px' }}>
                        <Button onClick={() => onClickAddQuestion()} variant="contained">Add Question</Button>
                    </div>
                </div>

                }
            </div>
            }
        </div>
    );
}
