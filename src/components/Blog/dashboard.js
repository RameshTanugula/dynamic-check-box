import React, { useEffect, useState } from 'react'
import './style.css' ;
import * as securedLocalStorage from '../SecureLocalaStorage';
import api from '../../services/api';
import Loader from '../Loader';
import { Card, CardActions, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';

const BlogDashboard = () => {
    const [showLoader, setShowLoader] = React.useState(false);
    const serverUrl = securedLocalStorage.baseUrl + 'blog/';
    const [blogCategory, setBlogCategory] = useState([]);
    const [blogCategoryTopic, setBlogCategoryTopic] = useState([]);
    const [blogCategoryAllTopic, setBlogCategoryAllTopic] = useState([]);

    useEffect(() => {
        setShowLoader(true);
        const fetchData = async () => {
            try {
                const categoryData = await api(null, serverUrl + 'category', 'get');
                const Data = await api(null, serverUrl + 'topic' , 'get');
                setBlogCategoryAllTopic(Data?.data);
                setBlogCategory(categoryData?.data);
                // console.log(blogCategory , blogCategoryTopic);
                setShowLoader(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setShowLoader(false);
            }
        };

        fetchData();
    }, []);

    const handleCategoryClick = async(id) => {
        // Handle click event for blog category
        console.log('Clicked category:', id);
        const topicData = await api(null, serverUrl + 'topic/' + id, 'get');
        // console.log(topicData);
        setBlogCategoryTopic(topicData?.data);
        setBlogCategoryAllTopic('');


    };
    const handleTopicClick = async(id) => {
        console.log(id);
        window.location.href = `/BlogContent/${id}`;
    };


  return (
    <>
    <div className='container'>
    <Container >
    {/* <div className='blog' style={{marginTop:'90px', marginBottom:'90px', justifyContent:'center', textAlign:'center', fontSize:'50px' }}>Blog</div> */}
            {/* <Typography variant="h2" align="center" style={{ marginTop: '30px', marginBottom: '30px' }}>Blog Dashboard</Typography> */}
              <Grid container spacing={1} className="categoryWrapper">
                {/* <div className="categoryWrapper"> */}
                    {blogCategory?.map(blog => (
                        <Grid item key={blog.id} xs={3} md={3} lg={3} >
                            <div  onClick={() => handleCategoryClick(blog.id)}>
                            <Typography className='category' variant="h5">{blog.blog_category}</Typography>
                            </div>
                        </Grid>
                    ))}
                    {/* </div> */}
                </Grid>

                <Grid container spacing={1} style={{marginTop:'30px' , marginBottom:'40px'}}>
                    {blogCategoryAllTopic&&blogCategoryAllTopic?.map(blog => (
                        <Grid item key={blog.id} xs={3} md={4} lg={4} >
                             <Card className='card'>
                             <div className="topicWrapper" onClick={() => handleTopicClick(blog.id)}>
                             <CardHeader>
                             </CardHeader>
                             <CardContent>
                             <Typography className='CardContent' variant="h5">{blog.blog_category_topic}</Typography>
                             </CardContent>
                             <CardActions>
                             <Typography gutterBottom   component="div" style={{marginBottom:'30px'}}>
                                   Read More ... 
                             </Typography>
                             </CardActions>
                             </div>
                            </Card>
                        </Grid>
                    ))}
                    
                    {blogCategoryTopic&&blogCategoryTopic?.map(blog => (
                        <Grid item key={blog.id} xs={3} md={4} lg={4} >
                             <Card className='card'>
                             <div className="topicWrapper" onClick={() => handleTopicClick(blog.id)}>

                             <CardHeader>
                             {/* <Typography  variant="h6">{blog.blog_category}</Typography> */}
                             </CardHeader>
                             <CardContent>
                             <Typography className='CardContent' variant="h5">{blog.blog_category_topic}</Typography>
                             </CardContent>
                             <CardActions>
                             <Typography gutterBottom   component="div" style={{marginBottom:'30px'}}>
                                   Read More ... 
                             </Typography>
                             </CardActions>
                             </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
        </Container>

    </div>
    {showLoader &&
                <Loader />
            }
    </>
  )
}

export default BlogDashboard;