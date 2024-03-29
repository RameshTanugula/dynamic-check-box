import { Button, Container, FormControlLabel, Grid, InputLabel, Switch, TextField, Typography } from '@mui/material';
import React from 'react'
import Loader from '../Loader';
import * as securedLocalStorage from '../SecureLocalaStorage';
import api from '../../services/api';


const AddBlogCategory = () => {
    const serverUrl = securedLocalStorage.baseUrl + 'blog/';
    const [showLoader, setShowLoader] = React.useState(false);

    const [formData , setFormData] = React.useState({
        blog_category:'',
        is_active: false, 

    })

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
        const { blog_category , is_active} = formData;
        console.log('Question:', blog_category);
        console.log('Question:', is_active);
        console.log(formData);
        const resp = await api(formData, serverUrl + 'add/category', 'post');
        console.log(resp, 'resp***');
    }

  return (
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
    
  )
}

export default AddBlogCategory;