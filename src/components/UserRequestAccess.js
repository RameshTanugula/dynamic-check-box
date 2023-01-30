import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import api from '../services/api';
import * as securedLocalStorage from "./SecureLocalaStorage";

export default function UserRequestAccess() {

    const serverUrl = securedLocalStorage.baseUrl + "admin/request/";
    const [tableData, settableData] = React.useState([]);

    const columns = [
        { field: 'user_id', headerName: 'User Id', minWidth: 150, },
        { field: 'description', headerName: 'Description', minWidth: 200, },
        { field: 'type', headerName: 'Type', minWidth: 200, },
        { field: 'status', headerName: 'Status', minWidth: 150, },
        { field: 'comments', headerName: 'Comments', minWidth: 200, },
        { field: 'test_id', headerName: 'Test Id', minWidth: 150, },
        {
            field: '', headerName: 'Action', minWidth: 150,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => requestAccess(params.row)} >Approve</Button>
                    </Stack>)
            }
        },
    ];

    const getDeatails = async () => {
        const resp = await api(null, serverUrl + "list", 'get');
        if (resp.status === 200) {
            settableData(resp.data);
        }

    }

    async function requestAccess(row) {
        const payLoad = {
            attempts: 1,
            test_id: row.test_id,
            status: row.status,
            comments: row.comments,
            request_id: row.id,
        }
        const resp = await api({ updateData: payLoad }, serverUrl + "update", 'post');
        if (resp.status === 200) {
            getDeatails();
        }
    }

    React.useEffect(() => {
        getDeatails();
    }, [])

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={tableData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
            />
        </div>
    )
}
