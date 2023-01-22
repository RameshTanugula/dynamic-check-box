import * as React from 'react';
import CheckboxTree from 'react-dynamic-checkbox-tree';
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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

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

export default function QuestionCreation() {
    // const serverUrl = `http://localhost:8080/question/`
    const serverUrl = `http://3.111.29.120:8080/question/`
    const [questionData, setQuestionData] = React.useState([]);
    const [titlesList, setTitlesList] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedTitle, setSelectedTitle] = React.useState("");
    const [titleOptionsList, setTitleOptionsList] = React.useState("");
    const [inputOptionValue1, setInputOptionValue1] = React.useState("");
    const [inputOptionValue2, setInputOptionValue2] = React.useState("");
    const [inputOptionValue3, setInputOptionValue3] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    const [selectedOptions, setSelectedOptions] = React.useState([]);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [selectedRow, setSelectedRow] = React.useState(null)

    const [showForm, setShowForm] = React.useState(false);
    const [checked, setChecked] = React.useState([]);
    const [showTree, setShowTree] = React.useState(true)
    const [options, setOptions] = React.useState([]);
    const [questionValue, setQuestionValue] = React.useState("");
    const [selectedFile, setSelectedFile] = React.useState([]);
    const [previewImgSrc, setPreviewImgSrc] = React.useState(null);
    const [selectedTitles, setSelectedTitles] = React.useState([]);
    const [solutionValue, setSolutionValue] = React.useState("");
    const [categoryData, setCategoryData] = React.useState([]);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedTitles(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    React.useEffect(() => {
        async function fetchData() {
            const data = await api({ catIds: checked }, serverUrl + 'get/data', 'post');

            if (data.status === 200) {
                setQuestionData(data.data?.res)
            }
        }
        fetchData()
    }, [showTree])
    React.useEffect(() => {
        async function fetchData() {
            // You can await here  
            const catData = await api(null, 'http://3.111.29.120:8080/get/categories', 'get');
            if (catData.status === 200) {
                setCategoryData(catData.data);
            }
            // const data = await api(checked, serverUrl + 'get/data', 'post');
            const titleData = await api(null, serverUrl + 'get/titles', 'get');
            if (titleData.status === 200) {
                setTitlesList(titleData.data?.res)
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
        let isHavingOptions = true;
        if (row.isChecked) {
            if (selectedTitles?.length !== 3) {
                isHavingOptions = false;
                alert("Please choose 3 options");
            }
        }
        if (!row.isChecked) {
            if (!inputOptionValue1 || !inputOptionValue2 || !inputOptionValue3) {
                isHavingOptions = false;
                alert('Please choose options')
            } else if (inputOptionValue1 == inputOptionValue2 == inputOptionValue3) {
                alert('Inputs should be different')
            }
        }
        if (isHavingOptions) {
            let selectedList = [];
            if (row.isChecked) {
                selectedList = selectedTitles;
                setSelectedOptions([...selectedTitles]);
                // selectedOptions.push({ inputOptionNumber: inputOptionNumber, inputOptionValue: inputOptionValue });
            } else {

                selectedList = [inputOptionValue1, inputOptionValue2, inputOptionValue3];
            }
            setInputOptionValue1("");
            setInputOptionValue2("");
            setInputOptionValue3("");
            setSelectedTitles([]);
            setSelectedOptions([...selectedList]);
        }

    }
    const onCloseHandler = () => {
        setSelectedTitle("");
        setTitleOptionsList([]);
        setSelectedTitles([])
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
                setSelectedTitles([])
                setSelectedOptions([]);
                setOpen(false);
                const data = await api({ catIds: checked }, serverUrl + 'get/data', 'post');
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
                                return (<><span>Option{i + 1}: <b>{so}</b></span> <br /></>)
                            })}
                        </div>}
                        {allotOptions(selectedRow, selectedIndex)}
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
        setSelectedTitles([]);
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
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedTitles}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >

                    {titleOptionsList && titleOptionsList.map((name) => (
                        <MenuItem key={name.OptionNames} value={name.OptionNames}>
                            <Checkbox checked={selectedTitles.indexOf(name.OptionNames) > -1} />
                            <ListItemText primary={name.OptionNames} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>)
    }
    const checkBoxHandler = (row, i) => {
        questionData[i].isChecked = !questionData[i].isChecked;
        setQuestionData([...questionData]);
        setSelectedTitle("");
        setSelectedTitles([]);
        setInputOptionValue1("")
        setInputOptionValue2("")
        setInputOptionValue3("")
        setTitleOptionsList([]);
    }
    const allotOptions = (row, i) => {
        return (<div>Titles:<input type="checkbox" checked={row?.isChecked} onClick={() => checkBoxHandler(row, i)} /></div>)
    }
    const getInputBox = (row, i) => {
        return (<div>
            <span>Option Value 1 &nbsp;&nbsp;<input type="text" value={inputOptionValue1} onChange={(e) => setInputOptionValue1(e.target?.value)} /></span><br />
            <span>Option Value 2 &nbsp;&nbsp;<input type="text" value={inputOptionValue2} onChange={(e) => setInputOptionValue2(e.target?.value)} /></span><br />
            <span>Option Value 3 &nbsp;&nbsp;<input type="text" value={inputOptionValue3} onChange={(e) => setInputOptionValue3(e.target?.value)} /></span><br />
        </div>)
    }
    const openModalHandler = (row, i) => {
        setOpen(true);
        setSelectedIndex(i);
        row.isChecked = false;
        setSelectedRow(row);
    }
    const onFileChange = event => {
        var file = event.target.files[0];
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);

        reader.onloadend = function (e) {
            setPreviewImgSrc([reader.result]);

        }
        setSelectedFile(event.target.files);
    };
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
    const validateOptions = () => {
        for (let i = 0; i < options.length; i++) {
            if (!options[i].value) {
                return false;
            }
        }
        return true;
    }
    const onClickAddQuestion = async () => {
        const isOptSelected = options.find(o => o.checked);
        if (!questionValue && (selectedFile.length === 0)) {
            alert('Please enter question value or choose an image');
        } else if (options?.length < 4) {
            alert('Please provide 4 options');
        } else if (!validateOptions()) {
            alert('Please enter option value');
        } else if (!isOptSelected) {
            alert('Please select correct answer');
        } else {
            const formData = new FormData();
            if (selectedFile && selectedFile.length > 0) {
                formData.append(
                    "files", selectedFile[0],
                );
            }
            formData.append("title", questionValue);
            formData.append("solution", solutionValue);
            formData.append("options", JSON.stringify(options));

            const response = await api(formData, serverUrl + 'create/question/manual', 'post');
            if (response.status === 200) {
                alert(`${questionValue} added succesfully`);
                setQuestionValue('');
                setOptions([]);
                setShowForm(false);
                setSelectedFile([]);
                setPreviewImgSrc("")
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
            {showTree && <div >
                {categoryData?.length > 0 && <CheckboxTree
                    // nodes={treeViewData}
                    nodes={categoryData}
                    checked={checked}
                    onCheck={checked => setChecked(checked)}
                //   onClick={(e) => onClickCheckBox(e)}
                />}
                <Button variant="contained" onClick={() => setShowTree(!showTree)}>Get Questions</Button>

            </div>
            }
            {!showForm && !showTree && questionData?.length > 0 && <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align="center">Question Title</TableCell>
                                <TableCell align="center">Option1</TableCell>
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
                                    <TableCell style={{ width: 160 }} align="right">
                                        <Button onClick={() => openModalHandler(row, i)}>Create Question</Button>
                                        {open && renderModal()}
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
            {!showTree && questionData?.length === 0 && <div>
                <p>No Questions available</p>
            </div>}
            {showForm && !showTree && <div>
                <TextareaAutosize
                    value={questionValue}
                    onChange={(e) => setQuestionValue(e.target?.value)}
                    aria-label="Question"
                    placeholder="Create a Question"
                    style={{ width: 500, height: 100 }}
                />
                <div style={{ paddingTop: '2rem' }}>
                    <input type="file" onChange={onFileChange} />

                </div>
                <div>
                    <img src={previewImgSrc} style={{ width: '40%', paddingTop: '15px' }} />
                </div>
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
                    {options?.length === 4 && <TextareaAutosize
                        value={solutionValue}
                        onChange={(e) => setSolutionValue(e.target?.value)}
                        aria-label="Question"
                        placeholder="Explain the answer"
                        style={{ width: 500, height: 100 }}
                    />}
                    <div style={{ paddingTop: '20px' }}>
                        <Button onClick={() => onClickAddQuestion()} variant="contained">Add Question</Button>
                    </div>
                </div>

                }
            </div>
            }
            {!showTree &&
                <Button sx={{ marginTop: '1rem' }} variant="contained" onClick={() => setShowTree(!showTree)}>Back to Filters</Button>

            }
        </div>
    );
}
