import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, IconButton, TableFooter, TablePagination } from '@mui/material';
import api from '../../services/api';
import * as securedLocalStorage from "../SecureLocalaStorage";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';  
import Loader from '../Loader';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SnackBar from '../SnackBar';

const BitBankGroupList = () => {
  const serverUrl1 = securedLocalStorage.baseUrl;
  const serverUrl = securedLocalStorage.baseUrl + 'test/';
  const [data , setData] =useState([])
  const [showLoader, setShowLoader] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarData, setSnackBarData] = React.useState();
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

useEffect(()=>{
  const fetchData = async () => {
    setShowLoader(true)
  const data = await api(null, serverUrl + 'bitbank/set', 'get');
  setShowLoader(false)
  // console.log(data , 'bittttt');
  if(data.status === 200){
    setData(data.data)
  // console.log(data , 'data');
      // // Calculate total number of questions
      // const totalCount = data.data.reduce((acc, row) => acc + row.payload, 0);
      // console.log(totalCount , ' count');
      // setTotalQuestions(totalCount)
  }
  }
  fetchData();
},[])

// const handleDelete = (id) => {
// }
// async function deleteTest(row) {
 
//   const resp = await api(null, serverUrl + "test/delete/" + row.id, 'delete');
//  console.log(resp , 'response');
//   if (resp.status === 200) {
//       setOpenSnackBar(true);
//       const data = {
//           type: "success",
//           message: row.test_name + " deleted successfully...!"
//       }
//       setSnackBarData(data);
//        getTestData();
//   }

  async function handleDelete(row){
   let a = data.filter((q) => q.id === row );
    const resp = await api(null, serverUrl + 'bitbank/set/'+ row, 'delete');
    if(resp.status === 200) {
      setOpenSnackBar(true);
      const data = {
          type: "success",
          message: row.title + " deleted successfully...!"
      }
      setSnackBarData(data);
      // setData()
      // Remove the deleted row from the data state
    setData(prevData => prevData.filter(item => item.title !== row.title));

    }
  }

//   function exportToWord(row) {
//     const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
//         "xmlns:w='urn:schemas-microsoft-com:office:word' " +
//         "xmlns='http://www.w3.org/TR/REC-html40'>" +
//         "<head><meta charset='utf-8'></head><body>";
//     const footer = "</body></html>";
//     const groupData = JSON.parse(row.payload); // Assuming payload is a JSON string
//     const groupContent = /* Customize this part based on the structure of your group data */ "";

//     const sourceHTML = header + groupContent + footer;
//     const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
//     const fileDownload = document.createElement("a");
    
//     document.body.appendChild(fileDownload);
//     fileDownload.href = source;
//     fileDownload.download = 'document.doc';
//     fileDownload.click();
//     document.body.removeChild(fileDownload);
// }
function exportToWord(row) {
  const payloadArray = JSON.parse(row.payload);
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'></head>
      <body>
        <h2>Questions and Answers</h2>
        ${payloadArray?.map((item) => `<p><strong>Question:</strong> ${item.qus}</p><p><strong>Answer:</strong> ${item.ans}</p>`).join('')}
      </body>
    </html>
  `;

  // Creating a Blob with the HTML content
  const blob = new Blob([content], { type: 'application/msword' });

  // Creating a download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${row.title}_questions_answers.doc`;
  link.click();
}



function closeSnakBar() {
  setOpenSnackBar(false)
}
  return (
    <div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Test Name</TableCell>
            <TableCell>No. of Questions</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Export</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? data.slice(page*rowsPerPage , page*rowsPerPage+rowsPerPage):data)?.map(row =>(
            <TableRow key={row.id}>
              <TableCell>{row.title}</TableCell>
              <TableCell>{(row.payload).length}</TableCell>
              <TableCell >
                <Button variant="contained"  onClick={() => handleDelete(row.id)}>
                  Delete
                </Button>
                </TableCell>
                <TableCell>
                <Button variant="contained"  onClick={() => exportToWord(row)}>
                <ArrowUpwardIcon />Export
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
    <TableRow>
        <TablePagination
            rowsPerPageOptions={[5,10, 25, 50, 100, { label: 'All', value: -1 }]}
            colSpan={5}
            count={data.length}
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
    </TableContainer>
    {showLoader &&
                <Loader />
            }
            {openSnackBar &&
                <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />
            }
    </div>
  );
};

export default BitBankGroupList