import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import api from '../services/api';
import * as securedLocalStorage from "./SecureLocalaStorage";

export default function Categories() {
    // const serverUrl = `http://localhost:8080/categories/`
    const serverUrl = securedLocalStorage.baseUrl + 'categories/'
    // const [checked, setChecked] = useState([]);
    const [categoryMainData, setMainCategoryData] = React.useState([]);
    const [subCategoryData, setSubCategoryData] = React.useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = React.useState(``);
    const [selectedMainCategory, setSelectedMainCategory] = React.useState(``);
    const [newCatValue, setNewCatValue] = React.useState(``);
    React.useEffect(() => {
        async function getData() {
            const mainCatData = await api(null, serverUrl + 'get/categories/main', 'get');
            const subCatData = await api(null, serverUrl + 'get/categories/sub', 'get');
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
    const getMainCategories = () => {
        return (
            <Select
                sx={{ width: '25%' }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedMainCategory}
                autoWidth
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
            />
            <br /><br />
            <div>

                <TextField sx={{ width: '25%' }} id="outlined-basic" value={newCatValue} onChange={(e) => setNewCatValue(e.target?.value)} label="New Category" variant="outlined" />
            </div>
            <br /><br /><br />
            <div>

                <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={() => saveCategory()}>Add Category</Button>
                    <Button variant="outlined" onClick={() => resetAll()}>Reset</Button>
                </Stack>
            </div>
        </div>

    );
}

