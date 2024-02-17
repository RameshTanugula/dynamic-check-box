import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import api from '../services/api';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch } from '@mui/material';

export default function Categories() {
    // const serverUrl = `http://localhost:8080/categories/`
    const serverUrl = securedLocalStorage.baseUrl + 'categories/'
    // const [checked, setChecked] = useState([]);
    const [categoryMainData, setMainCategoryData] = React.useState([]);
    const [subCategoryData, setSubCategoryData] = React.useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = React.useState(``);
    const [selectedMainCategory, setSelectedMainCategory] = React.useState(``);
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [newCatValue, setNewCatValue] = React.useState(``);
    const [editingId, setEditingId] = React.useState(null);
    const [editLabel, setEditLabel] = React.useState('');
    const [editStatus, setEditStatus] = React.useState(''); // 0 for inactive, 1 for active
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false); // Correct variable name

    React.useEffect(() => {
        async function getData() {
            const mainCatData = await api(null, serverUrl + 'get/categories/main', 'get');
            console.log(mainCatData , 'mainCatData');
            const subCatData = await api(null, serverUrl + 'get/categories/sub', 'get');
            console.log(subCatData, 'subCatData');
            if (mainCatData.status === 200) {
                setMainCategoryData([...mainCatData.data]);
            }
            if (subCatData.status === 200) {
                setSubCategoryData([...subCatData.data]);
            }
        }
        getData();
    }, []);
    React.useEffect(() => {
        async function getData() {
            const subCatData = await api(null, serverUrl + 'get/categories/sub/' + selectedMainCategory, 'get');
            console.log(subCatData, 'subCatData');
            if (subCatData.status === 200) {
                const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
                const tmpData = { viewData: subCatData.data }
                const tmpResult = tmpData.viewData.flatMap(flat);
                setSubCategoryData([...tmpResult]);
                setSelectedSubCategory(``)
            }
        }
        getData();
    }, [selectedMainCategory]);

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
    }, [])
    const getMainCategories = () => {
        return (
            <Select
                sx={{ width: '25%' }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedMainCategory}
                autoWidth
                disabled={!readAndWriteAccess}
                onChange={(e) => setSelectedMainCategory(e?.target?.value)}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {categoryMainData.map((tl) => { return (<MenuItem value={tl.id}>{tl.label}</MenuItem>) })}
            </Select>

        )
    }
    const resetAll = () => {
        setSelectedMainCategory(``);
        setNewCatValue(``);
        setSelectedSubCategory(``);
    }
    const saveCategory = async () => {
        const parentId = selectedSubCategory ? selectedSubCategory : selectedMainCategory;
        if (!parentId) {
            alert('please select parent category!');
        } else if (!newCatValue) {
            alert('Please enter new Category value');
        } else {
            const saveCatData = await api({ parentId: parentId, categoryName: newCatValue }, serverUrl + 'save/category', 'post');
            if (saveCatData.status === 200) {
                alert('Category Added!');
                resetAll();
            } else {
                alert('Something went wrong!')
            }
        }
    }



    // Flattening the hierarchical data
const flattenData = (data, parentId = null) => {
    return data.reduce((acc, item) => {
        const flattenedItem = {
            id: item.id,
            parentId: parentId,
            label: item.label,
            children: item.children?.length > 0 // Checking if the item has children
        };
        acc.push(flattenedItem);
        if (item.children?.length > 0) {
            acc = [...acc, ...flattenData(item.children, item.id)];
        }
        return acc;
    }, []);
};


const flattenedData = flattenData(subCategoryData);
console.log(flattenedData, 'subCategoryData', subCategoryData);

const handleEdit = (id, label, IsActive) => {
    setEditingId(id);
    setEditLabel(label);
    setEditStatus(IsActive === 1 ? 'Active' : 'Inactive');
    console.log(editStatus, '***');
    setOpenEditDialog(true);
};



const handleEditCancel = () => {    
    setEditingId(null);
    setOpenEditDialog(false);
};

const handleEditSave = async(id) => {
// console.log(id,Active,Inactive);
    const body = {
        id: editingId,
             label: editLabel,
             IsActive: editStatus === 'Active'? 1 : 0 ,
    };
    const subCatData = await api(body, serverUrl + 'save/category/sub/'+id, 'put');
    console.log(subCatData, 'subCatData');
    if (subCatData.status === 200) {
        setEditDialogOpen(false);
        setOpenEditDialog(false);
        alert('Category Updated!');
        setEditingId(null); 
        resetAll();
    } else {
        alert('Failed to update category!');
    }
    console.log('Editing category with ID:', id);
}

    return (
        <div>
            {categoryMainData?.length && getMainCategories()} <br /><br />
            <Autocomplete
                sx={{ width: '25%' }}
                disablePortal
                id="combo-box-demo"
                options={subCategoryData}
                onChange={(event, newValue) => {
                    setSelectedSubCategory(newValue?.id);
                }}
                value={selectedSubCategory && subCategoryData?.find(sc => sc.id === selectedSubCategory)?.label}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} label="Categories" />}
                disabled={!readAndWriteAccess}
            />
            <br /><br />
            <div>

                <TextField disabled={!readAndWriteAccess} sx={{ width: '25%' }} id="outlined-basic" value={newCatValue} onChange={(e) => setNewCatValue(e.target?.value)} label="New Category" variant="outlined" />
            </div>
            <br />
            <div>
                <Stack spacing={2} direction="row">
                    <Button disabled={!readAndWriteAccess} variant="contained" onClick={() => saveCategory()}>Add Category</Button>
                    <Button disabled={!readAndWriteAccess} variant="outlined" onClick={() => resetAll()}>Reset</Button>
                </Stack>
            </div>
            <br /><br /><br />
            <div style={{ height: 600, width: '70%' }}>
                <DataGrid
                    rows={subCategoryData}
                    columns={[
                        { field: 'id', headerName: 'ID', width: 170 },
                        { field: 'label', headerName: 'Label', width: 350 },
                        {
                            field: 'IsActive', headerName: 'Status', width: 150, renderCell: (params) => (
                                <span>{params.row.IsActive === 1 ? 'Active' : 'Inactive'}</span>
                            )
                        },
                        {
                            field: 'edit', headerName: 'Edit', width: 100, renderCell: (params) => (
                                <Button variant="contained" onClick={() => handleEdit(params.row.id, params.row.label, params.row.IsActive)}>Edit</Button>
                            )
                        },
                    ]}
                    pageSize={15}
                    // rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                />
            </div>

            <Dialog open={openEditDialog} onClose={handleEditCancel}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Label" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} />
                    <FormControlLabel
                        // control={<Switch checked={editStatus} onChange={(e) => setEditStatus(e.target.value)} />}
                        // control={<Switch checked={editStatus === 'true' ? 'true': 'false'} onChange={(e) => setEditStatus(e.target.checked)} />}
                        // control={<Switch checked={editStatus === 'Active' || 'Inactive' } onChange={() => setEditStatus(editStatus === 'Active' ? 'Active': 'Inactive' )} />}
                        control={<Switch 
                            checked={editStatus == 'Active'} 
                            onChange={(e) => setEditStatus(e.target.checked ? 'Active' : 'Inactive')} 
                        />}
                        label="Status"
                    />
                    {/* <span>{editStatus === 'Active' ? 'Active' : 'Inactive'}</span> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditSave(editingId)} color="primary">Save</Button>
                    <Button onClick={handleEditCancel} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

