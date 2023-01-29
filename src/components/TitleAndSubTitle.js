import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import api from '../services/api';
import * as securedLocalStorage from "./SecureLocalaStorage";

export default function TitleAndSubTitle() {
    const serverUrl = securedLocalStorage.basUrl + 'question/';

    const [showTitleScreen, setShowTitleScreen] = React.useState(false);
    const [subTitle, setSubTitle] = React.useState([""]);
    const [titles, setTitles] = React.useState([""]);
    const [titleList, setTTitleList] = React.useState([""]);
    const [titleName, setTitleName] = React.useState();
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

    function addRow(screen) {
        if (screen === "title") {
            setTitles([...titles.concat([''])])
        }
        else {
            setSubTitle([...subTitle.concat([''])]);
        }
    }

    function removeRow(i, screen) {
        if (screen === "title") {
            titles.splice(i, 1);
            setTitles([...titles])
        }
        else {
            subTitle.splice(i, 1);
            setSubTitle([...subTitle])
        }
    }

    function addSValue(value, i, screen) {
        if (screen === "title") {
            titles[i] = value;
            setTitles([...titles])
        }
        else {
            subTitle[i] = value;
            setSubTitle([...subTitle]);
        }

    }

    async function saveData(screen) {
        let payLoad;
        if (screen === "title") {
            payLoad = {
                titles: titles
            }
            const resp = await api(payLoad, serverUrl + "add/titles", 'post');
            if (resp.status === 200) {
                getTitles();
                setSuccessMessage("Titles added successfully!....")
            }
            else {
                console.log(resp.response.data.error)
                setErrorMessage(resp.response.data.error)
            }
        }
        else {
            payLoad = {
                OptionTitleId: titleName,
                subTitles: subTitle
            }
            const resp = await api(payLoad, serverUrl + "add/subtitles", 'post');
            if (resp.status === 200) {
                setSuccessMessage("Sub-Titles added successfully!....")
            }
            else {
                console.log(resp.data)
                setErrorMessage(resp.response.data.error)
            }
        }

        setTimeout(() => {
            closeAlert();
        }, 6000);
    }

    const getTitles = async () => {
        const resp = await api(null, serverUrl + "get/titles", 'get');
        if (resp.status === 200) {
            setTTitleList(resp.data.res);
        }
    }

    function closeAlert() {
        setErrorMessage("");
        setSuccessMessage("");
    }

    React.useEffect(() => {
        getTitles();
    }, [])

    return (
        <Box sx={{ flexGrow: 1 }}  >
            {(!showTitleScreen) &&
                <div>
                    <FormControl sx={{ m: 1, minWidth: 390 }} style={{ marginLeft: "-3px" }}>
                        <InputLabel id="demo-simple-select-label">Title</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={titleName ?? ""}
                            onChange={(e) => setTitleName(e?.target?.value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {titleList.map((data, i) => (
                                <MenuItem key={i} value={data.OptionTitleId}>
                                    {data.Title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button style={{ marginTop: "20px" }} variant="contained" onClick={() => setShowTitleScreen(true)}>Add Title</Button>

                    {subTitle.map((data, i) => (
                        <span key={i}>
                            <Grid container style={{ marginTop: "10px" }} >
                                <Grid item xs={5} >
                                    <TextField sx={{ width: '75%' }} id="outlined-basic" value={data} onChange={(e) => addSValue(e.target?.value, i, "")} label={"Sub Title " + i} variant="outlined" />
                                    <Button style={{ marginLeft: "5px", marginTop: "20px" }} sx={{ height: '1.5rem', width: '2rem', }} variant="outlined" onClick={() => removeRow(i, "")}>Delete</Button>
                                </Grid>
                            </Grid>
                        </span>
                    ))
                    }
                    <Stack spacing={2} direction="row" style={{ marginTop: "10px" }}>
                        <Button variant="contained" onClick={() => addRow("")}>Add row</Button>
                        <Button variant="contained" onClick={() => saveData("")}>Save </Button>
                    </Stack>
                </div>
            }
            {(showTitleScreen) &&
                <div>
                    {titles.map((data, i) => (
                        <span key={i}>
                            <Grid container style={{ marginTop: "10px" }} >
                                <Grid item xs={5} >
                                    <TextField sx={{ width: '75%' }} id="outlined-basic" value={data} onChange={(e) => addSValue(e.target?.value, i, 'title')} label={"Title " + i} variant="outlined" />
                                    <Button style={{ marginLeft: "5px", marginTop: "20px" }} sx={{ height: '1.5rem', width: '2rem', }} variant="outlined" onClick={() => removeRow(i, "title")}>Delete</Button>
                                </Grid>
                            </Grid>
                        </span>
                    ))
                    }

                    <Stack spacing={2} direction="row" style={{ marginTop: "10px" }}>
                        <Button variant="contained" onClick={() => addRow("title")}>Add row</Button>
                        <Button variant="contained" onClick={() => saveData("title")}>Save </Button>
                        <Button variant="contained" onClick={() => setShowTitleScreen(false)}>Cancel</Button>
                    </Stack>
                </div>
            }

            <br />
            {
                (errorMessage !== "") &&
                <Alert severity="error" onClose={() => closeAlert()}>{errorMessage}</Alert>
            }
            {
                (successMessage !== "") &&
                <Alert severity="success" onClose={() => closeAlert()} style={{ marginTop: "100px " }}>{successMessage}</Alert>
            }
        </Box >
    )

}