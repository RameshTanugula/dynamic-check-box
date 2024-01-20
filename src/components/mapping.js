import * as React from 'react'
import { useState } from 'react';
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
// import { Button, Checkbox, TextField } from '@mui/material';
import { Button, Checkbox, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableFooter, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function Mapping() {
  // const serverUrl = `http://localhost:8080/`
  const serverUrl = securedLocalStorage.baseUrl;
  const [checked, setChecked] = useState([]);
  const [allCheckBoxValue, setAllCheckBoxValue] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [qFrom, setQFrom] = useState(null);
  const [qTo, setQTo] = useState(null);
  const [catagoryData, setCategoryData] = useState([]);
  const [result, setResult] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRange, setIsRange] = useState(false);
  const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


//pagination

// const emptyRows =
// page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questionData.length) : 0;

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
  const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
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
  React.useEffect(() => {
      const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
      if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
          setReadAndWriteAccess(true);
      }
  }, []);

  return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
          <IconButton
              onClick={handleFirstPageButtonClick}
              disabled={page === 0 && !readAndWriteAccess}
              aria-label="first page"
          >
              {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
          </IconButton>
          <IconButton
              onClick={handleBackButtonClick}
              disabled={page === 0 && !readAndWriteAccess}
              aria-label="previous page"
          >
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
          <IconButton
              onClick={handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1 && !readAndWriteAccess}
              aria-label="next page"
          >
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>
          <IconButton
              onClick={handleLastPageButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1 && !readAndWriteAccess}
              aria-label="last page"
          >
              {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
          </IconButton>
      </Box>
  );
}


  const contentTypeList = [
    { label: "Content Type", value: null },
    { label: "Bit Bank", value: "bitbank" },
    { label: "Questions", value: "questions" },
    { label: "Statements", value: "statements" }];
  const getTagName = (id) => {
    return result?.find(r => r.id === +id)?.label;
  }

  React.useEffect(() => {
    async function fetchData() {
      // You can await here
      setLoading(true);
      const user = await api(null, serverUrl + 'get/users/' + type, 'get');
      if (user.status === 200) {
        // setSelectedUser(user.data.res[0].user);
        setUser(user.data.res);
        if (user?.data?.res[0]?.user && type) {
          const data = await api(null, serverUrl + 'get/data/' + type + '/' + user.data.res[0].user, 'get');
          if (data.status === 200) {
            setQuestionData(data.data?.res)
          }
        }
      }
      const catData = await api(null, serverUrl + 'get/categories', 'get');

      if (catData.status === 200) {
        setCategoryData(catData.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  React.useEffect(() => {
    const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
    const tmpData = { viewData: catagoryData }
    const tmpResult = tmpData.viewData.flatMap(flat);
    setResult([...tmpResult])
  }, [catagoryData])
  React.useEffect(() => {
    async function fetchData() {
      if (selectedUser && type) {
        setLoading(true);
        const data = await api(null, serverUrl + 'get/data/' + type + '/' + selectedUser, 'get');
        if (data.status === 200) {
          setQuestionData(data.data?.res)
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [type]);

  React.useEffect(() => {
    const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
    if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
      setReadAndWriteAccess(true);
    }
  }, []);
  const getQuestions = async () => {
    if (from && to) {
      setLoading(true);
      const data = await api(null, serverUrl + 'get/data/' + type + '/' + selectedUser + '/' + from + '/' + to, 'get');
      if (data.status === 200) {
        setQuestionData(data.data.res);
        setFrom("");
        setTo("");
      }
      setLoading(false);
    } else {
      alert('please try with from and to values')
    }
  }
  const getOtherQuestions = (qData) => {
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
              <span className='mcq1-left'>{String.fromCharCode(65 + i)}.{a} </span>
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
        {/* <span>A:  {String.fromCharCode(65 + i)}.{qData.part_a}</span> <br /> */}
        {/* <span>B: {qData.part_b}</span> */}
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
  const onClickCheckBox = (id, index) => {
    const globalIndex = page * rowsPerPage + index;
    console.log(globalIndex, id , 'mapping index');
    if (id && globalIndex >= 0) {
      setAllCheckBoxValue(false);
      questionData[globalIndex]['checked'] = !questionData[globalIndex]['checked'];
    } else {
      setAllCheckBoxValue(!allCheckBoxValue)
      questionData.map(q => q.checked = !allCheckBoxValue)
    }
    setQuestionData(questionData);
  }
  const removeTag = async (tagId, i, qId) => {
    setLoading(true);
    const data = await api({ tagToBeRemoved: tagId }, serverUrl + 'delete/tag/' + type + '/' + qId, 'put');
    if (data.status === 200) {
      const data = await api(null, serverUrl + 'get/data/' + type + '/' + selectedUser, 'get');
      if (data.status === 200) {
        setQuestionData(data.data.res);
      }
    }
    setLoading(false);
    // /delete/tag
  }
  const applyTags = async () => {
    const selectedQuestions = questionData.filter(q => q.checked)?.map(sq => sq.q_id)
    if (selectedQuestions?.length > 0 && checked?.length > 0) {

      // const catIds = generateCategoryIds(checked);
      const catIds = getExpandedKeys();
      setLoading(true);
      const data = await api({ selectedQuestions, checked: catIds, type }, serverUrl + 'add/tags', 'post');
      //comment for not allow unreview questions
      if (data.status === 200) {
        const data = await api(null, serverUrl + 'get/data/' + type + '/' + selectedUser, 'get');
        if (data.status === 200) {
          setQuestionData([...data.data.res]);
          setChecked([])
        }
      }
      setLoading(false);
    } else {
      alert('please select categories and question to apply tags')
    }
  }
  const removeDuplicates = (arr) => {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
  }
  const getTreePath = (model, id) => {
    let path,
      item = model.id;

    if (!model || typeof model !== 'object') {
      return;
    }

    if (model.id === id) {
      return [item];
    }

    (model.children || []).some(child => (path = getTreePath(child, id)));
    return path && [item, ...path];
  }

  const getExpandedKeys = () => {
    let expandedKeys = [];
    if (checked && checked.length > 0) {
      checked.forEach(k => {
        catagoryData.forEach(
          mt => {
            const result = getTreePath(mt, k);
            if (result) {
              expandedKeys.push(...result);
            }
          }
        );
      });
    }
    return removeDuplicates(expandedKeys);
  }

  // this.setExpandedKeys();
  //   const generateCategoryIds = (checkedIds) => {
  //     let selCatIds = [];
  //     if (checkedIds?.length > 0) {
  //       for (let i = 0; i < checkedIds.length; i++) {
  //         selCatIds = selCatIds.concat(getPath(result, checkedIds[i]));

  //       }
  //       return removeDuplicates(checkedIds.concat(selCatIds));
  //     }
  //     return [];
  //   }

  const applyTagsToQset = async () => {
    let selectedQuestions = [];
    questionData.map((q) => {
      if ((q.q_id >= from) && (q.q_id <= to)) {
        selectedQuestions.push(q.q_id);
      }
      return q;
    })
    if (selectedQuestions?.length > 0 && checked?.length > 0) {
      // const catIds = generateCategoryIds(checked);
      const catIds = getExpandedKeys();
      setLoading(true);
      const data = await api({ selectedQuestions, checked: catIds, type }, serverUrl + 'add/tags', 'post');
      if (data.status === 200) {
        setFrom("");
        setTo("");
        setChecked([]);
        const data = await api(null, serverUrl + 'get/data/' + type + '/' + selectedUser, 'get');
        if (data.status === 200) {
          setQuestionData(data.data.res);
        }
      }
      setLoading(false);
    } else {
      alert('please select categories and question to apply tags')
    }
  }
  //   function getPath(object, search) {

  //     if (object.id === search) return [object.id];
  //     else if ((object.children) || Array.isArray(object)) {
  //       let children = Array.isArray(object) ? object : object.children;
  //       for (let child of children) {
  //         let result = getPath(child, search);
  //         if (result) {
  //           if (object.id) result.unshift(object.id);
  //           return result;
  //         }
  //       }
  //     }
  //   }
  const onChangeUser = async (user) => {
    setSelectedUser(user);
    setQuestionData([])
    setLoading(true);
    const data = await api(null, serverUrl + 'get/data/' + type + '/' + user, 'get');
    if (data.status === 200) {
      setQuestionData(data.data?.res)
    }
    setLoading(false);
  }
  const onChangeRange = () => {
    setIsRange(!isRange);
    setFrom("");
    setTo("");
  }
  const onChangeType = async (type) => {
    setType(type);
    const user = await api(null, serverUrl + 'get/users/' + type, 'get');
    if (user.status === 200) {
      setUser(user.data.res);
    }
  }
  return (
    <>
      {/* {loading && <Loader />} */}
      {/* {loading && "Loading...!"} */}
      {<div>
        <div style={{}}>
        <span>
          <TextField
          select
          onChange={(e) => onChangeType(e.target.value)}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
        >
          {contentTypeList.map((c, i) => (
            <option key={i} value={c.value}>
              {c.label}
            </option>
          ))}
        </TextField>
          </span>
          &nbsp;&nbsp;<span>
          <TextField
          select
          onChange={(e) => onChangeUser(e.target.value)}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
        >
          <option value={""}>Select User</option>
          {user && user?.map((u, i) => (
            <option key={i} value={u.user}>
              {u.user}
            </option>
          ))}
        </TextField>
     
          </span>
          <span>
        <Checkbox
          type="checkbox"
          checked={isRange}
          onClick={() => onChangeRange()}
        />
        Select Range
      </span>
      &nbsp;
      <TextField
        // disabled={!readAndWriteAccess}
        placeholder="From:"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      &nbsp;&nbsp;
      <TextField
        // disabled={!readAndWriteAccess}
        placeholder="To:"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />&nbsp;&nbsp;
          {/* <span>
            <select disabled={!readAndWriteAccess} onChange={(e) => onChangeType(e.target.value)}>
            {contentTypeList.map((c, i) => {
              return (
                <option key={i} value={c.value}>{c.label}</option>
              )
            })}
          </select>
          </span>
          &nbsp;&nbsp;<span><select disabled={!readAndWriteAccess} value={selectedUser} onChange={(e) => onChangeUser(e.target.value)}>
            <option value={""}>Select User</option>
            {user && user?.map((u, i) => {
              return (
                <option key={i} value={u.user}>{u.user}</option>
              )
            })}
          </select>
          </span>
          <span><input disabled={!readAndWriteAccess} type="checkbox" checked={isRange} onClick={() => onChangeRange()} /> Select Range</span>
          {/* <span>Questions:<input type="checkbox" checked={type==="questions"} onClick={()=>setType("questions")}/>
           BitBank:<input type="checkbox" checked={type==="bitbank"} onClick={()=>setType("bitbank")}/> </span> */}

          {/* &nbsp;&nbsp;&nbsp;&nbsp;<input disabled={!readAndWriteAccess} placeholder='From:' type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
          &nbsp;&nbsp;<input disabled={!readAndWriteAccess} type="text" placeholder='To:' value={to} onChange={(e) => setTo(e.target.value)} /> */}
          &nbsp;&nbsp;&nbsp;{!isRange && <Button variant="outlined"  onClick={() => { (!isRange && from && to) ? applyTagsToQset() : applyTags() }}>Add Tags</Button>}
          {isRange && <Button variant="outlined" onClick={() => { getQuestions() }}>Get Questions</Button>}

        </div>
        {/* <button onClick={() => { applyTags() }}>Apply Tags</button> */}

        <div style={{ marginTop:'20px', height: '30rem',  width: '65%', float: 'left' , overflow: 'auto' }}>

          {/* <div style={{ marginTop: '2%', paddingLeft: '10%' }}>
          <span>From:</span><input type="text" value={qFrom} onChange={(e) => setQFrom(e.target.value)} />
          <span>To:</span><input type="text" value={qTo} onChange={(e) => setQTo(e.target.value)} /><br /><br />
          <button onClick={() => { applyTagsToQset() }}>Apply Tags </button>

        </div> */}
           {/* <div>
          {questionData?.length > 0 &&
            questionData?.map((qData, i) => {
              return (
                <div style={{ padding: '5px' }}>

                  <div style={{ display: 'flex' }}>
                    <div>
                      <span>{qData.q_id}.</span>
                      <input disabled={!readAndWriteAccess} checked={qData.checked} onClick={() => onClickCheckBox(qData.q_id, i)} type="checkbox" /></div>
                    <div style={{
                      paddingTop: '5px',
                      border: '1px solid blue',
                      width: '80%'
                    }}> */}

                      {/* <span>Question: {qData.question}</span> <br />
                      <span>Answer: {qData.answer}</span> */}
                      {/* {(!qData.type || (qData.type === "null")) && getOtherQuestions(qData)}
                      {(qData.type === 'MCQ1') && getMCQ1Questions(qData)}
                      {(qData.type === 'MCQ2') && getMCQ2Questions(qData)}
                      {(qData.type === 'IMG') && getImageQuestions(qData)}

                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    {qData.tags &&
                      qData.tags?.split(',')?.sort()?.map((tg, j) =>
                        <div style={{ paddingRight: '5px' }}>
                          {tg !== '' && <span><button disabled={!readAndWriteAccess} onClick={() => removeTag(tg, j, qData.q_id)}>{getTagName(tg)} X</button></span>}
                        </div>)}
                  </div>
                </div>)
            })
          }</div> */}


            {/* //mapping table with pagination */}
           
          {questionData?.length > 0 && (
        <div>
          <TableContainer component={Paper}>
          {questionData?.length > 0 && <><p>Select All:</p><input disabled={!readAndWriteAccess} checked={allCheckBoxValue} value={allCheckBoxValue} onClick={() => onClickCheckBox()} type="checkbox" /></>}


            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Tags</TableCell>                
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0 ? questionData.slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage):questionData
                  ).map((row, i) => (
          <TableRow key={row.q_id}>
          <TableCell>
          {(page * rowsPerPage) + i + 1}
            </TableCell>
          <TableCell>
            <Checkbox
              // disabled={!readAndWriteAccess}
              checked={row.checked}
              onClick={() => onClickCheckBox(row.q_id, i)}
              color="primary"
            />
          </TableCell>
          <TableCell>{(!row.type || (row.type === "null")) && getOtherQuestions(row)}
                      {(row.type === 'MCQ1') && getMCQ1Questions(row)}
                      {(row.type === 'MCQ2') && getMCQ2Questions(row)}
                      {(row.type === 'IMG') && getImageQuestions(row)}
            </TableCell>
          <TableCell>
            {row.tags &&
              row.tags?.split(',')?.sort()?.map((tg, j) => (
                <div key={j} style={{ paddingRight: '5px' }}>
                  {tg !== '' && (
                    <span>
                      <button
                        disabled={!readAndWriteAccess}
                        onClick={() => removeTag(tg, j, row.q_id)}
                      >
                        {getTagName(tg)} X
                      </button>
                    </span>
                  )}
                </div>
              ))}
          </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )} */}
              <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100, { label: 'All', value: -1 }]}
                                    colSpan={5}
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
                                    // disabled={!readAndWriteAccess}
                                />
                            </TableRow>
                        </TableFooter>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {/* <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          <span>{`Page ${page}`}</span>
          <Button onClick={() => setPage(page + 1)} disabled={questionData.length < rowsPerPage}>
            Next
          </Button> */}
        </div>
      )}

        </div>
        <div style={{ height: '30rem', width: '20%', float: 'right', paddingRight: '5%', overflow: 'auto' }}>
          {catagoryData?.length > 0 && <CheckboxTree
            // nodes={treeViewData}
            nodes={catagoryData}
            checked={checked}
            onCheck={checked => setChecked(checked)}
            onClick={(e) => onClickCheckBox(e)}
            disabled={!readAndWriteAccess}
          />}
        </div>

      </div>}
    </>
  )
}