import * as React from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
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
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 5,
    });

    const [promoCodesList, setPromoCodesList] = React.useState([]);


    const filterNames = {
        user_id: "",
        promo_code: "",
        type: "",
    }

    const [filters, setFilters] = React.useState(filterNames);

    const columnsNames = [
        { field: 'user_name', headerName: 'User Name', minWidth: 200, },
        { field: 'email', headerName: 'Email', minWidth: 200, },
        { field: 'type', headerName: 'Type', minWidth: 200, },
        { field: 'price', headerName: 'Price', minWidth: 150, },
        { field: 'mobile', headerName: 'Mobile', minWidth: 200, },
        { field: 'purchased_date', headerName: 'Purchased Date', minWidth: 250, },

    ];
    const [columns, setColumns] = React.useState(columnsNames);

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
                message: "We conn't perform hide and show at a time"
            }
            setSnackBarData(data);
        }
    }

    async function getSalesData() {
        setShowLoader(true);
        let url = serverUrl + "orders/list?pageSize=" + paginationModel.pageSize + "&pageNumber=" + paginationModel.page;
        const finalData = Object.entries(filters).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {});
        for (const key in finalData) {
            url = url + "&" + key + "=" + finalData[key]
        }
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {
            setShowLoader(false);
            setOrderSList(resp.data);
        }
    }

    function closeSnakBar() {
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
            page: page,
            pageSize: pageSize
        })
    }

    function generateRandomNumber() {
        const coupencode = (Math.random() + 1).toString(36).substring(7);
        return coupencode.substring(0, 3);
    }

    function resetForm() {
        filters.user_id="";
        filters.promo_code="";
        filters.type="";
        setFilters({...filters});
        getSalesData();
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
                    )
                }
            };
            columns.unshift(checkBox);
        }
        setColumns([...columns]);
    }

    React.useEffect(() => {
        userDataRead();
        getSalesData();
        getUsersAndPromesCode();
    }, [])

    return (
        <div>
            <Grid container spacing={1} >
                <Grid item xs={3} >
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
                </Grid>
                <Grid item xs={3} >
                    <FormControl sx={{ minWidth: 300 }} style={{ marginLeft: "16px" }}>
                        <InputLabel id="demo-simple-select-label">Promo Code</InputLabel>
                        <Select
                            sx={{ minWidth: 300 }}
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
                <Grid item xs={3} >
                    <FormControl sx={{ minWidth: 300 }} style={{ marginLeft: "16px" }}>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            sx={{ minWidth: 300 }}
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
                <Grid item xs={12} >
                    &nbsp;&nbsp;&nbsp;  <Button variant="outlined" onClick={() => resetForm()} >clear</Button> &nbsp;
                    <Button variant="contained" onClick={() => getSalesData()} >Apply Filter</Button>
                </Grid>
            </Grid>
            <br />
            <Grid item xs={12} >
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={orderSList.data}
                        rowCount={orderSList.count}
                        columns={columns}
                        pageSize={paginationModel.pageSize}
                        rowsPerPageOptions={[5, 10, 20]}
                        page={paginationModel.page}
                        getRowId={(row) => generateRandomNumber()}
                        onPageChange={(newPage) => applayPagination(newPage, paginationModel.pageSize)}
                        onPageSizeChange={(newPageSize) => applayPagination(paginationModel.page, newPageSize)}
                    />
                </div>
            </Grid>
            <br />
            {userData.userId === 1 &&
                <Button variant="contained" onClick={() => hideOrShow()} >Hide Or Show</Button>
            }

            {showLoader && <Loader />}
            {openSnackBar &&
                <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />
            }
        </div>
    )
}