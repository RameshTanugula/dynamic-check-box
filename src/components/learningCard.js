import * as React from 'react'
import { useState } from 'react';
import CheckboxTree from 'react-dynamic-checkbox-tree';
import uniqid from 'uniqid';
import api from '../services/api';
import './flashCard.css';


export default function LearningCard() {
    // const serverUrl = `http://localhost:8080/learning/`
    const serverUrl = `http://3.111.29.120:8080/learning/`
    const initialValue = [{ id: 1, frontValue: '', backValue: '', frontImgValue: "", backImgValue: "" }]
    const [list, setList] = React.useState(initialValue);
    const [fileList, setFileList] = useState([]);
    const [cardData, setCardData] = useState([]);
    const [showTable, setShowTable] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [title, setTitle] = useState("");
    const [selectedSubject, setSelectedSubject] = useState();

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
    return (
        <div>
            {showTable && <div style={{ "textAlign": "right", paddingBottom: '2rem' }}>
                <button style={{ height: '2rem' }} onClick={() => setShowTable(false)}>Add New Learning Card</button>
            </div>}
            {showTable && <table>
                <tr>
                    <th>S.No.</th>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Url</th>
                </tr>
                {cardData?.map((c, i) => {
                    return (<tr>
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
                            <select onChange={(e) => { setSelectedSubject(e.target.value) }}>
                                {subjects.map(s => {
                                    return <option value={s.id}>{s.name}</option>
                                })}</select>
                        </div>
                        <br />
                        <label >
                            Title:<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
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
                                            <input type="file" onChange={(e) => onChangeCell(e, i)} />
                                        </div></td>
                                    </tr>
                                ))}
                            </table>
                            <button id="addBtn" onClick={addRow}>Add New Row</button><br /><br />
                        </div>
                        <input type="submit" onClick={() => onSubmitHandler()} value="Submit" />
                    </header>
                </div>

            }
        </div>
    )
}