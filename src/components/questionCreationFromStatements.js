import * as React from 'react'
import { useState } from 'react';
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import Loader from './Loader';
/**
 *
 * @returns table data
 */

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

export default function QuestionCreationFromStatements() {
    // const serverUrl = `http://localhost:8080/statements/`
    const serverUrl = securedLocalStorage.baseUrl + 'statements/'
    const [checked, setChecked] = useState([]);
    const [catagoryData, setCategoryData] = useState([]);
    const [statementsList, setStatementsList] = useState([])
    const [allCheckBoxValue, setAllCheckBoxValue] = useState(false);
    const [generatedData, setGeneratedData] = useState([]);
    const [showLoader, setShowLoader] = React.useState(false);
    const [showContent, setShowContent] = useState(true);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    React.useEffect(() => {
        async function fetchData() {
            // You can await here
            setShowLoader(true);
            const response = await api({ catIds: checked }, serverUrl + 'bycategory/list', 'post');
            setStatementsList(response.data);
            const catData = await api(null, securedLocalStorage.categoriesUrl, 'get');
            if (catData.status === 200) {
                setCategoryData(catData.data);
            }
            setShowLoader(false);
        }
        fetchData();
    }, []);
    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
    }, []);
    const renderFalseStatements = (falseList) => {
        return (<div>
            {falseList?.map((fl, i) => {
                return (
                    <div style={{background: fl?.IsActive === 6 ? 'yellow' : ''}}>
                        <input disabled={!readAndWriteAccess} checked={fl.checked} onClick={() => onClickCheckBox(fl, i, 2)} type="checkbox" />.
                    
                        <span>{fl.Statement}</span>
                    </div>
                )
            })}
        </div>)
    }
    const renderStatements = () => {
        return (<div>
            {statementsList?.map((qData, i) => {
                return (
                    <div style={{ padding: '5px' }}>

                        <div style={{ display: 'flex' }}>
                            <div>
                                <span>{qData.q_id}.</span>
                                <input disabled={!readAndWriteAccess} checked={qData.checked} onClick={() => onClickCheckBox(qData.q_id, i, 1)} type="checkbox" />
                            </div>
                            <div style={{
                                paddingTop: '5px',
                                border: '1px solid blue'
                            }}>

                                <span><b>Statements: </b><span style={{background: qData?.IsActive === 6 ? 'yellow' : ''}}>{qData.statement}</span></span> <br />
                                {/* <span>Answer: {qData.answer}</span> */}
                                <span><b>False Statements:</b> <br/> {renderFalseStatements(qData.falseList)}</span>
                            </div>
                        </div>
                    </div>)
            })
            }
        </div>)
    }
    React.useEffect(() => {
        async function fetchData() {
            setShowLoader(true);
            const response = await api({ catIds: checked }, serverUrl + 'bycategory/list', 'post');
            setStatementsList(response.data)
            if (response.status === 200) {
                setStatementsList([...response.data])
            } else {
                setStatementsList([])
            }
            setShowLoader(false);
        }
        fetchData();
    }, [checked]);
    const createQuestions = async () => {
        setShowLoader(true);
        const createResponse = await api(generatedData, serverUrl + 'create/questions', 'post');
        if (createResponse.status === 200) {
            const response = await api({ catIds: checked }, serverUrl + 'bycategory/list', 'post');
            setStatementsList(response.data)
            if (response.status === 200) {
                setStatementsList(response.data)
            }
            setGeneratedData([]);
            setShowContent(true);
            alert('Question Created successfully!');
        }
        setShowLoader(false);
    }
    const sliceIntoChunks=(arr, chunkSize)=> {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }
    const generateQuestions = async () => {
        let selectedStatements = [];
        statementsList.forEach(element=>{
            if(element?.checked){
                selectedStatements.push({id:element.StatementId, statement:element.statement, isTrueStatement: true})
            }
            if(element?.falseList?.length>0){
                element.falseList.forEach(falseElement=>{
                    if(falseElement?.checked){
                        selectedStatements.push({id:falseElement.id, statement: falseElement.statement, isTrueStatement: false})
                    }
                })
            }
        })
        let shuffleList = shuffle(JSON.parse(JSON.stringify(selectedStatements)));
        const splittedArrays = sliceIntoChunks(shuffleList, 2);
        let questionsList=[];
        for (let i = 0; i < splittedArrays.length; i++) {
            questionsList.push({questionData:splittedArrays[i]})
        }
        setShowContent(false);
            setGeneratedData([...questionsList]);
    }
    const shuffle=(sourceArray)=> {
        for (var i = 0; i < sourceArray.length - 1; i++) {
            var j = i + Math.floor(Math.random() * (sourceArray.length - i));
    
            var temp = sourceArray[j];
            sourceArray[j] = sourceArray[i];
            sourceArray[i] = temp;
        }
        return sourceArray;
      }
    const onClickCheckBox = (info, index, type) => {
        if(type===1){
            statementsList[index]['checked']=!statementsList[index]['checked'];
        } else if(type===2){
            const trueStatement = statementsList.find(s=>s.StatementId===info.StatementId);
            if(trueStatement && trueStatement['falseList'] && trueStatement['falseList']?.length>0){
                trueStatement['falseList'][index]['checked'] = !trueStatement['falseList'][index]['checked'];
              const trueStatementIndex =  statementsList.findIndex(si=>si.StatementId === info.StatementId);
              statementsList[trueStatementIndex] = trueStatement;
            }
        }
        setStatementsList([...statementsList]);
    }
    const onClickCheckBoxQuestion = (id, index) => {
        if (id && index >= 0) {
            setAllCheckBoxValue(false);
            generatedData[index]['checked'] = !generatedData[index]['checked'];
        } else {
            setAllCheckBoxValue(!allCheckBoxValue)
            generatedData.map(q => q.checked = !allCheckBoxValue)
        }
        setGeneratedData(generatedData);
    }
    const renderGeneratedData = () => {
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><span>
                                    <input disabled={!readAndWriteAccess} checked={allCheckBoxValue} value={allCheckBoxValue} onClick={() => onClickCheckBoxQuestion()} type="checkbox" />
                                </span></TableCell>
                                <TableCell align="center">Question Title</TableCell>
                                <TableCell align="center">Statements</TableCell>
                                <TableCell align="right">Answers</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? generatedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : generatedData
                            ).map((row, i) => (
                                <TableRow key={i}>
                                    {(row.questionData?.length ===2)&&
                                    <><><TableCell component="th" scope="row">
                                            <span>
                                                <input disabled={!readAndWriteAccess} checked={row.checked} value={row.checked} onClick={() => onClickCheckBoxQuestion(row.id, i)} type="checkbox" />
                                            </span>
                                        </TableCell><TableCell component="th" scope="row">
                                                Choose the correct statements
                                            </TableCell><TableCell component="th" scope="row">
                                                {(row.questionData?.length === 2) && row.questionData?.map((a, i) => { return (<><div>{i + 1}{')'}.<span>{a.statement}</span></div><br /></>); })}
                                            </TableCell>
                                        </><TableCell component="th" scope="row">
                                                {(row.questionData?.length === 2) && row.questionData?.map((a, i) => { return (<><div>{i + 1}{')'}.<span>{a.isTrueStatement ? 'true' : 'false'}</span></div><br /></>); })}
                                            </TableCell></>
                                            
                                   
                                }
                                </TableRow>
                            ))}


                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100, { label: 'All', value: -1 }]}
                                    colSpan={5}
                                    count={generatedData.length}
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
            </div>
        )
    }
    return (
        <>
            {<div>
                {!showContent && <div style={{ height: '30rem', overflow: 'auto', width: '65%', float: 'left', paddingLeft: '5%', marginTop: '5%' }}>
                    {generatedData && generatedData.length > 0 && renderGeneratedData()}
                </div>}
                <div style={{textAlign:'right'}}>
                    
                {showContent && <Button variant="contained"  onClick={() => generateQuestions()}>Generate Questions</Button>}
                {!showContent && (generatedData.length > 0) && <Button variant="contained" onClick={() => createQuestions()}>Create Questions</Button>}

                </div>
                {showContent && <div style={{ height: '30rem', overflow: 'auto', width: '65%', float: 'left', paddingLeft: '5%', marginTop: '5%' }}>
                    {statementsList && statementsList.length > 0 && renderStatements()}
                </div>}
                <div style={{ height: '30rem', width: '20%', float: 'right', paddingRight: '5%', overflow: 'auto', paddingTop: '5%' }}>
                   
                    {showContent && catagoryData?.length > 0 && <CheckboxTree
                        nodes={catagoryData}
                        checked={checked}
                        onCheck={checked => setChecked(checked)}
                        disabled={!readAndWriteAccess}
                    //   onClick={(e) => onClickCheckBox(e)}
                    />}
                </div>
                {showLoader &&
                <Loader />
            }
            </div>}
        </>
    )
}