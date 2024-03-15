import React from 'react'
import api from '../../services/api';
import * as securedLocalStorage from "../SecureLocalaStorage";
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';


const Rank = () => {
    const { id } = useParams();
    console.log(id);
    const serverUrl = securedLocalStorage.baseUrl;
    const [data, setData] = React.useState([]);


    const columns = [
        { field: 'user_rank', headerName: 'User Rank', width: 200 },
        { field: 'user_id', headerName: 'User ID', width: 200 },
        { field: 'user_name', headerName: 'User Name', width: 200 },
        // { field: 'test_id', headerName: 'Test ID', width: 100 },
    ];

    React.useEffect(() => {
        const fetchRanks = async () => {
            const rankData = await api(null, serverUrl + 'test/result/rank/bytest/' + id, 'get');
            console.log(rankData, 'data**13');
            if (rankData.status === 200) {
                setData(rankData?.data)
            }
        }; fetchRanks();
    }, []);

    return (
        <div>Rank
            <Grid>
                <div style={{ height: 400, width: '50%' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowId={(row) => row.user_id} // Assuming 'user_id' is unique for each row
                    />
                </div>
            </Grid>
        </div>
    )
}

export default Rank;