import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';
import * as securedLocalStorage from '../SecureLocalaStorage';
import api from '../../services/api';
import Loader from '../Loader';
import { Container, Typography } from '@mui/material';

const BlogContentPage = () => {
    const [showLoader, setShowLoader] = useState(false);
    const serverUrl = securedLocalStorage.baseUrl + 'blog/';
    const { id } = useParams(); // Get the blog topic ID from URL params
    const [blogContent, setBlogContent] = useState([]);

    useEffect(() => {
        setShowLoader(true);

        const fetchData = async () => {
            try {
                const response = await api(null, serverUrl + 'content/' + id, 'get');
                // console.log(response, 'response***');
                setBlogContent(response?.data);
                setShowLoader(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setShowLoader(false);
            }
        };

        fetchData();
    }, [id, serverUrl]);

    return (
        <>
            <div>
    <Container>
        {/* <div className='blog-content' style={{ marginTop: '90px', marginBottom: '90px', justifyContent: 'center', textAlign: 'center', fontSize: '50px' }}>Blog Content</div> */}

        {showLoader ? (
            <Loader />
        ) : (
            blogContent?.map(topic => (
                <div className="blog-content" key={topic?.id}>
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: topic?.blog_content }} />
                </div>
            ))
        )}
    </Container>
</div>

        </>
    );
}

export default BlogContentPage;
