import * as React from 'react'
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import uniqid from 'uniqid';
import api from '../services/api';
import SnackBar from './SnackBar';
import './flashCard.css';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";

export default function LearningCard() {
    // const serverUrl = `http://localhost:8080/learning/`
    const serverUrl = securedLocalStorage.baseUrl + 'learning/'
    const initialValue = [{ id: 1, frontValue: '', backValue: '', frontImgValue: "", backImgValue: "" }]
    const [list, setList] = React.useState(initialValue);
    const [fileList, setFileList] = useState([]);
    const [cardData, setCardData] = useState([]);
    const [showTable, setShowTable] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const sample = {
        type: "learningCard",
        list: []
    }
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [selectedSubjects, setSelectedSubjects] = useState(sample);
    const [title, setTitle] = useState("");
    const [selectedSubject, setSelectedSubject] = useState();
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);

    React.useEffect(() => {
        async function fetchData() {
            const subData = await api(null, serverUrl + 'get/subjects', 'get');
            const cardData = await api(null, serverUrl + 'cards', 'get');
            if (cardData.status === 200) {
                setCardData(cardData.data);
            }
            if (subData.status === 200) {
                setSelectedSubject(subData.data[0].id)
                setSubjects(subData.data)
            }

        }
        fetchData();
    }, []);
    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
    }, [])
    const onSubmitHandler = async () => {
        if (!selectedSubject) {
            alert('please select Subject')
        } else if (!title) {
            alert('please enter Title')
        } else if (!fileList || fileList?.length === 0) {
            alert('please select required files')
        } else {
            const formData = new FormData();
            for (let i = 0; i < fileList?.length; i++) {
                formData.append(
                    "files", fileList[i],
                );
            }
            formData.append('selectedSubject',
                selectedSubject)
            formData.append('title',
                title)
            const data = await api(formData, serverUrl + 'upload/learning/card', 'post');
            if (data.status === 200) {
                setList([]);
                setSelectedSubject("");
                setFileList([]);
                setTitle("");
                const cardData = await api(null, serverUrl + 'cards', 'get');
                if (cardData.status === 200) {
                    setCardData(cardData.data);
                    setShowTable(true)
                }
                alert('Learning Card saved succesfully!')
            }
        }
    }
    const addRow = () => {
        const tmpList = { id: list.length + 1, frontImgValue: "", backImgValue: "" };
        setList(list.concat([tmpList]))
    }
    const onChangeCell = async (value, i) => {
        const tmpFileName = uniqid() + '$' + value.target.files[0].name;
        const myNewFile = new File(
            [value.target.files[0]],
            `${tmpFileName}`,
            { type: value.target.files[0].type }
        );

        const tmp = fileList.concat(myNewFile)
        setFileList([...tmp])
        list[i].frontImgValue = tmpFileName;

        setList([...list])

    }

    function selectedList(row) {
        let val = 0;
        if (row.is_home_ref === 0) {
            val = 1;
        }
        var foundIndex = cardData.findIndex(x => x.id == row.id);
        cardData[foundIndex].is_home_ref = val;
        setCardData([...cardData]);
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

    return (
        <div>
            {showTable && <div style={{ "textAlign": "right", paddingBottom: '2rem' }}>
                <button disabled={!readAndWriteAccess} style={{ height: '2rem' }} onClick={() => addToHome()}>Add to home </button> &nbsp;
                <button disabled={!readAndWriteAccess} style={{ height: '2rem' }} onClick={() => setShowTable(false)}>Add New Learning Card</button>
            </div>}
            {showTable && <table>
                <tr>
                    <th>Select</th>
                    <th>S.No.</th>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Url</th>
                </tr>
                {cardData?.map((c, i) => {
                    return (<tr>
                        <td>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={c.is_home_ref}
                                        disabled={!readAndWriteAccess}
                                        onChange={(e) => selectedList(c)}
                                    />
                                }
                            />
                        </td>
                        <td>{i + 1}</td>
                        <td>{c.title}</td>
                        <td>{c.name}</td>
                        <td>{c.location_url}</td>
                    </tr>)
                })
                }

            </table>}
            {!showTable &&
                <div className="App">
                    <header className="App-header">
                        <div>
                            <select disabled={!readAndWriteAccess} onChange={(e) => { setSelectedSubject(e.target.value) }}>
                                {subjects.map(s => {
                                    return <option value={s.id}>{s.name}</option>
                                })}</select>
                        </div>
                        <br />
                        <label >
                            Title:<input disabled={!readAndWriteAccess} type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </label><br />
                        <div>
                            <table>
                                <th>S.No</th>
                                <th>File</th>
                                {list.map((r, i) => (
                                    <tr>
                                        <td>{r.id}.</td>

                                        <td><div>
                                            &nbsp;&nbsp;
                                            <input disabled={!readAndWriteAccess} type="file" onChange={(e) => onChangeCell(e, i)} />
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
            {openSnackBar &&
                <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />
            }
        </div>
    )
}