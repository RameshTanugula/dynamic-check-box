import * as React from 'react'
import { useState } from 'react';
import CheckboxTree from 'react-dynamic-checkbox-tree';
import uniqid from 'uniqid';
import api from '../services/api';
import './common.css';


export default function FlashCard() {
    // const serverUrl = `http://localhost:8080/flashcard/`
      const serverUrl = `http://3.111.29.120:8080/flashcard/`
    const initialValue = [{ id: 1, frontValue: '', backValue: '', frontImgValue: "", backImgValue: "" }]
    const [list, setList] = React.useState(initialValue);
    const [fileList, setFileList] = useState([]);
    const [title, setTitle] = useState("")
    const validateList = () => {
        list.map((l) => {
            if (((l.frontValue === '') && (l.backValue === ''))) {
                return true
            }
        })
        return false;
    }
    const onSubmitHandler = async () => {
        if (title === '') {
            alert('please enter title')
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
            formData.append('list',
                JSON.stringify(list))
            const data = await api(formData, serverUrl + 'upload/flashcard', 'post');
            if (data.status === 200) {
                setList([]);
                setTitle("");
                setFileList([]);
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

            {
                <div className="App">
                    <header className="App-header">
                        <label >
                            Title:<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </label><br />
                        <div>
                            <table>
                                <th>S.No</th>
                                <th>Front</th>
                                <th>Back</th>
                                {list.map((r, i) => (
                                    <tr>
                                        <td>{r.id}.</td>
                                        <td><div>
                                            <span>Image:<input type="checkbox" onChange={(e) => onChangeCell(e.target.value, i, 'f', true)} value={r.frontType} /></span>
                                            <br />
                                            {!r.fchecked && <input type="text" onChange={(e) => onChangeCell(e.target.value, i, 'ft')} value={r.frontValue} />}
                                            &nbsp;&nbsp;
                                            {r.fchecked && <input type="file" onChange={(e) => onChangeCell(e, i, 'fi')} />}
                                        </div></td>
                                        <td><div>
                                            <span>Image:<input type="checkbox" onChange={(e) => onChangeCell(e.target.value, i, 'b', true)} value={r.frontType} /></span>
                                            <br />
                                            {!r.bchecked && <input type="text" onChange={(e) => onChangeCell(e.target.value, i, 'bt')} value={r.backValue} />}
                                            &nbsp;&nbsp;
                                            {r.bchecked && <input type="file" onChange={(e) => onChangeCell(e, i, 'bi')} />}
                                        </div></td>
                                    </tr>
                                ))}
                            </table>
                            <button id="addBtn" onClick={addRow}>Add New Row</button><br/><br/>
                        </div>
                        <input type="submit" onClick={() => onSubmitHandler()} value="Submit" />
                    </header>
                </div>

            }
        </div>
    )
}