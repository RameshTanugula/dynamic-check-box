import * as React from 'react';
import TextField from '@mui/material/TextField';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import api from '../services/api';
import CommonTableView from './TableView';
export default function Statements() {
    // const serverUrl = `http://localhost:8080/statements/`;
    const serverUrl = `http://3.111.29.120:8080/statements/`;
    const [trueValue, setTrueValue] = React.useState(['']);
    const [data, setData] = React.useState([]);
    const [showTable, setShowTable] = React.useState(true);
    const [showFalse, setShowFalse] = React.useState(false);
    const [false1, setFalse1] = React.useState('');
    const [false2, setFalse2] = React.useState('');
    const [false3, setFalse3] = React.useState('');
    const [parentStatementId, setParentStatementId] = React.useState('')
    React.useEffect(() => {
        async function fetchData() {
            const response = await api(null, serverUrl + 'list', 'get');
            if (response.status === 200) {
                setData(response.data)
            }

        }
        fetchData();
    }, []);
    const addRow = () => {
        setTrueValue([...trueValue.concat([''])])
    }
    const removeRow = (i) => {
        trueValue.splice(i, 1);
        setTrueValue([...trueValue])
    }
    const saveStatements = async () => {
        const duplicates = findDuplicates(trueValue);
        if (!trueValue || trueValue.length === 0) {
            alert('No statements to save')
        } else if (duplicates && duplicates.length > 0) {
            alert('Duplicates found!')
        } else {
            const saveData = await api(trueValue, serverUrl + 'save', 'post');
            if (saveData.status === 200) {
                alert('Statements Added!');
                setTrueValue(['']);
                setShowTable(true);
                const response = await api(null, serverUrl + 'list', 'get');
                if (response.status === 200) {
                    setData(response.data)
                }
            } else {
                alert('something went wrong!');
            }
        }
    }
    const saveFalseStatements = async () => {
        const duplicates = findDuplicates([false1, false2, false3]);
        if (!false1 || !false2 || !false3) {
            alert('No statements to save')
        } else if (duplicates && duplicates.length > 0) {
            alert('Duplicates found!')
        } else {
            const saveData = await api({ false1, false2, false3, parentStatementId }, serverUrl + 'false/save', 'post');
            if (saveData.status === 200) {
                alert('False Statements Added!');
                const response = await api(null, serverUrl + 'list', 'get');
                if (response.status === 200) {
                    setData(response.data)
                }
                setTrueValue(['']);
                setFalse1('');
                setFalse2('');
                setFalse3('');
                setShowFalse(false);
                setShowTable(true);
                setParentStatementId('');
            } else {
                alert('something went wrong!');
            }
        }
    }
    const findDuplicates = (arr) => {
        let sorted_arr = arr.slice().sort();
        let results = [];
        for (let i = 0; i < sorted_arr.length - 1; i++) {
            if (sorted_arr[i + 1] === sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }
        return results;
    }
    const onChangeTrueValue = (value, i) => {
        trueValue[i] = value;
        setTrueValue([...trueValue])
    }
    const onClickCreate = (row) => {
        setParentStatementId(row.StatementId);
        setShowFalse(true);
        setShowTable(false);
    }
    const renderFakeContent = () => {
        return (

            <div>
                <TextField sx={{ width: '50%', paddingBottom: '1rem' }} id="outlined-basic" value={false1} onChange={(e) => setFalse1(e.target?.value)} label="False Statement 1" variant="outlined" /> <br />
                <TextField sx={{ width: '50%', paddingBottom: '1rem' }} id="outlined-basic" value={false2} onChange={(e) => setFalse2(e.target?.value)} label="False Statement 2" variant="outlined" /> <br />
                <TextField sx={{ width: '50%', paddingBottom: '1rem' }} id="outlined-basic" value={false3} onChange={(e) => setFalse3(e.target?.value)} label="False Statement 3" variant="outlined" /> <br />
                <Stack spacing={2} direction="row">
                    {<Button variant="contained" onClick={() => { setShowTable(true); setShowFalse(false) }}>Cancel</Button>}
                    {<Button variant="contained" onClick={() => saveFalseStatements()}>Save False Statements</Button>}
                </Stack>
            </div>
        )
    }
    return (
        <div>
            <div style={{ paddingBottom: '1rem', textAlign: 'right' }}>
                {showTable && <Button variant="contained" onClick={() => setShowTable(!showTable)}>Create New Statements</Button>}
            </div>
            {showTable && data.length > 0 && <div><CommonTableView onClickCreate={onClickCreate} data={data} /></div>}
            {!showTable && !showFalse && trueValue && trueValue.length > 0 && trueValue?.map((t, i) => {
                return (<div style={{ paddingBottom: '2rem' }}>

                    <TextField sx={{ width: '50%' }} id="outlined-basic" value={t} onChange={(e) => onChangeTrueValue(e.target?.value, i)} label="True Statement" variant="outlined" />
                    &nbsp;&nbsp;<Button sx={{ height: '1.5rem', width: '2rem', marginTop: '1rem' }} variant="outlined" onClick={() => removeRow(i)}>Delete</Button>

                </div>)
            })}
            {!showTable && !showFalse && <div>
                <Stack spacing={2} direction="row">
                    {<Button variant="contained" onClick={() => addRow()}>Add Row</Button>}
                    {<Button variant="contained" onClick={() => saveStatements()}>Save Statements</Button>}
                </Stack>
            </div>}
            {showFalse && renderFakeContent()}
        </div>

    );
}

