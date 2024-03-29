import React, { useEffect, useState } from 'react'
import './style.css' ;
import * as securedLocalStorage from '../SecureLocalaStorage';
import api from '../../services/api';
import Loader from '../Loader';

const BlogDashboard = () => {
    const [showLoader, setShowLoader] = React.useState(false);
    const serverUrl = securedLocalStorage.baseUrl + 'blog/';
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        setShowLoader(true);

        const fetchData = async () => {
            try {
                // const response = await api(null, serverUrl + 'category', 'get');
                const categoryData = await api(null, serverUrl + 'category', 'get');
                const topicData = await api(null, serverUrl + 'topic', 'get');
                const contentData = await api(null, serverUrl + 'content', 'get');
                console.log(categoryData,topicData,contentData,'response***');
                setBlogs(contentData?.data);
                console.log(blogs);
                setShowLoader(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setShowLoader(false);
            }
        };

        fetchData();
    }, []);

  return (
    <>
    <div>
    <div className='blog' style={{marginTop:'90px', marginBottom:'90px', justifyContent:'center', textAlign:'center', fontSize:'50px' }}>Blog</div>
    {showLoader &&
                <Loader />
            }
    </div>
    </>
  )
}

export default BlogDashboard;