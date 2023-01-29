import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import api from '../services/api';
import CommonTableView from './TableView';
import * as securedLocalStorage from "./SecureLocalaStorage";

export default function Statements() {
    // const serverUrl = `http://localhost:8080/statements/`;
    const serverUrl = securedLocalStorage.basUrl + 'statements/';
    const [trueValue, setTrueValue] = React.useState(['']);
    const [falseValue, setFalseValue] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [showTable, setShowTable] = React.useState(true);
    const [showFalse, setShowFalse] = React.useState(false);
    const [parentStatementId, setParentStatementId] = React.useState('');
    const [parentStatementName, setParentStatementName] = React.useState('');
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
    const addFalseRow = () => {
        setFalseValue([...falseValue.concat([parentStatementName])])
    }
    const removeRow = (i) => {
        trueValue.splice(i, 1);
        setTrueValue([...trueValue])
    }
    const removeFalseRow = (i) => {
        falseValue.splice(i, 1);
        setFalseValue([...falseValue])
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
        const duplicates = findDuplicates(falseValue);
        if (!falseValue || falseValue.length === 0) {
            alert('No statements to save')
        } else if (falseValue.includes(parentStatementName)) {
            alert('False statement should not be same as Parent statement');
        } else if (duplicates && duplicates.length > 0) {
            alert('Duplicates found!')
        } else {
            const saveData = await api({ falseValue, parentStatementId }, serverUrl + 'false/save', 'post');
            if (saveData.status === 200) {
                alert('False Statements Added!');
                const response = await api(null, serverUrl + 'list', 'get');
                if (response.status === 200) {
                    setData(response.data)
                }
                setTrueValue(['']);
                setFalseValue(['']);
                setShowFalse(false);
                setShowTable(true);
                setParentStatementId('');
                setParentStatementName('')
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
        setTrueValue([...trueValue]);
    }
    const onChangeFalseValue = (value, i) => {
        falseValue[i] = value;
        setTrueValue([...falseValue]);
    }
    const hideStatement = async (id) => {

        const response = await api(null, serverUrl + 'hide/' + id, 'put');
        if (response.status === 200) {

            const list = await api(null, serverUrl + 'list', 'get');
            if (list.status === 200) {
                setData(list.data)
            }
        }
    }
    const onClickCreate = (row) => {
        setParentStatementId(row.StatementId);
        setParentStatementName(row.Complete_Statement);
        setFalseValue([row.Complete_Statement]);
        setShowFalse(true);
        setShowTable(false);
    }
    const renderFakeContent = () => {
        return (

            <div>
                {falseValue && falseValue.length > 0 && falseValue?.map((f, i) => {
                    return (<div style={{ paddingBottom: '2rem' }}>

                        <TextField sx={{ width: '75%' }} id="outlined-basic" value={f} onChange={(e) => onChangeFalseValue(e.target?.value, i)} label={`False Statement - ` + (i + 1)} variant="outlined" />
                        &nbsp;&nbsp;<Button sx={{ height: '1.5rem', width: '2rem', marginTop: '1rem' }} variant="outlined" onClick={() => removeFalseRow(i)}>Delete</Button> <br /><br />

                    </div>)
                })}
                <Stack spacing={2} direction="row">
                    &nbsp;&nbsp;<Button variant="contained" onClick={() => addFalseRow()}>Add Row</Button> <br /> <br />
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
            {showTable && data.length > 0 && <div><CommonTableView hideStatement={hideStatement} onClickCreate={onClickCreate} data={data} /></div>}
            {!showTable && !showFalse && trueValue && trueValue.length > 0 && trueValue?.map((t, i) => {
                return (<div style={{ paddingBottom: '2rem' }}>

                    <TextField sx={{ width: '75%' }} id="outlined-basic" value={t} onChange={(e) => onChangeTrueValue(e.target?.value, i)} label="True Statement" variant="outlined" />
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

