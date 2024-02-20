import * as React from 'react';
import Grid from '@mui/material/Grid';
import * as securedLocalStorage from "./SecureLocalaStorage";
import Loader from './Loader';
import api from '../services/api';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SnackBar from './SnackBar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import jwt_decode from "jwt-decode";
import { Card, Dialog, DialogContent, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Sales() {
    const serverUrl = securedLocalStorage.baseUrl;
    const typesList = ["Online Test Series", "OMR Merged Tests", "Books", "Courses"]
    const [showLoader, setShowLoader] = React.useState(false);
    const [orderSList, setOrderSList] = React.useState({ data: [], count: 0 });
    const [usersList, setUsersList] = React.useState([]);
    const [selectedList, setSelectedList] = React.useState([]);
    const [firstValue, setFirstValue] = React.useState();
    const [count, setCount] = React.useState(0);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [userData, setUserData] = React.useState({});
    const [fromDate, setFromDate] = React.useState(null);
    const [toDate, setToDate] = React.useState(null);

    const [openModal, setOpenModal] = React.useState(false);
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 5,
    });

    const [promoCodesList, setPromoCodesList] = React.useState([]);

    const filterNames = {
        // user_id: "",
        promo_code: "",
        type: "",
        // date: new Date() 
    }
    
    const [filters, setFilters] = React.useState(filterNames);
    const [selectedFields, setSelectedFields] = React.useState(['user_name', 'email', 'type', 'price']);
    const columnsNames = [
        { field: 'user_name', headerName: 'User Name', minWidth: 200, },
        { field: 'email', headerName: 'Email', minWidth: 200, },
        { field: 'type', headerName: 'Type', minWidth: 200, },
        { field: 'price', headerName: 'Price', minWidth: 150, },
        { field: 'mobile', headerName: 'Mobile', minWidth: 200, },
        { field: 'purchased_date', headerName: 'Purchased Date', minWidth: 250,
        // renderCell: (params) => {
        //     return (
        //         <TableCell>
        //             {formatDate(params.row.purchased_date.$d)}
        //         </TableCell>
        //     );
        // }
        },
        { field: 'order_id', headerName: 'Order Id', minWidth: 200 },
        { field: 'promo_code', headerName: 'Promo Code', minWidth: 200}

    ];
    const [columns, setColumns] = React.useState(columnsNames);


    const handleChangeField = (field) => {
        if (selectedFields.includes(field)) {
            setSelectedFields(selectedFields.filter((f) => f !== field));
        } else {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const toggleModal = () => {
        setOpenModal(!openModal);
    };

    const renderFieldCheckboxes = () => {
        return columnsNames.map((column) => (
            <FormControlLabel
                key={column.field}
                control={<Checkbox checked={selectedFields.includes(column.field)} onChange={() => handleChangeField(column.field)} />}
                label={column.headerName}
            />
        ));
    };

    function exportToWord() {
        var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'></head><body>";
        var footer = "</body></html>";
            var tableHTML = "<table border='1' cellspacing='0' cellpadding='5'><thead><tr>";
        selectedFields.forEach(field => {
            tableHTML += "<th>" + field + "</th>";
        });
        tableHTML += "</tr></thead><tbody>";
        orderSList.data.forEach(row => {
            tableHTML += "<tr>";
            selectedFields.forEach(field => {
                tableHTML += "<td>" + (row[field] || '') + "</td>";
            });
            tableHTML += "</tr>";
        });
        tableHTML += "</tbody></table>";   
        // Combine the HTML content
        var sourceHTML = header + tableHTML + footer;   
        // Convert HTML to data URL
        var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML); 
        // Create a download link and trigger the download
        var fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'selectedFieldsDocument.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }
    
    

    const renderSelectedFieldsTable = () => {
        return (
            <div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {selectedFields.map((field) => (
                                    <TableCell key={field}>{columnsNames.find((col) => col.field === field).headerName}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {orderSList?.data?.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  {selectedFields.map((column, colIndex) => (
                                   <TableCell key={colIndex}>
                                   {column === 'price' ? 
                                  (isNaN(parseFloat(row[column])) ? 0 : parseFloat(row[column]).toFixed(2)) :
                                    row[column]}
                                      </TableCell>
                                          ))}
                                 </TableRow>
                                ))}
                        </TableBody>                           
                        <TableFooter>
                            <TableRow>
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 20,100,200]}
                            colSpan={5}
                            count={orderSList?.count}
                            rowsPerPage={paginationModel.pageSize}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'questionData per page',
                                },
                                native: true,
                            }}
                            page={paginationModel.page}
                            onPageChange={(e, page) => applayPagination(page, paginationModel.pageSize)}
                            onRowsPerPageChange={(e) => applayPagination(0, parseInt(e.target.value))}
                        />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
        );
    };


    function handleChange(e) {
        const newData = {
            ...filters,
            [e.target.name]: e.target.value
        }
        setFilters(newData);
    }

    async function slectRow(row) {
        setCount(count + 1);
        let list = selectedList,
            val = 0;
        if (row.is_hide === 0) {
            val = 1;
        }
        if (count === 0) {
            setFirstValue(val)
        }
        if (count === 0 || firstValue === val) {
            var foundIndex = usersList.findIndex(x => x.order_id === row.order_id);
            usersList[foundIndex].is_hide = val;
            setUsersList([...usersList]);
            list.push(row.order_id);
            setSelectedList(list);
        }
        else {
            setOpenSnackBar(true);
            const data = {
                type: "error",
                message: "We can't perform hide and show at a time"
            }
            setSnackBarData(data);
        }
    }
  
      function formatDate(date) {
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
      async function getSalesData() {
        setShowLoader(true);
        let url = serverUrl + 'orders/list?pageSize=' + paginationModel.pageSize + '&pageNumber=' + paginationModel.page;
        const finalData = Object.entries(filters).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {});
        for (const key in finalData) {
            url = url + '&' + key + '=' + finalData[key];
        }
        if (fromDate && toDate) {
            const fromDateFormatted = formatDate(fromDate.$d);
            const toDateFormatted = formatDate(toDate.$d);
            url = url + '&fromDate=' + fromDateFormatted + '&toDate=' + toDateFormatted;
        }
            const data = await api(null, url, 'get');
            // console.log(data, 'data**128');
    
            if (data.status === 200) {
                setShowLoader(false);
                // setFromDate(null);
                // setToDate(null);
                setOrderSList(data.data);
                // console.log(orderSList.data[0].purchased_date, 'list');  
            // }
        } 
    }
    
    
    async function getSalesData1() {
        setShowLoader(true);
        let url = serverUrl + "orders/list?pageSize=" + paginationModel.pageSize + "&pageNumber=" + paginationModel.page;
        const finalData = Object.entries(filters).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {});
        for (const key in finalData) {
            url = url + "&" + key + "=" + finalData[key]
        }
        const resp = await api(null, url, 'get');
        // console.log(resp, 'resp***124');
        if (resp.status === 200) {
            setShowLoader(false);
            setOrderSList(resp.data);
            // console.log(orderSList, 'orderslist***124');
          }
    }

    function closeSnackBar() {
        setOpenSnackBar(false)
    }

    async function hideOrShow() {
        if (selectedList.length > 0) {
            const obj = { value: firstValue === 0 ? false : true, selectedList: selectedList };
            setShowLoader(true);
            const url = serverUrl + "orders/hide";
            const resp = await api(obj, url, 'post');
            if (resp.status === 200) {
                setSelectedList([]);
                setCount(0);
                setFirstValue();
                setShowLoader(false);
                setOpenSnackBar(true);
                const action = firstValue === 0 ? "showing" : "hided";
                const data = {
                    type: "success",
                    message: "Selected courses are " + action + " successfully...!"
                }
                setSnackBarData(data);
            }
            else {
                setOpenSnackBar(true);
                const data = {
                    type: "error",
                    message: resp.response.data.error
                }
                setSnackBarData(data);
            }
        }
        else {
            setOpenSnackBar(true);
            const data = {
                type: "error",
                message: "Please select at least one course..!"
            }
            setSnackBarData(data);
        }
    }

    async function getUsersAndPromesCode() {
        let url = serverUrl + "users/list";
        let resp = await api(null, url, 'get');
        // console.log(resp, 'resp**Users-comp-list');
        if (resp.status === 200) {
            setUsersList(resp.data)
        }
        url = serverUrl + "promocodes/list";
        resp = await api({}, url, 'post');
        if (resp.status === 200) {
            setPromoCodesList(resp.data)
        }
    }

    function applayPagination(page, pageSize) {
        setPaginationModel({
            ...paginationModel,
            page: page,
            pageSize: pageSize
        });
        getSalesData();
    }

    function resetForm() {
        setFilters(filterNames);
        getSalesData();
        setToDate(null);
        setFromDate(null);
    }

    function userDataRead() {
        const userdata = jwt_decode(securedLocalStorage.get("token"));
        setUserData(userdata);
        if (userdata.userId === 1) {
            const checkBox = {
                field: '', headerName: 'Check', minWidth: 100,
                renderCell: (params) => {
                    return (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={params.row.is_hide === 1}
                                    onChange={(e) => slectRow(params.row)}
                                />
                            }
                        />
                    );
                }
            };
            columns.unshift(checkBox);
        }
        setColumns(columns);
    }

    React.useEffect(() => {
        userDataRead();
        getSalesData();
        getUsersAndPromesCode();
    }, [])

    return (
        <div>
            <Grid container spacing={0} style={{ margin: '30px'}}>
                <Grid item xs={3} lg={2} >
                    <Card sx={{ maxWidth: 150 }} >
                        <div>
                            {/* <h1>0</h1> */}
                            <h1>{orderSList?.count?orderSList.count:0}</h1>
                            <h5>total No of Sales</h5>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={3} lg={2} >
                    <Card sx={{ maxWidth: 150, alignItems:'center' }}>
                        <div>
                            <h1>{orderSList?.total_price}</h1>
                            <h5>  Total Amount</h5>
                        </div>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={2} >
                {/* <Grid item xs={3} >
                    <FormControl sx={{ minWidth: 300 }} style={{ marginLeft: "16px" }}>
                        <InputLabel id="demo-simple-select-label">User</InputLabel>
                        <Select
                            sx={{ minWidth: 300 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filters.user_id}
                            label="User"
                            name="user_id"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {usersList.map((data, i) => (
                                <MenuItem key={i} value={data.id}>
                                    {data.first_name + " " + data.last_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>  */}
                <Grid item xs={3} lg={2}>
                    <FormControl sx={{ minWidth: 200 }} >
                        <InputLabel id="demo-simple-select-label">Promo Code</InputLabel>
                        <Select
                            sx={{ minWidth: 200 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filters.promo_code}
                            label="Promo Code"
                            name="promo_code"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {promoCodesList.map((data, i) => (
                                <MenuItem key={i} value={data.coupon_code}>
                                    {data.coupon_code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3} lg={2} sm>
                    <FormControl sx={{ minWidth: 200 }} >
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            sx={{ minWidth: 200 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filters.type}
                            label="TYpe"
                            name="type"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {typesList.map((data, i) => (
                                <MenuItem key={i} value={data}>
                                    {data}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3} lg={2} >
                <FormControl sx={{ minWidth: 200 }} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                 label="From Date"
                 value={fromDate}
                 onChange={(date) => {setFromDate(date)}}
                  renderInput={(params) => <TextField {...params} />}
                 />
                 </LocalizationProvider>
                 </FormControl>
              </Grid>
            <Grid item xs={3}lg={2} >
            <FormControl sx={{ minWidth: 200 }} >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
               <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(date) => {setToDate(date)}}
                  renderInput={(params) => <TextField {...params} />}
                 />
                 </LocalizationProvider>
                 </FormControl>
             </Grid>
                <Grid item xs={12} >
                    &nbsp;&nbsp;&nbsp;  <Button variant="outlined" onClick={() => resetForm()} >clear</Button> &nbsp;
                    <Button variant="contained" onClick={() => getSalesData()} >Apply Filter</Button>
                </Grid>
            </Grid>
            <br />
            <div style={{display:'flex'}}>
             </div>
             <br/>

            <Grid item xs={12} >
            <Grid item xs={12}>
                    <Button variant="contained" onClick={() => exportToWord() }  style={{marginBottom:'15px'}}>Export as Word</Button>
                    <Button variant="contained" onClick={toggleModal} style={{marginBottom:'15px', marginLeft:'10px'}}>Select Fields</Button>
                    <Dialog open={openModal} onClose={toggleModal}>
                        <DialogContent>
                            <h3>Select Fields</h3>
                            {renderFieldCheckboxes()}
                            <br/>   
                            <Button variant='contained' onClick={toggleModal}>Done</Button>
                        </DialogContent>
                    </Dialog>
                </Grid>
                <div style={{ height: 400, width: '100%' }}>
                {selectedFields.length > 0 && renderSelectedFieldsTable()}
                </div>
            </Grid>
            {userData.userId === 1 &&
                <Button variant="contained" onClick={() => hideOrShow()} >Hide Or Show</Button>
            }
            {showLoader && <Loader />}
            {openSnackBar &&
                <SnackBar data={snackBarData} closeSnakBar={closeSnackBar} />
            }
        </div>
    )
}
