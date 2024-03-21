import * as React from 'react'
import api from '../services/api';
import './flashCard.css';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import * as securedLocalStorage from "./SecureLocalaStorage";
/**
 *
 * @returns table
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
import * as CheckAccess from "./CheckAccess";
import Loader from './Loader';

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

export default function CreatePairs() {
    // const serverUrl = `http://localhost:8080/pairs/`;
    const serverUrl = securedLocalStorage.baseUrl + 'pairs/';
    const initTypes = [{ value: 'bitbank', label: 'BitBank' },
    { value: 'statements', label: 'Statements' }];
    const [data, setData] = React.useState([]);
    const [usersList, setUsersList] = React.useState([]);
    const [typeList, setTypeList] = React.useState([...initTypes]);
    const [type, setType] = React.useState(initTypes[0].value);
    const [part_a, setPart_a] = React.useState("");
    const [part_b, setPart_b] = React.useState("");
    const [pairList, setPairList] = React.useState([]);
    const [pairsData, setPairsData] = React.useState([]);
    const [selectedId, setSelectedId] = React.useState("");
    const [tags, setTags] = React.useState("");
    const [showTable, setShowTable] = React.useState(false);
    const [from, setFrom] = React.useState(null);
    const [to, setTo] = React.useState(null);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);


    /**
     * table
     */

    const [page, setPage] = React.useState(0);
    const [user, setUser] = React.useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [showLoader, setShowLoader] = React.useState(false);

    const [allCheckBoxValue, setAllCheckBoxValue] = React.useState(false);
    React.useEffect(() => {
        async function fetchData() {
            setShowLoader(true)
            const userRes = await api(null, securedLocalStorage.usersUrl + type, 'get');
            if (userRes.status === 200) {
                setUsersList(userRes.data.res);
                if (userRes?.data?.res[0]?.user && type) {
                    setUser(userRes?.data?.res[0]?.user);
                    setShowLoader(true)
                    const response = await api(null, serverUrl + 'get/list/' + userRes?.data?.res[0]?.user + '/' + type + '/' + from + '/' + to, 'get');
                    if (response.status === 200) {
                        setData(response.data)
                    }
                }
            }
            setShowLoader(true)
            const pairsRes = await api(null, serverUrl + 'get/data', 'get');
            if (pairsRes.status === 200) {
                pairsRes.data.map(p => p.checked = false)
                setPairsData(pairsRes.data)
            }
            setShowLoader(false)

        }
        fetchData();
    }, [type]);

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const renderSelect = () => {
        return (
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={!readAndWriteAccess}
            >

                {typeList.map((tl) => { return (<MenuItem value={tl.value}>{tl.label}</MenuItem>) })}
            </Select>
        )
    }
    const onChangeUser = async (user) => {
        setUser(user);
        const response = await api(null, serverUrl + 'get/list/' + user + '/' + type + '/' + from + '/' + to, 'get');
        if (response.status === 200) {
            setData(response.data)
        }
    }
    const renderUsers = () => {
        return (
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={user}
                onChange={(e) => onChangeUser(e.target.value)}
                disabled={!readAndWriteAccess}
            >
                {usersList.map((tl) => { return (<MenuItem value={tl.user}>{tl.user}</MenuItem>) })}
            </Select>
        )
    }
    const getSelectionHandler = () => {
        const selection = window.getSelection()?.toString();
        if (part_a === "") {
            setPart_a(selection);
            setPart_b("");
        } else if (part_b === "") {
            setPart_b(selection)
        }
    };
    const onClickHandler = (d) => {
        setSelectedId(d.id);
        setTags(d.tags);
    }
    // const renderContent = () => {
    //     return (
    //         <div>
    //             {data.map(((d, i) => {
    //                 return (<div style={{ display: 'flex' }}>
    //                     <span style={{ paddingRight: '1rem', paddingTop: '1rem' }}>    <input disabled={!readAndWriteAccess} checked={d.checked} value={d.checked} onClick={() => onClickPairCheckBox(i)} type="checkbox" />
    //                     </span>
    //                     <span disabled={!readAndWriteAccess} onClick={() => onClickHandler(d)} style={{ display: 'flex' }}>

    //                         <p style={{ "fontWeight": "bold" }}>{d.id}:</p>&nbsp;<p>{d.question} &nbsp;</p> <p> -&nbsp;{d.answer}</p></span></div>)
    //             }))}
    //         </div>
    //     )
    // }

    const renderContent = () => {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <span>
                                Action
                                </span>
                            </TableCell>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Question</TableCell>
                            <TableCell align="center">Answer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {(rowsPerPage > 0
                                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : data
                            ).map((d, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <span>
                                        <input disabled={!readAndWriteAccess} checked={d.checked} value={d.checked} onClick={() => onClickPairCheckBox(i)} type="checkbox" />
                                    </span>
                                </TableCell>
                                <TableCell>{d.id}</TableCell>
                                <TableCell>{d.question}</TableCell>
                                <TableCell>{d.answer}</TableCell>
                               
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100, 1000, { label: 'All', value: -1 }]}
                            colSpan={5}
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'Rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>

                </Table>
            </TableContainer>
        );
    };
    


    const renderPairContent = () => {
        return (
            <div>
                <span><TextField disabled={!readAndWriteAccess} label="Part A" value={part_a} /> <TextField disabled={!readAndWriteAccess} label="Part B" value={part_b} /></span>
            </div>
        )
    }
    const addToPairBox = () => {
        if (!(part_a && part_b)) {
            alert('please select the values');
        } else {
            pairList.push({ part_a: part_a, part_b: part_b, selectedId: selectedId, type: type, tags: tags });
            setSelectedId("");
            setPart_a("");
            setPart_b("");
            setTags("");
            setPairList([...pairList]);
        }
    }
    const removeRow = (id) => {
        const tmpList = pairList.filter(pl => pl.selectedId !== id);
        setPairList([...tmpList])
    }
    const getPairedContent = () => {
        return (
            <><table>
                <tr>
                    <th>S.No.</th>
                    <th>Id</th>
                    <th>Part A</th>
                    <th>Part B</th>
                    <th>Delete</th>
                </tr>
                {pairList?.map((p, i) => {
                    return (<tr>
                        <td>{i + 1}.</td>
                        <td>{p.selectedId}</td>
                        <td>{p.part_a}</td>
                        <td>{p.part_b}</td>
                        <td><Button sx={{ height: '1.5rem', width: '2rem', marginTop: '1rem' }} variant="outlined" onClick={() => removeRow(p.selectedId)}>Delete</Button>
                        </td>
                    </tr>)
                })
                }

            </table>
                <Button sx={{ marginTop: "1.5rem" }} variant="contained" onClick={savePairs}>
                    Save Pairs
                </Button>
            </>
        )
    }
    const onClickPairCheckBox = (i) => {
        const Index = page * rowsPerPage + i;

        data[Index].checked = !data[Index].checked;
        setData([...data]);
    }
    const onClickCheckBox = (id, index) => {
        if (id && index >= 0) {
            setAllCheckBoxValue(false);
            pairsData[index]['checked'] = !pairsData[index]['checked'];
        } else {
            setAllCheckBoxValue(!allCheckBoxValue)
            pairsData.map(p => p.checked = !allCheckBoxValue)
        }
        setPairsData([...pairsData]);
    }
    const createGroup = async () => {
        const selectedIds = pairsData.filter(p => p.checked)?.map(pm => pm.id);
        setShowLoader(true)
        const postResponse = await api(selectedIds, serverUrl + 'save/groups', 'post');

        if (postResponse.status === 200) {
            setShowLoader(true)
            const getRes = await api(null, serverUrl + 'get/data', 'get');
            if (getRes.status === 200) {
                setPairsData(getRes.data);
            }
            alert('Pair Group Created Successfully!');
        }setShowLoader(false)
    }
    const handleDelete = (id) => {
        // Perform the deletion logic, either in state or by making an API call.
        const updatedPairsData = pairsData.filter(row => row.id !== id);
        // const updatedPairsData = pairsData.filter((row) => row.id !== id);
        setPairsData(updatedPairsData);
      };
    const renderTable = () => {
        return (
            <>
                <div style={{ float: 'right', paddingBottom: '2rem' }}>
                    <Stack spacing={2} direction="row" sx={{ textAlign: 'right' }}>
                        {pairsData.filter(pp => pp.checked)?.length > 0 &&
                            <Button disabled={!readAndWriteAccess} variant="contained" onClick={createGroup}>Create as a Group</Button>}
                        <Button disabled={!readAndWriteAccess} variant="contained" sx={{ paddingLeft: '2rem' }} onClick={() => setShowTable(false)}>Back To Screen</Button>
                    </Stack>
                </div><TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <input disabled={!readAndWriteAccess} checked={allCheckBoxValue} value={allCheckBoxValue} onClick={() => onClickCheckBox()} type="checkbox" />
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Part A</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Part B</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? pairsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : pairsData
                            ).map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                        <input disabled={!readAndWriteAccess} checked={row.checked} onClick={() => onClickCheckBox(row.id, i)} type="checkbox" />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.parts_a}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.parts_b}
                                    </TableCell>
                                    <TableCell onClick={() => handleDelete(row.id)}>Delete</TableCell>

                                </TableRow>
                            ))}


                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100, 1000,  { label: 'All', value: -1 }]}
                                    colSpan={5}
                                    count={pairsData.length}
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
                </TableContainer></>)
    }
    const savePairs = async () => {
        if (pairList && pairList.length > 0) {
            const response = await api(pairList, serverUrl + 'save', 'post');
            if (response.status === 200) {
                const responseList = await api(null, serverUrl + 'get/list/' + user + '/' + type + '/' + from + '/' + to, 'get');
                if (responseList.status === 200) {
                    setData(responseList.data)
                }
                setPairList([]);
                setPart_a("");
                setPart_b("");
                setShowTable(true);
                alert("Pairs Saved!");
            }
        } else {
            alert('Please Generate Pairs')
        }
    }
    const hidePairs = async () => {
        const selectedIds = data?.filter(df => df.checked)?.map(d => d.id)
        const hideResponse = await api({ selectedIds, type }, serverUrl + 'hide', 'post');
        if (hideResponse.status === 200) {
            const response = await api(null, serverUrl + 'get/list/' + user + '/' + type + '/' + from + '/' + to, 'get');
            if (response.status === 200) {
                setData(response.data)
            }
        }
    }
    const getData = async () => {
        const responseList = await api(null, serverUrl + 'get/list/' + user + '/' + type + '/' + from + '/' + to, 'get');
        if (responseList.status === 200) {
            setData(responseList.data)
            setFrom(null);
            setTo(null);
        }
    }
    return (
        <div>
            {showTable && pairsData?.length > 0 && <div>{renderTable()}</div>}
            {!showTable &&
                <div >
                    <div>
                        {renderSelect()}
                        &nbsp;&nbsp;{renderUsers()}
                        &nbsp; &nbsp;<TextField disabled={!readAndWriteAccess} label="From" value={from} onChange={(e) => setFrom(e.target.value)} placeholder='From' />
                        &nbsp; &nbsp;<TextField disabled={!readAndWriteAccess} label="To" value={to} placeholder='To' onChange={(e) => setTo(e.target.value)} />
                        &nbsp; &nbsp;<Button disabled={!readAndWriteAccess} variant="contained" onClick={getData}>
                            Get Data
                        </Button>
                        &nbsp; &nbsp; {data?.filter(d => d.checked)?.length > 0 && <Button variant="contained" onClick={hidePairs}>
                            Hide Pairs
                        </Button>}
                    </div>

                    <div style={{ width: '100%' }}>
                        <div style={{ textAlign: 'end' }}>
                            <div>
                                <Button disabled={!readAndWriteAccess} variant="contained" onClick={getSelectionHandler}>
                                    Copy Selection
                                </Button>
                                <br />
                                <br />
                            </div>
                            {renderPairContent()}
                            <div>
                                <br />
                                <Button disabled={!readAndWriteAccess} variant="contained" onClick={addToPairBox}>
                                    Add
                                </Button>
                                <br />
                                <br />
                            </div>
                            <div style={{ width: '50%', float: 'right' }}>
                                {pairList?.length > 0 && getPairedContent()}
                            </div>
                            <div>
                                <br />
                            </div>
                        </div>
                        <div style={{ marginTop: '-10%', width: '50%', height: '30rem', overflow: 'auto' }}>
                            {data?.length > 0 && renderContent()}
                        </div>


                    </div>

                </div>
            }
      {showLoader && <Loader />}
        </div>
    )
}