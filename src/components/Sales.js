import * as React from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import * as securedLocalStorage from "./SecureLocalaStorage";
import Loader from './Loader';
import api from '../services/api';

export default function Sales() {
    const serverUrl = securedLocalStorage.baseUrl;
    const [showLoader, setShowLoader] = React.useState(false);
    const [usersList, setUsersList] = React.useState([]);

    const columns = [
        { field: 'user_name', headerName: 'User Name', minWidth: 200, },
        { field: 'email', headerName: 'Email', minWidth: 200, },
        { field: 'type', headerName: 'Type', minWidth: 200, },
        { field: 'price', headerName: 'Price', minWidth: 150, },
        { field: 'mobile', headerName: 'Mobile', minWidth: 200, },
        { field: 'purchased_date', headerName: 'Purchased Date', minWidth: 250, },
        
    ];

    async function getSalesData() {
        setShowLoader(true);
        const url = serverUrl + "orders/list";
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {
            setShowLoader(false);
            setUsersList(resp.data);
        }
    }
    React.useEffect(() => {
        getSalesData();
    }, [])

    return (
        <div>
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
        </div>
    )
}