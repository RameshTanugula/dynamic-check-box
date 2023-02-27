import * as React from 'react';
import Button from '@mui/material/Button';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import api from '../services/api';
import Loader from './Loader';
import Link from '@mui/material/Link';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';

export default function TestDashBoard() {
    const serverUrl = securedLocalStorage.baseUrl;
    const [questionsData, setQuestionsData] = React.useState([]);
    const [testData, setTestData] = React.useState([]);
    const [showLoader, setShowLoader] = React.useState(false);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [showSreen, setShowSreen] = React.useState("Grid");

    const columns = [
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
                return (params.row.is_omr === 1 ? "OMR" : "Online")

            }
        },
        { field: 'no_of_questions', headerName: 'Number OF Questions', minWidth: 200, },
        { field: 'price', headerName: 'Price', minWidth: 200, },
        { field: 'created_at', headerName: 'Created Date', minWidth: 250, },
    ];

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
            setShowSreen("Questions")
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
                <div style={{ height: 370, width: '100%', marginTop: "5px" }}>
                    <DataGrid
                        rows={testData}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        getRowId={(row) => row.id}
                    />
                </div>
            }
            {showSreen === "Questions" &&
                <span>
                    <Stack style={{ float: "right"}} direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => setShowSreen("Grid")} >Back</Button>
                        <Button variant="outlined" onClick={() => exportToWord()} >Export</Button>
                    </Stack>
                    <div id="element" style={{ marginTop: "20px" }}>
                    &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span style={{ fontSize: "25px" }} >Questions</span>
                        <br />
                        <br />
                        <span>
                            {questionsData && questionsData.map((question, i) => {
                                return (<span><span style={{ fontWeight: "bold" }}>{i + 1}.{question.QuestionTitle}</span>. <br /> <span>A.{question.Option1}.</span><br /> <span>B.{question.Option2}.</span><br /> <span>C.{question.Option3}.</span> <br /> <span>D.{question.Option4}.</span><br /><br /> </span>)
                            })}
                        </span>
                    </div>
                </span>
            }
            {showLoader &&
                <Loader />
            }
        </div>
    )
}