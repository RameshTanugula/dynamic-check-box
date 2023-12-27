import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import StatementTypeQuestion from './statementTypeQuestion';
import MultipleChoiceQuestions from './multipleChoiceQuestions';
import MatchingTypeQuestions from './matchingTypeQuestions';
import './style.css';
// import OmrBasedTest from './omrBasedTest';

const TabPanel = (props) => {
  const { children, index, value, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

const AddQuestions = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabsConfig = {
    QuestionsEntry: [
      { label: 'Statement type question', component: <StatementTypeQuestion /> },
      { label: 'Matching type questions', component: <MatchingTypeQuestions /> },
      { label: 'Multiple Choice Questions', component: <MultipleChoiceQuestions /> },
      // { label: 'Multiple Choice Questions', component: <OmrBasedTest /> },
    ],
  };

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selectedTab}
          onChange={handleChangeTab}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          {tabsConfig.QuestionsEntry.map((tab, index) => (
            <Tab key={index} className="tab" label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', padding: 3 }}>
          {tabsConfig.QuestionsEntry.map((tab, index) => (
            <TabPanel key={index} value={selectedTab} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default AddQuestions;
