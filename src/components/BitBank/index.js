import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Mapping from '../mapping';
// import CreateBitBank from './createBitBank';
import BitbankSetCreation from '../BitBankSetCreation';
import BitBankGroupList from './bitBankGroupList';
import QuestionCreation from '../questionCreation';

const BitBankQuestions = () => {
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
        {/* <Tab label="Create BitBank" /> */}
        <Tab label="BitBank To Question" />
        <Tab label="Mapping" />
        <Tab label="BitBank Grouping" />
        <Tab label="BitBank Group List" />
        {/* <Tab label="BitBank To Question" /> */}
      </Tabs>

      <Box sx={{ p: 3 }}>
        {/* {value === 0 && <CreateBitBank />} */}
        {value === 0 && <QuestionCreation /> }
        {value === 1 && <Mapping /> }
        {value === 2 && <BitbankSetCreation /> }
        {value === 3 && <BitBankGroupList />}
        {/* {value === 4 && <QuestionCreation /> } */}
      </Box>

    </Box>
  );
};

export default BitBankQuestions;
