import * as React from 'react'
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import './common.css';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SnackBar from './SnackBar';
import Loader from './Loader';
import AddNewQuestions from './AddNewQuestion';
import { Dialog, DialogContent, Modal } from '@mui/material';
import { Button, Checkbox, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableFooter, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// import QuestionPreview from './questionPreview';
import { useParams } from 'react-router-dom';
import DraftPreview from './Test/draftPreview';


export default function DraftTest() {
    const { id } = useParams();

    // const serverUrl = `http://localhost:8080/test/`
    const serverUrl1 = securedLocalStorage.baseUrl;
    const serverUrl = securedLocalStorage.baseUrl + 'test/';
    const [checked, setChecked] = React.useState([]);
    const [allCheckBoxValue, setAllCheckBoxValue] = React.useState(false);
    const [questionData, setQuestionData] = React.useState([]);
    const [selectedQuestionsList, setSelectedQuestionsList] = React.useState([]);
    // const [showForm, setShowForm] = React.useState(true);
    const [catagoryData, setCategoryData] = React.useState([]);
    const [result, setResult] = React.useState([]);
    // const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [showLoader, setShowLoader] = React.useState(false);
    const [isAddNewQuestionsModalOpen, setAddNewQuestionsModalOpen] = React.useState(false);
    const [manualQuestions, setManualQuestions] = React.useState([])
    const [isPreviewOpen, setPreviewOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedQuestionsData, setSelectedQuestionsData] = React.useState([])
    const [draftData, setDraftData] = React.useState([]);
    const [openFormModal, setOpenFormModal] = React.useState(false);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const BpIcon = styled('span')(({ theme }) => ({
        borderRadius: '50%',
        width: '65%',
        height: 16,
        boxShadow:
            theme.palette.mode === 'dark'
                ? '0 0 0 1px rgb(16 22 26 / 40%)'
                : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
        backgroundImage:
            theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
                : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background:
                theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
        },
    }));

    const BpCheckedIcon = styled(BpIcon)({
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    });

    function TablePaginationActions(props) {
        // const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
        const theme = useTheme();
        const { count, page, rowsPerPage, onPageChange } = props;

        const handleFirstPageButtonClick = (event) => {
            onPageChange(event, 0);
        };

        const handleBackButtonClick = (event) => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = (event) => {
            onPageChange(event, page + 1);
        };

        const handleLastPageButtonClick = (event) => {
            onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };


        return (
            <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="first page"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page === 0 }
                    aria-label="previous page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1 }
                    aria-label="next page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1 }
                    aria-label="last page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </Box>
        );
    }
    
    
    //categories




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
       
    

        React.useEffect(() => {
        async function fetchData() {
            setShowLoader(true);
            const data = await api(null, serverUrl + 'get/data', 'get');            
            setShowLoader(true);
            const catData = await api(null, serverUrl + 'get/categories', 'get');
            if (catData.status === 200) {
                setCategoryData(catData.data);
            }
            const data1 = await api(null, serverUrl + 'list/draft/bytestid/' + id, 'get');
            setSelectedQuestionsList([])
            if (data1.status === 200) {
                // const editTestData = data1.find((q) => q.id === id)
                data1.data.map((d)=>{
                    d.q_id = d.id
                    
                return d;
                })
                setSelectedQuestionsList([...data1.data?.map(q=>q=q.id)]); 
                // console.log(selectedQuestionsList, 'list **69');
                setDraftData([...data1.data])
                console.log(draftData,'&&&&');
                //  setSelectedQuestionsData(draftData)
                //  console.log(selectedQuestionsData, 'hfgcf');
               
            }   
            if (data.status === 200) {
                setQuestionData(data.data?.res)


            }
            setShowLoader(false);
           
        }fetchData(); 
        ;// Call the fetchData function
        },[]);

        React.useEffect(() => {
            async function getData() {
                const catIds = prepareCatIds();
                setShowLoader(true);
                const data = await api({ catIds: catIds }, serverUrl + 'get/questions/bycategory', 'post');
                if (data.status === 200) {
                    setQuestionData(data.data?.res)
                }
                setShowLoader(false);
            }
            getData();
        }, [checked]);
    

    
    const onClickCheckBox = (id, i) => {
        console.log(id, 'id');
        const index = page * rowsPerPage + i;
        // const Data = 
        if (id && index >= 0) {
            setAllCheckBoxValue(false);
            if (selectedQuestionsList.includes(id)) {
                var Index = selectedQuestionsList.findIndex(x => x === id);
                selectedQuestionsList.splice(Index, 1);
                setSelectedQuestionsList([...selectedQuestionsList]);
            }
            else {
                if (selectedQuestionsList.length + manualQuestions.length < draftData[0]?.no_of_questions) {
                    selectedQuestionsList.push(id) //,  qData
                    const selectedQuestion = questionData.find((q) => q.q_id === id)
                    setSelectedQuestionsList([...selectedQuestionsList]);
                    selectedQuestionsData.push(selectedQuestion)
                    setSelectedQuestionsData(selectedQuestionsData)
                }else {
                    alert(`You are able select maximum ${draftData[0].no_of_questions} questions only.`)
                }

               

            }
        } else {
            setAllCheckBoxValue(!allCheckBoxValue)
            questionData.map(q => q.checked = !allCheckBoxValue)
        }
        setQuestionData(questionData);

    }


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
          });
      };
    
      const handleDateChange = (e) => {
        setFormData({
          ...formData,
          scheduled_date: e !== null ? CheckAccess.getDateInFormat(e) : null,
        });
      };

      const submitTestForm = () => {
        // Your form submission logic here using draftData
        console.log('Form submitted:', draftData);
        setFormData({ ...formData }); // Update formData with draftData
        handleCloseFormModal();
      };

    const handleOpenFormModal = () => {
        setOpenFormModal(true);
      };
    
      const handleCloseFormModal = () => {
        setOpenFormModal(false);
      };

      const date = new Date(draftData[0]?.scheduled_date);

let formattedDate = formatDate(date);

function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');

  return `${year}-${month}-${day} 00:00:00`;
}
    
    
    const [formData, setFormData] = React.useState({
        test_name: '',
        test_duration: '',
        test_description:'',
        no_of_attempts: '',
        scheduled_date: null,
      });
      React.useEffect(() => {
        setFormData({
          test_name: draftData[0]?.test_name || '',
          test_duration: draftData[0]?.test_duration || '',
          test_description: draftData[0]?.test_description || '',
          no_of_attempts: draftData[0]?.no_of_attempts || '',
          scheduled_date: formattedDate || null,
        });
      }, [draftData]);
               
    const addToTestHandler = async (isDraft) => {
            setShowLoader(true);

            const resp = await api(null, serverUrl1 + "test/delete/" + id, 'delete');
            if (resp.status === 200) {

        let manualQIds = [];
        if (manualQuestions?.length > 0) {
            for (let i = 0; i < manualQuestions.length; i++) {
                const data1 = await api(manualQuestions[i], securedLocalStorage.baseUrl + 'question/' + 'create/questions/mcq', 'post');
                if (data1.status === 200) {
                    manualQIds.push(data1.data.res.insertId)
                }   
            }
        }


          const payload = {
            ...formData,
            // test_name: draftData[0].test_name,
            no_of_questions: draftData[0].no_of_questions,
            question_ids: selectedQuestionsList.concat(manualQIds),
            is_online: draftData[0].is_online === 1 ? true : false,
            is_omr: draftData[0].is_omr === 1 ? true : false,
            is_active: isDraft ? 2 : 1, // 2 for draft, 1 for active,
            created_by: 1,
            update_by: 1
        }
        console.log(payload, 'payload***355');
        const data = await api(payload, serverUrl + 'add/test', 'post');
        if (data.status === 200) {
            setSelectedQuestionsList([]);
            setOpenSnackBar(true);
            setManualQuestions([])
            const message = {
                type: "success",
                message: isDraft ? "Test draft created successfully!" : "Test added successfully!..."
            };
    
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
    }else{
        setOpenSnackBar(true);
        const message = {
            type: "error",
            message: "Add test failed"
        }
        setSnackBarData(message);
    }
    }

    function closeSnakBar() {
        setOpenSnackBar(false)
    }

    React.useEffect(() => {
        const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
        const tmpData = { viewData: catagoryData }
        const tmpResult = tmpData.viewData.flatMap(flat);
        setResult([...tmpResult])
    }, [catagoryData]);



    const getQuestions = (qData) => {
        return (
            <>
                <span>Question: {qData.question}</span>
                <br />
                <span>Answer: {qData.answer}</span>
            </>
        )
    }
    const getMCQ1Questions = (row) => {
        return (
            <><span>Question: {row.question}</span>
                <br />
                {row.part_a && row.part_b && <div>

                    <span className='mcq1-left'>PART A</span>

                    <span className='mcq1-left'>PART B</span>
                </div>}
                {row.part_a && row.part_b && row.part_a?.split(',').map((a, i) => {
                    return (<div >
                        <br />
                        <div style={{ width: "100%" }} >
                            <span className='mcq1-left'>{String.fromCharCode(65 + i)}. {a} </span>
                            <span className='mcq1-right'>  &nbsp;&nbsp;&nbsp;&nbsp; {i + 1}. {row.part_b?.split(',')[i]} </span>
                        </div>
                    </div>)
                })
                }
                <br />
                <div style={{ paddingTop: '6rem', fontWeight: 600 }}>
                    <span>Answer: {row.answer}</span>
                </div>
            </>
        )
    }
    const getMCQ2Questions = (qData) => {
        return (
            <>
                <span>Question: {qData.question}</span> <br />
                <div>
                  {qData.part_a && qData.part_a?.split(',').map((a, i) => (
                   <div key={i}>
                        <br />
                       <div style={{ width: "100%" }}>
                      <span>{String.fromCharCode(65 + i)}.{a}</span>
         
                       </div>
                   </div>
                   ))}
                 </div>
                <br />
                {/* <span>B: {qData.part_b}</span> */}
                <br />
                <span>Answer: {qData.answer}</span>
            </>
        )
    }
    const getImageQuestions = (qData) => {
        return (
            <>
                <div>Question: {qData.question}</div>
                <div>
                    <img style={{
                        height: '10rem',
                        width: 'auto'
                    }} src={qData.QUrls} />
                </div>
                <br />
                <span>Answer: {qData.answer}</span>
            </>
        )
    }
    const openAddNewQuestionsModal = () => {
        setAddNewQuestionsModalOpen(true);
    };
    const closeAddNewQuestionsModal = (data) => {
        setManualQuestions(manualQuestions.concat(data))
        setAddNewQuestionsModalOpen(false);
    };

    const closePreviewForm = () => {
        setPreviewOpen(false);
    };

    const openPreviewForm = () => {
        if (selectedQuestionsList.length + manualQuestions.length > 0) {
            const selectedQData = questionData.filter(question => selectedQuestionsList.includes(question.q_id ));
            console.log(manualQuestions, draftData,selectedQData, '**473');
            // console.log(selectedQData, 'selectedQData');
            // setSelectedQuestionsData(draftData.concat(manualQuestions, selectedQuestionsData));
            // setSelectedQuestionsData(selectedQuestionsData.concat( manualQuestions, draftData));
            setSelectedQuestionsData(selectedQData.concat( manualQuestions));
            console.log(selectedQuestionsData ,"iuhgyhvb");
            setPreviewOpen(true);
        } else {
            console.error("selectedQuestionsList is empty.");
        }
    };


    const handleDeleteQuestion = (questionId, questionTitle) => {
          const isQuestionExist = selectedQuestionsList.find(id => id === questionId);
           console.log(isQuestionExist, 'isQuestionExist', selectedQuestionsList , typeof(selectedQuestionsList[0]));

           if (isQuestionExist) {
            const draftQuestion = draftData.filter((q) =>q.q_id !== questionId)
            const updatedQuestionsList = selectedQuestionsList.filter(id => id !== questionId);
            const updatedQuestionsData = selectedQuestionsData.filter(question => question.q_id !== questionId);
            setDraftData([...draftQuestion]);
            setSelectedQuestionsList([...updatedQuestionsList]);
            setSelectedQuestionsData([...updatedQuestionsData]);
        } else {
            // Remove manual question with matching title
            const updatedQuestionsListByTitle = selectedQuestionsList.filter(question => question.title !== questionId);
            const updatedQuestionsDataByTitle = selectedQuestionsData.filter(question => question.title !== questionId);
            const Questions = manualQuestions.filter((q)=>q.title !== questionId)
            setSelectedQuestionsList(updatedQuestionsListByTitle);
            setSelectedQuestionsData(updatedQuestionsDataByTitle);
            setManualQuestions(Questions)
            
        }
    };
    
    return (
        <div>
            {
                <Grid container spacing={1} >
                    <Grid item xs={12} style={{ position: "absolute", right: "50px" , marginBottom:"30px"}}>
                        <Stack spacing={4} direction="row" sx={{ color: 'action.active' }}>
                        <Button variant="contained" onClick={handleOpenFormModal} >Edit Form</Button>
                            <Button variant="contained" disabled={selectedQuestionsList.length + manualQuestions.length  >= draftData[0]?.no_of_questions} onClick={openAddNewQuestionsModal}>Add New Question</Button>
                            <Button variant="contained"  onClick={openPreviewForm} >Preview</Button>
                            <Button variant='contained' disabled={selectedQuestionsList.length + manualQuestions.length  >= draftData[0]?.no_of_questions} onClick={()=>addToTestHandler(true)} >Draft Test</Button>
                            <Button variant="contained" disabled={selectedQuestionsList.length + manualQuestions.length < draftData[0]?.no_of_questions} onClick={() => addToTestHandler()}>Add Test</Button>
                            <Badge color="secondary" badgeContent={selectedQuestionsList.length + manualQuestions.length }>
                                <span style={{ marginTop: "7px" }}> <ShoppingCartIcon /></span>
                            </Badge>
                        </Stack>
                    </Grid>
                    {isAddNewQuestionsModalOpen && (
                        <AddNewQuestions isOpen={isAddNewQuestionsModalOpen} onClose={closeAddNewQuestionsModal} />
                    )}
                    <Grid item xs={1} style={{ width: '100%', float: 'left', paddingLeft: '5%', paddingTop: '5%' }}>
                        {catagoryData?.length > 0 && <CheckboxTree
                            // nodes={treeViewData}
                            nodes={catagoryData}
                            checked={checked}
                            onCheck={checked => setChecked(checked)}
                            onClick={(e) => onClickCheckBox(e)}
                            // disabled={!readAndWriteAccess}
                        />
                        }
                    </Grid>


                    <Grid item xs={12} style={{ overflow: "auto", height: "900px", marginTop: "60px" }} >
                        {questionData?.length > 0 &&
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                Action
                                            </TableCell>
                                            <TableCell align="center">Questions </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {(rowsPerPage > 0 ? questionData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : questionData
                                        ).map((qData, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="center">
                                                    <span>
                                                        <input
                                                            style={{ cursor: "pointer" }}
                                                            // disabled={!readAndWriteAccess}
                                                            checked={selectedQuestionsList.includes(qData.q_id)}
                                                            onClick={() => onClickCheckBox(qData.q_id, i)}
                                                            type="checkbox"
                                                        />
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {/* Render your statements here based on the question type */}
                                                    {((!qData.type) || (qData.type === "null")) && getQuestions(qData)}
                                                    {(qData.type === 'MCQ1') && getMCQ1Questions(qData)}
                                                    {(qData.type === 'MCQ2') && getMCQ2Questions(qData)}
                                                    {(qData.type === 'IMG') && getImageQuestions(qData)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        }
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[10, 25, 50, 100,1000, { label: 'All', value: -1 }]}
                                                colSpan={4}
                                                count={questionData.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                SelectProps={{
                                                    inputProps: {
                                                        'aria-label': 'questionData per page',
                                                    },
                                                    native: true,
                                                }}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                ActionsComponent={TablePaginationActions}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>}
                      
                    </Grid>
                </Grid>}

      <Modal open={openFormModal} onClose={handleCloseFormModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Test Name"
              required
              id="outlined-start-adornment"
              sx={{ width: '100%' }}
              value={formData.test_name}
              onChange={handleChange}
              name="test_name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Test Duration"
              required
              id="outlined-start-adornment"
              sx={{ width: '100%' }}
              value={formData.test_duration}
              onChange={handleChange}
              name="test_duration"
              type="number"
               readOnly={false}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Number Of Attempts"
              id="outlined-start-adornment"
              sx={{ width: '100%' }}
              value={formData.no_of_attempts}
              onChange={handleChange}
              name="no_of_attempts"
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Scheduled Date"
                value={formData.scheduled_date}
                name = "scheduled_date"
                inputFormat="DD/MM/YYYY"
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Test Description"
              required
              id="outlined-start-adornment"
              sx={{ width: '100%' }}
              value={formData.test_description}
              onChange={handleChange}
              name="test_description"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={handleCloseFormModal}>
                Cancel
              </Button>
              <Button variant="contained" onClick={submitTestForm}>
                Save
              </Button>
            </Stack>
          </Grid>

          </Grid>
        </Box>
      </Modal>
            {/* QuestionPreviewDialog */}
            <Dialog open={isPreviewOpen} onClose={closePreviewForm} maxWidth="md" fullWidth>
                <DialogContent>
                    <DraftPreview selectedQuestionsList={selectedQuestionsData} onClose={closePreviewForm} onDelete={handleDeleteQuestion} />
                </DialogContent>
            </Dialog>


            {openSnackBar && <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />}
            {showLoader &&
                <Loader />
            }

        </div>
    )
}
// export default DraftTest