import * as React from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import * as securedLocalStorage from "./SecureLocalaStorage";
import Loader from './Loader';
import api from '../services/api';
import * as CheckAccess from "./CheckAccess";

export default function UserDashBoard() {
    const serverUrl = securedLocalStorage.baseUrl;
    const [showLoader, setShowLoader] = React.useState(false);
    const [usersList, setUsersList] = React.useState([]);

    const columns = [
        { field: 'name', headerName: 'User Name', minWidth: 250, },
        { field: 'accepted', headerName: 'Accepted', minWidth: 250,},
        { field: 'under_review', headerName: 'Under Review', minWidth: 250, },
        { field: 'rejected', headerName: 'Rejected', minWidth: 250, },
        { field: 'total', headerName: 'Total', minWidth: 230, },

    ];

    async function getUsersData() {
        setShowLoader(true);
        const url = serverUrl + "question/count/all/users/" + CheckAccess.getRole() + "/" + CheckAccess.getUserId();
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {
            setShowLoader(false);
            resp.data = resp.data?.map(r=>r.id);
            setUsersList(resp.data)
        }
    }
    React.useEffect(() => {
        getUsersData();
    }, [])

    return (
        <div>
            {!showLoader &&
                < Grid item xs={12} >
                    <div style={{ height: 630, width: '100%' }}>
                        <DataGrid
                            rows={usersList}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            getRowId={(row) => row.user_id}
                        />
                    </div>
                </Grid>
            }
            {showLoader && <Loader />}
        </div >
    )
}