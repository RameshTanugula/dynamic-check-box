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

export default function Sales() {
    const serverUrl = securedLocalStorage.baseUrl;
    const [showLoader, setShowLoader] = React.useState(false);
    const [usersList, setUsersList] = React.useState([]);
    const [selectedList, setSelectedList] = React.useState([]);
    const [firstValue, setFirstValue] = React.useState();
    const [count, setCount] = React.useState(0);
    const [editData, setEditData] = React.useState();
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const columns = [
        {
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
        },
        { field: 'user_name', headerName: 'User Name', minWidth: 200, },
        { field: 'email', headerName: 'Email', minWidth: 200, },
        { field: 'type', headerName: 'Type', minWidth: 200, },
        { field: 'price', headerName: 'Price', minWidth: 150, },
        { field: 'mobile', headerName: 'Mobile', minWidth: 200, },
        { field: 'purchased_date', headerName: 'Purchased Date', minWidth: 250, },

    ];

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
        const url = serverUrl + "orders/list";
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {
            setShowLoader(false);
            setUsersList(resp.data);
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

    React.useEffect(() => {
        getSalesData();
    }, [])

    return (
        <div>
            <Button variant="contained" onClick={() => hideOrShow()} >Hide Or Show</Button> <br />
            <Grid item xs={12} >
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={usersList}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        getRowId={(row) => row.order_id}
                    />
                </div>
            </Grid>

            {showLoader && <Loader />}
            {openSnackBar &&
                <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />
            }
        </div>
    )
}