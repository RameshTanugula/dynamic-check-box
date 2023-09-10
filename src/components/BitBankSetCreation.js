import * as React from 'react'
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import './common.css';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Stack, Button, Grid, TextField, Checkbox, Box, Typography, Modal } from '@mui/material';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
import SnackBar from './SnackBar';
import Loader from './Loader';
// import Checkbox from '@mui/material/Checkbox';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function BitbankSetCreation() {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    // const serverUrl = `http://localhost:8080/test/`
    const serverUrl = securedLocalStorage.baseUrl + 'test/';
    const [checked, setChecked] = React.useState([]);
    const [allCheckBoxValue, setAllCheckBoxValue] = React.useState(false);
    const [questionData, setQuestionData] = React.useState([]);
    const [selectedQuestionsList, setSelectedQuestionsList] = React.useState([]);
    const [catagoryData, setCategoryData] = React.useState([]);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [showLoader, setShowLoader] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const fields = {
        title: ""
    }
    const [formData, setFormData] = React.useState(fields);

    async function fetchData() {
        setShowLoader(true);
        // const data = await api(null, serverUrl + 'set/bitbank/data', 'get');
        const catData = await api(null, serverUrl + 'get/categories', 'get');
        if (catData.status === 200) {
            setCategoryData(catData.data);
        }
        // if (data.status === 200) {
        //     setQuestionData(data.data?.res)
        // }
    }
    const onCloseMOdal = () => {
        setOpenModal(false);
    }


    const prepareCatIds = () => {
        let ids1 = [];
        let ids2 = [];
        let ids3 = [];
        let ids4 = [];
        const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
        if (catagoryData && catagoryData.length > 0) {
            const l1 = { viewData: [catagoryData[0]] };
            const l2 = { viewData: [catagoryData[1]] };
            const l3 = { viewData: [catagoryData[2]] };
            const l4 = { viewData: [catagoryData[3]] };
            const tmpResult1 = l1.viewData.flatMap(flat);
            const tmpResult2 = l2.viewData.flatMap(flat);
            const tmpResult3 = l3.viewData.flatMap(flat);
            const tmpResult4 = l4.viewData.flatMap(flat);
            const examCatIds = tmpResult1.map(e => e.id);
            const subjectCatIds = tmpResult2.map(e => e.id);
            const conceptCatIds = tmpResult3.map(e => e.id);
            const sourceCatIds = tmpResult4.map(e => e.id);

            for (let i = 0; i < checked.length; i++) {
                const examIdExist = examCatIds.find(ec => ec === checked[i]);
                const subIdExist = subjectCatIds.find(sc => sc === checked[i]);
                const conceptIdExist = conceptCatIds.find(cc => cc === checked[i]);
                const sourceIdExist = sourceCatIds.find(soc => soc === checked[i]);
                if (examIdExist) {
                    ids1.push(checked[i]);
                }
                if (subIdExist) {
                    ids2.push(checked[i]);
                }
                if (conceptIdExist) {
                    ids3.push(checked[i]);
                }
                if (sourceIdExist) {
                    ids4.push(checked[i]);
                }
            }

        }
        return [ids1, ids2, ids3, ids4]
    }
    const onClickCheckBox = (id, index) => {
        if (selectedQuestionsList.includes(id)) {
            var Index = selectedQuestionsList.findIndex(x => x === id);
            selectedQuestionsList.splice(Index, 1);
            setSelectedQuestionsList([...selectedQuestionsList]);
        }
        else {
            selectedQuestionsList.push(id)
            setSelectedQuestionsList([...selectedQuestionsList]);

        }
        setAllCheckBoxValue(!allCheckBoxValue)
        questionData.map(q => q.checked = !allCheckBoxValue)
        setQuestionData(questionData);
    }
    const oepnModalPopup = () => {
        setOpenModal(true);
    }
    const addToTestHandler = async () => {
        setOpenModal(false)
        const payload = {
            title:formData.title,
            selected_bitbank_ids: selectedQuestionsList,
        }
        setShowLoader(true);
        const data = await api(payload, serverUrl + 'add/test_bitbank', 'post');
        if (data.status === 200) {
            setSelectedQuestionsList([]);
            setFormData(fields)
            setOpenSnackBar(true);
            const message = {
                type: "success",
                message: "Test added successfully!..."
            }
            setSnackBarData(message);
        }
        else {
            setOpenSnackBar(true);
            const message = {
                type: "error",
                message: data.response.data.error
            }
            setSnackBarData(message);
        }
        setShowLoader(false);
    }

    function closeSnakBar() {
        setOpenSnackBar(false)
    }


    function handleChange(e) {
        const newData = {
            ...formData,
            [e.target.name]: e.target.value

        }
        setFormData(newData);
    }

    React.useEffect(() => {
        const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
        const tmpData = { viewData: catagoryData }
        const tmpResult = tmpData.viewData.flatMap(flat);
        // setResult([...tmpResult])
    }, [catagoryData]);



    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
        fetchData();
    }, []);
    React.useEffect(() => {
        async function getData() {
            const catIds = prepareCatIds();
            setShowLoader(true);
            let data;
            if (catIds && ((catIds[0] && catIds[0].length > 0)) || (catIds[1] && catIds[1].length > 0)
                || (catIds[2] && catIds[2].length > 0) || (catIds[3] && catIds[3].length > 0)) {
                data = await api({ catIds: catIds }, serverUrl + 'get/bitbank/bycategory', 'post');
            } else {
                data = await api(null, serverUrl + 'set/bitbank/data', 'get');
            }
            if (data.status === 200) {
                setQuestionData(data.data?.res)
            }

            setShowLoader(false);
        }
        getData();
    }, [checked]);
    const getQuestions = (qData) => {
        return (
            <>
                <span>Question: {qData.question}</span>
                <br />
                <span>Answer: {qData.answer}</span>
            </>
        )
    }

    return (
        <div>
            {
                <Grid container spacing={1} >
                    <Grid item xs={12} >
                        <Stack spacing={8} direction="row" sx={{ color: 'action.active' }}>
                            <TextField
                                style={{
                                    width: "50%"
                                }}
                                label="Set Name"
                                required
                                id="outlined-start-adornment"
                                value={formData.title}
                                onChange={handleChange}
                                name="title"
                                error={false}
                                helperText={"" !== "" ? 'Test Name is reuired' : ' '}
                                disabled={!readAndWriteAccess}
                            />
                            <Button variant="contained" style={{ height: 'max-content' }} disabled={formData.title === "" || selectedQuestionsList.length===0} onClick={() => oepnModalPopup()}>Add Test</Button>
                            <Badge color="secondary" badgeContent={selectedQuestionsList.length}>
                                <span style={{ marginTop: "7px" }}> <ShoppingCartIcon /></span>
                            </Badge>
                        </Stack>
                    </Grid>
                    <Grid item xs={1} style={{ width: '100%', float: 'left', paddingLeft: '5%', paddingTop: '5%' }}>
                        {catagoryData?.length > 0 && <CheckboxTree
                            // nodes={treeViewData}
                            nodes={catagoryData}
                            checked={checked}
                            onCheck={checked => setChecked(checked)}
                            onClick={(e) => onClickCheckBox(e)}
                            disabled={!readAndWriteAccess}
                        />
                        }
                    </Grid>

                    <Grid item xs={12} style={{ overflow: "auto", height: "900px", marginTop: "10px" }} >
                        {questionData?.length > 0 &&
                            questionData?.map((qData, i) => {
                                return (
                                    <div style={{ padding: '5px' }} key={i}>

                                        <div>
                                            <div>
                                                <Checkbox {...label}
                                                    disabled={!readAndWriteAccess}
                                                    checked={selectedQuestionsList.includes(qData.q_id)}
                                                    onClick={() => onClickCheckBox(qData.q_id, i)}
                                                />
                                            </div>
                                            {/* <div><input style={{ cursor: "pointer" }} disabled={!readAndWriteAccess} checked={selectedQuestionsList.includes(qData.q_id)} onClick={() => onClickCheckBox(qData.q_id, i)} type="checkbox" /></div> */}

                                            <div style={{
                                                paddingTop: '5px',
                                                border: '1px solid blue'
                                            }}>
                                                {getQuestions(qData)}

                                            </div>
                                        </div>

                                    </div>)
                            })
                        }
                    </Grid>
                </Grid>}


            {openSnackBar && <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />}
            {showLoader &&
                <Loader />
            }

            <Modal
                open={openModal}
                onClose={onCloseMOdal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        You have selected {selectedQuestionsList.length} questons...!
                    </Typography>

                    <Button variant="contained" disabled={!readAndWriteAccess} onClick={() => onCloseMOdal()}>close</Button> &nbsp;
                    <Button variant="contained" disabled={!readAndWriteAccess} onClick={() => addToTestHandler()}>Save</Button>
                </Box>
            </Modal>

        </div>
    )
}