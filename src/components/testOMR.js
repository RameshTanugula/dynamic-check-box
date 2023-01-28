import React, { Component, useState } from 'react';
import api from '../services/api';
import './flashCard.css';
import TextField from '@mui/material/TextField';
import Loader from './circularProgress';
import * as securedLocalStorage from "./SecureLocalaStorage";

export default function TestOMR() {

    // const serverUrl = `http://localhost:8080/omr/`
    const serverUrl = securedLocalStorage.basUrl + 'omr/'
    const [loaded, setLoaded] = useState(true);
    const [selectedFile, setSelectedFile] = useState([]);
    const [testId, setTestId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [key, setKey] = useState("");
    const [isTestSubmitted, setIsTestSubmitted] = useState(false);
    const [answered, setAnswered] = useState([]);
    const [invalid, setInvalid] = useState(null);
    const [totalMarks, setTotalMarks] = useState(null);
    const [totalWrong, setTotalWrong] = useState(null);
    const [isRollNumMatched, setIsRollNumMatched] = useState(false);
    const [testIdMatched, setTestIdMatched] = useState(false);

    // On file select (from the pop up)
    const onFileChange = event => {

        setSelectedFile(event.target.files);

    };
    const formatKey = () => {
        return key?.split(",")?.map(k => parseInt(k));
    }
    const formatAnswerdKey = (ansKey) => {
        let resKey = ``;
        ansKey?.map((k) => {
            if (k) {
                resKey = resKey + `'${k}',`
            } else {
                resKey = resKey + `'null',`
            }
            return k;
        });
        return resKey;
    }
    // On file upload (click the upload button)
    const onFileUpload = async () => {

        // Create an object of formData
        if (!key) {
            alert("please enter key");
        } else if (!studentId) {
            alert("please enter studentId");
        } else if (!testId) {
            alert("please enter testId");
        } else
            if (selectedFile?.length > 0) {
                const formData = new FormData();

                for (let i = 0; i < selectedFile?.length; i++) {
                    formData.append(
                        "files", selectedFile[i],
                    );
                }
                setLoaded(false);
                const data = await api(formData, serverUrl + 'upload', 'post');
                if (data.status === 200) {
                    const inputFile = data.data[0].location;
                    const payload = {
                        "file": inputFile,
                        "key": formatKey(),
                        "testId": parseInt(testId),
                        "rollNo": parseInt(studentId)

                    }
                    const response = await api(payload, 'http://3.110.197.70/submit', 'post');
                    if (response?.data) {
                        setLoaded(true);
                        setIsTestSubmitted(true);
                        setAnswered(formatAnswerdKey(response.data.Answered));
                        setInvalid(response.data.Count_None_values);
                        setTotalMarks(response.data.Total_marks);
                        setTotalWrong(response.data.Total_worng);
                        setIsRollNumMatched(response.data.Rollno_matched);
                        setTestIdMatched(response.data.TestId_matched);
                    }
                    if (data.status === 200) {
                        setKey("");
                        setStudentId("");
                        setTestId("");
                    }
                    alert('File uploaded!')
                    setSelectedFile([])
                }
            } else {
                alert('Please choose file to uplad!')
            }
    };
    const fileData = () => {

        return (
            <div>
                <br />
                <h4>Choose before the Upload</h4>
            </div>
        );

    };
    return (
        <div>

            {
                <div style={{ paddingTop: '2rem', textAlign: 'center' }}>
                    {!loaded && <Loader />}
                    <div>
                        <TextField
                            label="TestId"
                            id="outlined-start-adornment"
                            sx={{ width: '20%', marginTop: '2rem' }}
                            value={testId}
                            onChange={(e) => setTestId(e.target.value)}
                            name="TestId"
                        // error={title === ""}
                        // helperText={title === "" ? 'Title is reuired' : ' '}
                        /><br />

                        <TextField
                            label="Key"
                            id="outlined-start-adornment"
                            sx={{ width: '20%', marginTop: '2rem' }}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            name="Key"
                        /><br />

                        <TextField
                            label="Roll Number"
                            id="outlined-start-adornment"
                            sx={{ width: '20%', marginTop: '2rem' }}
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            name="Roll Number"
                        /><br />
                    </div>
                    <div style={{ paddingTop: '2rem' }}>
                        <input type="file" multiple onChange={onFileChange} />
                        <br />
                        <br />
                        <button onClick={onFileUpload}>
                            Get Results
                        </button>
                    </div>
                    {fileData()}
                    {isTestSubmitted && <div>
                        <p><b>answered:</b>&nbsp;&nbsp;{answered}</p><br />
                        <p><b>invalid:</b>&nbsp;&nbsp;{invalid}</p><br />
                        <p><b>totalMarks:</b>&nbsp;&nbsp;{totalMarks}</p><br />
                        <p><b>totalWrong:</b>&nbsp;&nbsp;{totalWrong}</p><br />
                        <p><b>isRollNumMatched:</b>&nbsp;&nbsp;{isRollNumMatched ? "Yes" : "No"}</p><br />
                        <p><b>testIdMatched:</b>&nbsp;&nbsp;{testIdMatched ? "Yes" : "No"}</p><br />
                    </div>}
                </div>}
        </div>
    );
}

