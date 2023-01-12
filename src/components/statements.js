import * as React from 'react';
import TextField from '@mui/material/TextField';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import api from '../services/api';

export default function Statements() {
    // const serverUrl = `http://localhost:8080/statements/`;
    const serverUrl = `http://3.111.29.120:8080/statements/`;
    const [trueValue, setTrueValue] = React.useState('');
    const [falseValue1, setFalseValue1] = React.useState('');
    const [falseValue2, setFalseValue2] = React.useState('');
    const [falseValue3, setFalseValue3] = React.useState('');
    const [showFalse, setShowFalse] = React.useState(false)
    const addFalseStatements = () => {
        if(!trueValue){
            alert('please provide True statement')
        } else{
        setFalseValue1(trueValue);
        setFalseValue2(trueValue);
        setFalseValue3(trueValue);
        setShowFalse(true);
        }
    }
    const saveStatements=async()=>{
        if(!trueValue || !falseValue1 || !falseValue2 || !falseValue3){
            alert('please provide all the statements')
        } else if(!trueValue.includes('-')){
            alert('please sepearate statement with "-"')
        }else{
        const saveData = await api({ trueValue, falseValue1, falseValue2, falseValue3 }, serverUrl + 'save', 'post');
        if (saveData.status === 200) {
            alert('Statements Added!');
            setShowFalse(false);
            setTrueValue("");
            setFalseValue1("");
            setFalseValue2("");
            setFalseValue3("");
        }
    }
    }
    return (
        <div>
            <div style={{ paddingBottom: '2rem' }}>

                <TextField sx={{ width: '25%' }} id="outlined-basic" value={trueValue} onChange={(e) => setTrueValue(e.target?.value)} label="True Statement" variant="outlined" />
            </div>
            {showFalse && <div style={{ paddingBottom: '2rem' }}>

                <TextField sx={{ width: '25%', paddingBottom: '2rem' }} id="outlined-basic" value={falseValue1} onChange={(e) => setFalseValue1(e.target?.value)} label="False Statement1" variant="outlined" /> <br />
                <TextField sx={{ width: '25%', paddingBottom: '2rem' }} id="outlined-basic" value={falseValue2} onChange={(e) => setFalseValue2(e.target?.value)} label="False Statement2" variant="outlined" /> <br />
                <TextField sx={{ width: '25%', paddingBottom: '2rem' }} id="outlined-basic" value={falseValue3} onChange={(e) => setFalseValue3(e.target?.value)} label="False Statement3" variant="outlined" /> <br />

            </div>
            }
            <div>
                <Stack spacing={2} direction="row">
                    {!showFalse && <Button variant="contained" onClick={() => addFalseStatements()}>Add False Statements</Button>}
                    {showFalse && <Button variant="contained" onClick={() => saveStatements()}>Save Statements</Button>}
                </Stack>
            </div>
        </div>

    );
}

