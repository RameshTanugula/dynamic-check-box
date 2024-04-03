import { Button, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader';
import * as securedLocalStorage from '../SecureLocalaStorage';
import api from '../../services/api';
import {  EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './style.css' ;
import { logDOM } from '@testing-library/react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';

const AddBlogContent = () => {
    const serverUrl = securedLocalStorage.baseUrl + 'blog/';
    const [showLoader, setShowLoader] = React.useState(false);
    const [blogCategory, setBlogCategory] = useState([]);
    const [blogCategoryTopic, setBlogCategoryTopic] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState('');

    const [formData , setFormData] = useState({
        blog_content:'',
        category_id:'',
        topic_id:'',
        is_active: false, 
    })

    const handleChange = async(e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: inputValue
        }));
        if (name === 'category_id') {
            // Fetch topic data based on selected category ID
            // console.log(value);
            let id = value
            try {
                const topicData = await api(null, serverUrl + `topic/`+id , 'get');
                setBlogCategoryTopic(topicData?.data);
            } catch (error) {
                console.error('Error fetching topic data:', error);
            }
        }
    };
    useEffect(() => {
        setShowLoader(true);

        const fetchData = async () => {
            try {

                const categoryData = await api(null, serverUrl + 'category', 'get');
                // console.log(categoryData,'response***');
                setBlogCategory(categoryData?.data)
                // console.log( blogCategory);
                setShowLoader(false);
            } catch (error) {
                // console.error('Error fetching data:', error);
                setShowLoader(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit =  async() => {
        const resp = await api(formData, serverUrl + 'add/content', 'post');
        // console.log(resp, 'resp***');
        if (resp.status === 200) {
          alert('Content added');
          setFormData({
            blog_content:'',
            category_id:'',
            topic_id:'',
            is_active: false, 
        });
        }else {
            alert('Content added failed');
        }
    }
    const handleEditorChange = (editorState) => {
        const contentState = editorState.getCurrentContent();
        setEditorState(editorState);
        // console.log(contentState);
        setFormData((prevState) => ({
            ...prevState,
            blog_content: draftToHtml(convertToRaw(contentState))
        }));
        // console.log(formData, 'blog_content');
    };
  return (
    <div>
        <Container>
            <Typography></Typography>
            <form className='container1'>
                <Grid container spacing={2} >
                <Grid item xs={12} sm={12}>
                            <InputLabel>Add Blog:</InputLabel>
                            <FormControl fullWidth variant="outlined">
                                <Editor
                                    editorState={editorState}
                                    onEditorStateChange={handleEditorChange}
                                    wrapperClassName="wrapper-class"
                                    editorClassName="editor-class"
                                    toolbarClassName="toolbar-class"
                                    value={formData.blog_content}
                                />
                            </FormControl>
                        </Grid>
                <Grid item xs={12} lg={7} sm={12}>
                            <InputLabel>Category:</InputLabel>
                            <Select
                                fullWidth
                                name='category_id'
                                value={formData.category_id}
                                onChange={handleChange}
                                variant='outlined'
                                required
                            >
                                {blogCategory?.map(topic => (
                                    <MenuItem key={topic.id} value={topic.id}>{topic.blog_category}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} lg={7} sm={12}>
                            <InputLabel>Topic:</InputLabel>
                            <Select
                                fullWidth
                                name='topic_id'
                                value={formData.topic_id}
                                onChange={handleChange}
                                variant='outlined'
                                required
                            >
                                {blogCategoryTopic?.map(topic => (
                                    <MenuItem key={topic.id} value={topic.id}>{topic.blog_category_topic}</MenuItem>
                                ))}
                            </Select>
                        </Grid>

                    {/* <Grid item xs={12} lg={7} sm={12}>
                        <InputLabel>Add Blog:</InputLabel>
                        <TextField
                        fullWidth
                        name='blog_content'
                        placeholder='enter question'
                        variant='outlined'
                        value={formData.blog_content}
                        onChange={handleChange}
                        required
                        />
                    </Grid> */}
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

export default AddBlogContent;