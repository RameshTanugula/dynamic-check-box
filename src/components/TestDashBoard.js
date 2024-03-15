import * as React from 'react';
import Button from '@mui/material/Button';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import api from '../services/api';
import Loader from './Loader';
import Link from '@mui/material/Link';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import SnackBar from './SnackBar';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import * as XLSX from 'xlsx';
import DraftTest from './draftTest';

export default function TestDashBoard() {
    const serverUrl = securedLocalStorage.baseUrl;
    const [questionsData, setQuestionsData] = React.useState([]);
    const [testData, setTestData] = React.useState([]);
    const [showLoader, setShowLoader] = React.useState(false);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [showSreen, setShowSreen] = React.useState("Grid");
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [showKey , setShowKey] = React.useState(false)
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(5);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
    };
    const handleEditTestClick = (params) => {
        
        const id = params.row.id;

        window.location.href = `/draft-test/${id}`;
        // deleteTest(params.row);
      };
    const sample = {
        type: "testdashboard",
        list: []
    }
    const [selectedSubjects, setSelectedSubjects] = React.useState(sample)
    const columns = [
        {
            field: 'select', headerName: 'Select', minWidth: 20,
            renderCell: (params) => {
                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={params.row.is_home_ref}
                                disabled={!readAndWriteAccess}
                                onChange={(e) => selectedList(params.row)}
                            />
                        }
                    />)
            }
        },

        {
            field: 'test_name', headerName: 'Test Name', minWidth: 250,
            renderCell: (params) => {
                return (
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => getquestionsData(params.row)}
                    >
                        {params.row.test_name}
                    </Link>)
            }
        },
        {
            field: '', headerName: 'Test Type', minWidth: 200,
            renderCell: (params) => {
                return (getTestType(params.row))

            }
        },
        { field: 'no_of_questions', headerName: 'Number OF Questions', minWidth: 200, },
        { field: 'price', headerName: 'Price', minWidth: 200, },
        { field: 'created_at', headerName: 'Created Date', minWidth: 250, },
        { field: 'key', headerName:'Test Key', minWidth:100,
          renderCell: (params) => (
            <Button
               variant='outlined'              
                disabled={!readAndWriteAccess}
                onClick={() => showKeyDetails(params.row)}
                >
                 Key
                 
            </Button>
          )},
          {field:'is_active', headerName:'Status', minWidth:100,
          renderCell: (params) => getStatusText(params.row.is_active)
        },
        {
            field: 'editTest', headerName: 'Edit Test', minWidth: 150,
            renderCell: (params) => (
             
                <Button
                  variant="outlined"
                  onClick={() => handleEditTestClick(params)}
                //   disabled={params.row.is_active === 1}
                >
                  Edit Test
                </Button>
               
            ),
          },
      
        {
            field: 'deleteTest', headerName: 'Delete Test', minWidth: 150,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    onClick={() => deleteTest(params.row)}
                    disabled={!readAndWriteAccess}
                >
                    Delete Test
                </Button>
            ),
        },
        {
            field: 'rank', headerName: 'Rank', minWidth: 150,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    onClick={() => handleRankButtonClick(params)}
                    disabled={!readAndWriteAccess}
                >
                    Rank
                </Button>
            ),
        },
    ];

    const handleRankButtonClick = (params) => {
        const id = params.row.id;

        window.location.href = `/Rank/${id}`;
    };


    function getStatusText(isActive) {
        return  isActive === 1 ? 'Active' : 'Draft'
      }
    const showKeyDetails = (row) => {
        setShowKey(true);
        setShowSreen("Key");
    };
    async function deleteTest(row) {

        const resp = await api(null, serverUrl + "test/delete/" + row.id, 'delete');
        if (resp.status === 200) {
            setOpenSnackBar(true);
            const data = {
                type: "success",
                message: row.test_name + " deleted successfully...!"
            }
            setSnackBarData(data);
            getTestData();
        }
        else {
            setOpenSnackBar(true);
            const data = {
                type: "error",
                message: resp.response.data.error + " to deleted ...!"
            }
            setSnackBarData(data);
        }
    }

    function selectedList(row) {
        let val = 0;
        if (row.is_home_ref === 0) {
            val = 1;
        }
        var foundIndex = testData.findIndex(x => x.id == row.id);
        testData[foundIndex].is_home_ref = val;
        setTestData([...testData]);
        const index = selectedSubjects.list.findIndex(x => x.id == row.id);
        if (index === -1) {
            selectedSubjects.list.push({ id: row.id, value: val })
        }
        else {
            selectedSubjects.list[index].value = val;
        }
        setSelectedSubjects(selectedSubjects);
    }

    const addToHome = async () => {
        const data = await api(selectedSubjects, securedLocalStorage.baseUrl + 'common/ref', 'post');
        if (data.status === 200) {
            setSelectedSubjects(sample);
            setOpenSnackBar(true);
            const data = {
                type: "success",
                message: "Added to home successfully!.."
            }
            setSnackBarData(data);
        }
        else {
            setOpenSnackBar(true);
            const data = {
                type: "success",
                message: "Adding home failed!..."
            }
            setSnackBarData(data);

        }
    }

    function closeSnakBar() {
        setOpenSnackBar(false)
    }


    function getTestType(row) {
        let value = "";
        if (row.is_omr === 1 && row.is_online === 1) {
            value = "OMR,Online";
        }
        else {
            value = row.is_omr === 1 ? "OMR" : row.is_online === 1 && "Online"
        }
        return value;
    }
    //excel
    const exportToExcel = () => {
        // Assuming questionsData is an array of objects with various properties including "answer," "tags," and "book_marked"
        const questionsDataModified = questionsData.map(({ order_id, question, is_online, is_omr, answer, tags, is_book_marked, part_a, part_b, options, ...rest }) => {
            let modifiedData = { ...rest }; // Initialize with default values

            if (rest.type === 'MCQ1') {
                modifiedData.partA = part_a;
                modifiedData.partB = part_b;
            } else if (rest.type === 'MCQ2') {
                modifiedData.partA = part_a;
                modifiedData.partB = '';
            } else {
                modifiedData.partA = '';
                modifiedData.partB = '';
            }
            if (rest.type === 'IMG') {
                modifiedData.QUrls = rest.QUrls || '';
                modifiedData.ImageLink = rest.QUrls ? `Click here` : ''; // Display 'Click here' as a hyperlink text
            }

            return modifiedData;
        });

        const worksheet = XLSX.utils.json_to_sheet(questionsDataModified);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'questionsData');
        XLSX.writeFile(workbook, 'questionsData.xlsx');
    }

    //word
    function exportToWord() {
        var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'></head><body>";
        var footer = "</body></html>";
        var sourceHTML = header + document.getElementById("element").innerHTML + footer;
        var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        var fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'document.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }


    const getquestionsData = async (row) => {
        setShowLoader(true);
        const url = serverUrl + "test/list/bytestid/" + row.id;
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {

            setQuestionsData(resp.data);
            setShowLoader(false);
            setShowSreen("Questions");
            console.log(questionsData, "questionsData")
        }
    }



    const getTestData = async () => {
        setShowLoader(true);
        const url = serverUrl + "test/list";
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {
            setTestData(resp.data);
            setShowLoader(false);
        }
    }

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
        getTestData();
    }, []);
    return (
        <div>

            {showSreen === "Grid" &&
                <div>
                    <button disabled={!readAndWriteAccess} style={{ height: '2rem' }} onClick={() => addToHome()}>Add to home </button>
                    <br />
                    <div style={{ height: 600, width: '100%', marginTop: "5px" }}>
                        <DataGrid
                            rows={testData}
                            columns={columns}
                            rowsPerPageOptions={[5, 10, 25, 50, 100]} // { label: 'All', value: -1 }
                            pageSize={pageSize}
                            pagination
                            page={page}
                            // rowsPerPageOptions={[10]}
                            // getRowId={(row) => row.id}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            rowCount={testData.length}
                            getRowId={(row) => row.id}

                        />
                    </div>
                </div>
            }
             {showSreen === "Key" &&  ( 
                <span>
                    <Stack style={{ float: "right", top: "110px", position: "sticky" }} direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => setShowSreen("Grid")} >Back</Button>
                        {/* <Button variant="outlined" onClick={() => exportToWord()} >Export as Word</Button>
                        <Button variant="outlined" onClick={exportToExcel} >Export as Excel</Button> */}
                    </Stack>
                 <div style={{ marginTop:"20px" }}>
                    <span style={{fontSize:"25px" , marginBottom:"10px"}}>TEST KEY</span>
                    <br/>
                   {  questionsData.map((ques , i) => (
                    <span key={i}>
                      <span style={{ fontWeight: "bold" }}>{i + 1}.{ques.answer || ques.ans}</span>. <br />
                    </span>
                   ))
                   }

                 </div>
                </span>
           ) }

            {showSreen === "Questions" &&
                <span>
                    <Stack style={{ float: "right", top: "110px", position: "sticky" }} direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => setShowSreen("Grid")} >Back</Button>
                        <Button variant="outlined" onClick={() => exportToWord()} >Export as Word</Button>
                        <Button variant="outlined" onClick={exportToExcel} >Export as Excel</Button>
                    </Stack>
                    <div id="element" style={{ marginTop: "20px" }}>
                        &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span style={{ fontSize: "25px" }} >Questions</span>
                        <br />
                        <br />
                        {
                    questionsData && questionsData.map((question, i) => (
                        <span key={i}>
                            <span style={{ fontWeight: "bold", color:"red" }}>{i + 1}.{question.QuestionTitle}</span>. <br />

                            <span>
                                {
                                    question.type !== '' ? (
                                        (question.type === "MCQ2") ? (
                                            <div>
                                                {question.part_a.split(',').map((part, index) => (
                                                    <div key={index}><strong>{String.fromCharCode(65 + index)}. {part.trim()}</strong></div>
                                                ))}
                                            </div>
                                        ) : question.type === "IMG" ? (
                                            <span>
                                                {question.QUrls && <img style={{
                                                    height: '10rem',
                                                    width: 'auto'
                                                }} src={question.QUrls} />}
                                            </span>
                                        ) : question.type === "MCQ1" ? (
                                            <div style={{ width: '300px' }}>
                                            <table style={{ border: '1px solid black' }}>
                                            <thead>
                                        <tr>
                                            <th>Part-A</th>
                                            <th>Part-B</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <td>
                                                {question.part_a && question.part_a.split(',').map((part, index) => (
                                                    <div key={index}>
                                                        {String.fromCharCode(65 + index)}. {part.trim()}
                                                        {index !== question.part_a.split(',').length - 1 && <hr />}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {question.part_b && question.part_b.split(',').map((part, index) => (
                                                    <div key={index}>
                                                        {(index + 1)}. {part.trim()}
                                                        {index !== question.part_b.split(',').length - 1 && <hr />}
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    </tbody>
                                            </table>
                                        </div>

                                        ) : ''
                                    ) : ''
                                }
                            </span> <br />

                            <span>
                                {question.type === 'IMG' ? '' : (
                                    <span>
                                        <span>A.{question.Option1}.</span><br />
                                        <span>B.{question.Option2}.</span><br />
                                        <span>C.{question.Option3}.</span> <br />
                                        <span>D.{question.Option4}.</span><br /><br />
                                    </span>
                                )}
                            </span>
                        </span>
                    ))
                }

                    </div>
                </span>
            }

            {showLoader &&
                <Loader />
            }
            {openSnackBar &&
                <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />
            }
        </div>
    )
}