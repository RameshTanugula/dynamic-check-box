import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddBlogCategory from './addBlogCategory';
import AddBlogCategoryTopic from './addCategoryTopic';
import AddBlogContent from './addBlogContent';

const AddBlogPage = () => {
  const [value, setValue] = useState(0);
  const [data, setData] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Blog Category" />
        <Tab label="Blog Topic" />
        <Tab label="Blog Content" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {value === 0 && <AddBlogCategory />}
        {value === 1 && <AddBlogCategoryTopic /> }
        {value === 2 && <AddBlogContent /> }
      </Box>

    </Box>
  );
};

export default AddBlogPage;
