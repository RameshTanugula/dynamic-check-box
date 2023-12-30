// AddNewQuestions.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import StatementTypeQuestion from './statementTypeQuestion';
import MultipleChoiceQuestions from './multipleChoiceQuestions';
import MatchingTypeQuestions from './matchingTypeQuestions';
import { Button, Dialog, DialogContent } from '@mui/material';

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

const AddNewQuestions = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [title, setTitle] = useState('');
  const [solution, setSolution] = useState('');
  const [statementArray, setStatementArray] = useState([]);
  const [matchArray, setMatchArray] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState({ selectedOption: 1 });
  const [savedQuestions, setSavedQuestions] = useState([]);


  const [formData, setFormData] = useState({
    'StatementTypeQuestion': {},
    'MatchingTypeQuestions': {},
    'MultipleChoiceQuestions': {},
  });

  const tabsConfig = {
    QuestionsEntry: [
      {
        label: 'Statement type question',
        component: (
          <StatementTypeQuestion
           onUpdate={(data) => updateFormData('StatementTypeQuestion', data)}
          />
        ),
      },
      {
        label: 'Matching type questions',
        component: (
          <MatchingTypeQuestions
            onUpdate={(data) => updateFormData('MatchingTypeQuestions', data)}
          />
        ),
      },
      {
        label: 'Multiple Choice Questions',
        component: (
          <MultipleChoiceQuestions
            onUpdate={(data) => updateFormData('MultipleChoiceQuestions', data)}
          />
        ),
      },
    ],
  };

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const updateFormData = (key, data) => {
    console.log(key, 'onupdate', data)
    setFormData((prevData) => ({
      ...prevData,
      [key]: data,
    }));
  };
  

  const handleSubmit = async () => {
    let payload = { }
console.log(formData, '*****formdata')
    if (selectedTab === 0) {
      payload = {
        title:formData.StatementTypeQuestion.title,
        solution:formData.StatementTypeQuestion.solution,
        part_a: formData.StatementTypeQuestion.statementArray.join(', '),
        options:formData.StatementTypeQuestion.options,
        ans: 1,
        type: 'MCQ2',
      };
    } else if (selectedTab === 1) {
      payload = {
        title:formData.MatchingTypeQuestions.title,
        solution:formData.MatchingTypeQuestions.solution,
        part_a: formData.MatchingTypeQuestions.statementArray.join(', '),
        part_b: formData.MatchingTypeQuestions.matchArray.join(', '),
        options:formData.MatchingTypeQuestions.options,
        ans: 1,
        type: 'MCQ1',
      };
    } else if (selectedTab === 2) {
      payload = {
        title:formData.MultipleChoiceQuestions.title,
        solution:formData.MultipleChoiceQuestions.solution,
        options: statementArray,
        ans: formData.MultipleChoiceQuestions.correctAnswer.selectedOption,
        type: 'MCQ',
      };
    }

    console.log(payload, '**');
    setSavedQuestions(savedQuestions.push(payload))
    // Perform other actions as needed
  };

  return (
    <Dialog open={isOpen} onClose={onClose} sx={{ maxWidth: '80%' }}>
      <DialogContent>
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
          <div style={{ padding: 3, textAlign: 'end' }}>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewQuestions;
