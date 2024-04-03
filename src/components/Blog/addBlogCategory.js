import { Alert, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, InputLabel, Pagination, Switch, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import Loader from '../Loader';
import * as securedLocalStorage from '../SecureLocalaStorage';
import api from '../../services/api';
import { DataGrid } from '@mui/x-data-grid';


const AddBlogCategory = () => {
    const serverUrl = securedLocalStorage.baseUrl + 'blog/';
    const [showLoader, setShowLoader] = React.useState(false);
    const [data , setData] = React.useState('')
    // const [page, setPage] = React.useState(0);
    // const [pageSize, setPageSize] = React.useState(5);
    // const pageCount = Math.ceil(data.length / pageSize);
    // const [editingId, setEditingId] = React.useState(null);
    // const [openEditDialog, setOpenEditDialog] = React.useState(false);
    // const [editLabel, setEditLabel] = React.useState('');
    // const [editStatus, setEditStatus] = React.useState('');



    // const handlePageChange = (event, value) => {
    //     setPage(value - 1);
    // };
    const [formData , setFormData] = React.useState({
        blog_category:'',
        is_active: false, 

    })

    // const columns = [
    //     { field: 'id', headerName: 'ID', width: 100 },
    //     { field: 'blog_category', headerName: 'Blog Category', width: 200 },
    //     { field: 'is_active', headerName: 'Status', width: 120, renderCell: (params) => (
    //         <span>{params.value === 1 ? 'Active' : 'Inactive'}</span>
    //     )},
    //     {
    //         field: 'edit', headerName: 'Edit', width: 100, renderCell: (params) => (
    //             <Button variant="contained" onClick={() => handleEdit(params.row.id, params.row.label, params.row.IsActive)}>Edit</Button>
    //         )
    //     },
    // ];

    // const handleEdit = (id, blog_category, is_active) => {
    //     setEditingId(id);
    //     setEditLabel(blog_category);
    //     setEditStatus(is_active === 1 ? 'Active' : 'Inactive');
    //     console.log(editStatus, '***');
    //     setOpenEditDialog(true);
    // };
    // const handleEditCancel = () => {
    //     setEditingId(null);
    //     setOpenEditDialog(false);
    // };

    // const handleEditSave = async (id) => {
    //     console.log(id);
    // }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: inputValue
        }));
    };


    const handleSubmit =  async() => {
        // Gather form data
        const resp = await api(formData, serverUrl + 'add/category', 'post');
        if (resp.status === 200) {
          alert('Category added');
          setFormData({
            blog_category: '',
            is_active: false
        });
        }else {
            alert('Category added failed');
        }
    }

    useEffect(() => {
        const fetchData = async() =>{
            const categoryData = await api(null, serverUrl + 'category', 'get');
            // console.log(categoryData, 'categoryData***');
            setData(categoryData?.data)
        };fetchData();
    }, [])

  return (
    <>
    <div>
        <Container>
            <Typography></Typography>
            <form className='container'>
                <Grid container spacing={2} >
                    <Grid item xs={12} lg={7} sm={12}>
                        <InputLabel>Add BlogCategory :</InputLabel>
                        <TextField
                        fullWidth
                        name='blog_category'
                        placeholder='enter question'
                        variant='outlined'
                        value={formData.blog_category}
                        onChange={handleChange}
                        required
                        />
                    </Grid>
                    <Grid item xs={12} lg={12} sm={12}>
                        <FormControlLabel
                            control={<Switch
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />}
                            label="Status"
                        />
                    </Grid>
                        <Grid item spacing={5} xs={12} sm={12}>
                            <Button variant='contained' onClick={handleSubmit}>Add & New</Button>&nbsp;&nbsp;
                            <Button variant='contained' >Cancel</Button>
                        </Grid>
                </Grid>
            </form>
        </Container>
        {showLoader &&
                <Loader />
            }
    </div>

           {/* <div>
            <div style={{ height: 400, width: '60%' }}>
                <DataGrid
                    rows={data.slice(page * pageSize, (page + 1) * pageSize)} // Slice the data based on current page and page size
                    columns={columns}
                    pageSize={pageSize}
                    pagination
                />
            </div>
            <Pagination
                count={pageCount}
                page={page + 1}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                style={{ marginTop: '10px' }}
            />
        </div>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Label"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Switch
                            checked={editStatus === 'Active'}
                            onChange={(e) => setEditStatus(e.target.checked ? 'Active' : 'Inactive')}
                        />}
                        label="Status"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditSave(editingId)} color="primary">Save</Button>
                    <Button onClick={() => handleEditCancel(false)} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog> */}

    </>
  )
}

export default AddBlogCategory;