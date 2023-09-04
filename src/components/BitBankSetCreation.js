import * as React from 'react'
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import './common.css';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import SnackBar from './SnackBar';
import Loader from './Loader';
import Checkbox from '@mui/material/Checkbox';


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
    const [numberOfQuestions, setNumberOfQuestions] = React.useState(0)

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
        setShowLoader(false);
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
        if (id && index >= 0) {
            setAllCheckBoxValue(false);
            if (selectedQuestionsList.includes(id)) {
                var Index = selectedQuestionsList.findIndex(x => x === id);
                selectedQuestionsList.splice(Index, 1);
                setSelectedQuestionsList([...selectedQuestionsList]);
            }
            else {
                if (selectedQuestionsList.length < parseInt(numberOfQuestions)) {
                    selectedQuestionsList.push(id)
                    setSelectedQuestionsList([...selectedQuestionsList]);
                }
                else {
                    alert(`You are able select maximum ${numberOfQuestions} questions only.`)
                }

            }
        } else {
            setAllCheckBoxValue(!allCheckBoxValue)
            questionData.map(q => q.checked = !allCheckBoxValue)
        }
        setQuestionData(questionData);
    }

    const addToTestHandler = async () => {
        const payload = {
            title: "",

            no_of_questions: 10,
        }
        setShowLoader(true);
        const data = await api(payload, serverUrl + 'add/test', 'post');
        if (data.status === 200) {
            setSelectedQuestionsList([]);
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

    React.useEffect(() => {
        const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
        const tmpData = { viewData: catagoryData }
        const tmpResult = tmpData.viewData.flatMap(flat);
        // setResult([...tmpResult])
    }, [catagoryData]);

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

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
        fetchData();
    }, []);
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
                                value={""}
                                onChange={null}
                                name="setName"
                                error={false}
                                helperText={"" !== "" ? 'Test Name is reuired' : ' '}
                                disabled={!readAndWriteAccess}
                            />
                            <Button variant="contained" style={{ height: 'max-content' }} disabled={selectedQuestionsList.length !== parseInt(numberOfQuestions)} onClick={() => addToTestHandler()}>Add Test</Button>
                            <Badge color="secondary" badgeContent={selectedQuestionsList.length + "/" + parseInt(numberOfQuestions)}>
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

        </div>
    )
}