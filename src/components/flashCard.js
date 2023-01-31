import * as React from 'react'
import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import uniqid from 'uniqid';
import api from '../services/api';
import './flashCard.css';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";

export default function FlashCard() {
    // const serverUrl = `http://localhost:8080/flashcard/`
    const serverUrl = securedLocalStorage.baseUrl + 'flashcard/'
    const initialValue = [{ id: 1, frontValue: '', backValue: '', frontImgValue: "", backImgValue: "" }]
    const [list, setList] = React.useState(initialValue);
    const [fileList, setFileList] = useState([]);
    const [title, setTitle] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [cardData, setCardData] = useState([]);
    const [showTable, setShowTable] = useState(true);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);

    const validateList = () => {
        list.map((l) => {
            if (((l.frontValue === '') && (l.backValue === ''))) {
                return true
            }
        })
        return false;
    }
    React.useEffect(() => {
        async function fetchData() {
            const cardData = await api(null, serverUrl + 'titles', 'get');
            const subData = await api(null, 'http://3.110.42.205:8080/files/get/subjects', 'get');
            if (subData.status === 200) {
                setSelectedSubject(subData.data[0].id)
                setSubjects(subData.data)
            }
            if (cardData.status === 200) {
                setCardData(cardData.data)
            }
        }
        fetchData();
    }, []);

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
    }, []);

    const onSubmitHandler = async () => {
        if (title === '') {
            alert('please enter title')
        } if (selectedSubject === '') {
            alert('please choose subject')
        } else if (validateList()) {
            alert('please fill required fields')
        } else {
            const formData = new FormData();
            for (let i = 0; i < fileList?.length; i++) {
                formData.append(
                    "files", fileList[i],
                );
            }
            formData.append('title',
                title)
            formData.append('subject',
                selectedSubject)
            formData.append('list',
                JSON.stringify(list))
            const data = await api(formData, serverUrl + 'upload/flashcard', 'post');
            if (data.status === 200) {
                setList([]);
                setTitle("");
                setFileList([]);
                setSelectedSubject(subjects[0].id);
                const cardData = await api(null, serverUrl + 'titles', 'get');
                if (cardData.status === 200) {
                    setCardData(cardData.data);
                    setShowTable(true)
                }
                alert('Flash Card saved succesfully!')
            }
        }
    }
    const addRow = () => {
        const tmpList = { id: list.length + 1, frontValue: '', backValue: '', frontImgValue: "", backImgValue: "" };
        setList(list.concat([tmpList]))
    }
    const onChangeCell = async (value, i, type, isCheck) => {
        if ((type === 'f') && isCheck) {
            list[i].fchecked = !list[i].fchecked
        }
        if ((type === 'b') && isCheck) {
            list[i].bchecked = !list[i].bchecked
        }
        if (type === 'ft') {
            list[i].frontValue = value;
        }
        if (type === 'bt') {
            list[i].backValue = value;
        }
        if (type === 'fi') {
            // fileList = value.target.files;
            const tmpFileName = uniqid() + '$' + value.target.files[0].name;
            const myNewFile = new File(
                [value.target.files[0]],
                `${tmpFileName}`,
                { type: value.target.files[0].type }
            );

            const tmp = fileList.concat(myNewFile)
            setFileList([...tmp])
            list[i].frontImgValue = tmpFileName;
        }
        if (type === 'bi') {
            const tmpFileName = uniqid() + '$' + value.target.files[0].name;
            const myNewFile = new File(
                [value.target.files[0]],
                `${tmpFileName}`,
                { type: value.target.files[0].type }
            );

            const tmp = fileList.concat(myNewFile);
            setFileList([...tmp]);
            list[i].backImgValue = tmpFileName;
        }
        setList([...list])

    }
    return (
        <div>
            {showTable && <div style={{ "textAlign": "right", paddingBottom: '2rem' }}>
                <button style={{ height: '2rem' }} onClick={() => setShowTable(false)}>Add New Flash Card</button>
            </div>}
            {showTable && <table>
                <tr>
                    <th>S.No.</th>
                    <th>Subject</th>
                    <th>Title</th>
                </tr>
                {cardData?.map((c, i) => {
                    return (<tr>
                        <td>{i + 1}</td>
                        <td>{c.subject}</td>
                        <td>{c.title}</td>
                    </tr>)
                })
                }

            </table>}
            {!showTable &&
                <div className="App">
                    <header className="App-header">
                        <label >
                            {/* Title:<TextField type="text" value={title} onChange={(e) => setTitle(e.target.value)} /> */}
                            <TextField
                                label="Title"
                                id="outlined-start-adornment"
                                sx={{ width: '100%' }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                name="Title"
                                disabled={!readAndWriteAccess}
                            // error={errors.courseTitle !== ""}
                            // helperText={errors.courseTitle !== "" ? 'Title is reuired' : ' '}
                            />
                        </label><br />
                        <FormControl sx={{ m: 1, minWidth: 300 }} style={{ marginLeft: "16px", marginTop: "15px" }}>
                            {/* <InputLabel id="demo-simple-select-label">Subject</InputLabel> */}
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedSubject}
                                name="Subject"
                                onChange={(e) => { setSelectedSubject(e.target.value) }}
                                disabled={!readAndWriteAccess}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {subjects.map((data, i) => (
                                    <MenuItem key={i} value={data.id}>
                                        {data.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div>
                            <table>
                                <th>S.No</th>
                                <th>Front</th>
                                <th>Back</th>
                                {list.map((r, i) => (
                                    <tr>
                                        <td>{r.id}.</td>
                                        <td><div>
                                            <span>Image:<input disabled={!readAndWriteAccess} type="checkbox" onChange={(e) => onChangeCell(e.target.value, i, 'f', true)} value={r.frontType} /></span>
                                            <br />
                                            {!r.fchecked && <input disabled={!readAndWriteAccess} type="text" onChange={(e) => onChangeCell(e.target.value, i, 'ft')} value={r.frontValue} />}
                                            &nbsp;&nbsp;
                                            {r.fchecked && <input disabled={!readAndWriteAccess} type="file" onChange={(e) => onChangeCell(e, i, 'fi')} />}
                                        </div></td>
                                        <td><div>
                                            <span>Image:<input disabled={!readAndWriteAccess} type="checkbox" onChange={(e) => onChangeCell(e.target.value, i, 'b', true)} value={r.frontType} /></span>
                                            <br />
                                            {!r.bchecked && <input disabled={!readAndWriteAccess} type="text" onChange={(e) => onChangeCell(e.target.value, i, 'bt')} value={r.backValue} />}
                                            &nbsp;&nbsp;
                                            {r.bchecked && <input disabled={!readAndWriteAccess} type="file" onChange={(e) => onChangeCell(e, i, 'bi')} />}
                                        </div></td>
                                    </tr>
                                ))}
                            </table>
                            <button id="addBtn" disabled={!readAndWriteAccess} onClick={addRow}>Add New Row</button><br /><br />
                        </div>
                        <input type="submit" disabled={!readAndWriteAccess} onClick={() => onSubmitHandler()} value="Submit" />
                    </header>
                </div>

            }
        </div>
    )
}