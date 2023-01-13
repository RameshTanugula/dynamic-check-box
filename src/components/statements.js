import * as React from 'react';
import TextField from '@mui/material/TextField';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import api from '../services/api';

export default function Statements() {
    // const serverUrl = `http://localhost:8080/statements/`;
    const serverUrl = `http://3.111.29.120:8080/statements/`;
    const [trueValue, setTrueValue] = React.useState(['']);
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
    return (
        <div>
            {trueValue && trueValue.length > 0 && trueValue?.map((t, i) => {
                return (<div style={{ paddingBottom: '2rem' }}>

                    <TextField sx={{ width: '50%' }} id="outlined-basic" value={t} onChange={(e) => onChangeTrueValue(e.target?.value, i)} label="True Statement" variant="outlined" />
                    &nbsp;&nbsp;<Button sx={{ height: '1.5rem', width: '2rem', marginTop: '1rem' }} variant="outlined" onClick={() => removeRow(i)}>Delete</Button>

                </div>)
            })}
            <div>
                <Stack spacing={2} direction="row">
                    {<Button variant="contained" onClick={() => addRow()}>Add Row</Button>}
                    {<Button variant="contained" onClick={() => saveStatements()}>Save Statements</Button>}
                </Stack>
            </div>
        </div>

    );
}

