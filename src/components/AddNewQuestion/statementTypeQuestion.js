// StatementTypeQuestion.js

import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import AddIcon from '@mui/icons-material/Add';
import SnackbarView from '../../common/SnackBar';
import Loader from '../Loader';

const StatementTypeQuestion = ({ onUpdate, onClose }) => {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarData, setSnackBarData] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [solution, setSolution] = useState('');
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [explanationEditorState, setExplanationEditorState] = useState(EditorState.createEmpty());

  const [questions, setQuestions] = useState([
    { id: 1, statement: '', isTrueFalse: false },
    { id: 2, statement: '', isTrueFalse: false },

  ]);

  const [errors, setErrors] = useState({
    question: Array(questions.length).fill({
      statement: '',
      isTrueFalse: '',
    }),
    explanation: '',
  });

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleExplanationEditorChange = (explanationEditorState) => {
    setExplanationEditorState(explanationEditorState);
    setSolution(
      explanationEditorState.getCurrentContent().getPlainText('\u0001')
    );
  };

  const handleRadioChange = (index, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].isTrueFalse = value === 'true';
      return updatedQuestions;
    });

    // Validate the changed field
    validateQuestion(index);
  };

  const onchangeTitle = (e) => {
    setTitle(e.blocks[0].text);
  };


  const handleStatementChange = (id, value, field) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const handleAddStatement = () => {
    if (questions.length >= 4) {
      alert('You can choose a maximum of four statements only!');
    } else {
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: prevQuestions.length + 1,
          statement: '',
          isTrueFalse: false,
        },
      ]);
    }
  };

  const validateQuestion = (id) => {
    const question = questions[id];
    const questionErrors = {};

    if (!question.statement.trim()) {
      questionErrors.statement = 'Statement is required';
    }

    if (typeof question.isTrueFalse !== 'boolean') {
      questionErrors.isTrueFalse = 'Please select True or False';
    }

    setErrors((prevErrors) => {
      const updatedErrors = [...prevErrors.question];
      updatedErrors[id] = questionErrors;
      return {
        ...prevErrors,
        question: updatedErrors,
      };
    });
  };

  const handleExplanationValidation = () => {
    const explanationErrors = {};

    if (!solution.trim()) {
      explanationErrors.explanation = 'Explanation is required';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      explanation: explanationErrors,
    }));
  };

  const shuffledSets_2 = ['true, false','false, true', 'true, true', 'false, false'];
const shuffledSets_3 = ['true, false, false', 
'false, true, false',
'false, false, true',
'true, true, false',
'true, false, true',
'false, true, true',
'true, true, true',
'false, false, false'];
const shuffledSets_4 = ['true, false, false, false',
'false, true, false, false',
'false, false, true, false',
'false, false, false, true',
'true, true, false, false',
'true, false, true, false',
'true, false, false, true',
'false, true, true, false',
'false, true, false, true',
'false, false, true, true',
'true, true, true, false',
'true, true, false, true',
'true, false, true, true',
'false, true, true, true',
'true, true, true, true',
'false, false, false, false'];
function generateOptions(list, originalArray) {
console.log(originalArray.length, 'ori', originalArray)
  // if (count === 2) {
    // shuffledSets =['true, false','false, true', 'true, true', 'false, false'];
    const find = list.filter((s)=> s !== originalArray)
    console.log(find.length, 'find***')
    if(list.length !== 4){
    const pickedItems = pickRandomItems(find, 3, list.length);
    return shuffleArray(pickedItems.concat(originalArray));
    } else {
      return shuffleArray(find.concat(originalArray));
    }
}


function pickRandomItems(array, count, subsetSize) {
  const result = [];
  const shuffledArray = array.slice(0, subsetSize); // Create a copy of the subset

  // Shuffle the subset array (Fisher-Yates algorithm)
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Pick the first 'count' items from the shuffled subset
  for (let i = 0; i < count; i++) {
    result.push(shuffledArray[i]);
  }

  return result;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

  const handleSubmit =  () => {
    const optionArray = questions.map((q) => q.isTrueFalse);
    const statementArray = questions.map((q) => q.statement);
    let options = [optionArray.join(', ')];
    const optionsArray = questions.map((q) => q.isTrueFalse);
    console.log(optionsArray, 'optionsArray**');
          let originalOption = [optionsArray.join(', ')];
     console.log(originalOption, 'originalOption');
    let list
    if (optionsArray.length === 2) {      
     list = generateOptions(shuffledSets_2, optionsArray.join(', '));
    //  console.log(list, 'list');
    }else if(optionsArray.length === 3){
    list = generateOptions(shuffledSets_3, optionsArray.join(', '));
    // console.log(list, 'list');
  }else if(optionsArray.length === 4){
     list = generateOptions(shuffledSets_4, optionsArray.join(', '));
    // console.log(list, 'list');
  }
      //  const list = generateOptions(shuffledSets_3, optionsArray.join(', '));
      //  console.log(list)
       const indexValue  = list.findIndex((l)=>l===optionsArray.join(', '));
       const correctAnswer = indexValue + 1;
       console.log(correctAnswer)
      // let indexValue
      //  if (correctAnswer !== -1) {
      //    indexValue = list[correctAnswer];
      //   console.log(indexValue);
      // }

    const payload = {
      title: title,
      solution: solution,
      part_a: statementArray.join(', '),
      options: list,
      ans: correctAnswer,
      type: 'MCQ2'
    };

    onUpdate(payload)
    onClose()
  };

  const closeSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <Container>
      <Typography variant="h5" align="center" gutterBottom>
        Statement Type Questions
      </Typography>
      <form className="container">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <InputLabel>Type your question</InputLabel>
            <FormControl fullWidth variant="outlined">
              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                value={title}
                onChange={(e) => onchangeTitle(e)}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} style={{ marginBottom: '5px' }}>
            {questions.map(({ id, statement, isTrueFalse }, index) => (
              <Grid container spacing={2} key={id}>
                <Grid item xs={12} sm={8} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <InputLabel style={{ marginRight: '15px' }}>{id}</InputLabel>
                  <TextField
                    value={statement}
                    fullWidth
                    onChange={(e) =>
                      handleStatementChange(id, e.target.value, 'statement')
                    }
                    placeholder="Statement"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RadioGroup
                    aria-label={`trueFalse-${index}`}
                    name={`trueFalse-${index}`}
                    value={isTrueFalse ? 'true' : 'false'}
                    onChange={(e) =>
                      handleRadioChange(index, e.target.value)
                    }
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="True" />
                    <FormControlLabel value="false" control={<Radio />} label="False" />
                  </RadioGroup>
                </Grid>
              </Grid>
            ))}
            <Grid
              item
              xs={12}
              sm={12}
              style={{ textAlign: 'right', marginTop: '10px' }}
            >
              <IconButton onClick={handleAddStatement} color="primary">
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputLabel>Add Explanation</InputLabel>
            <FormControl fullWidth variant="outlined">
              <Editor
                editorState={explanationEditorState}
                onEditorStateChange={handleExplanationEditorChange}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                value={solution}
              />
              <span style={{ color: 'red' }}>
                {errors.explanation}
              </span>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      {openSnackBar && (
        <SnackbarView {...snackBarData} onClose={closeSnackBar} />
      )}
      {showLoader && <Loader />}
    </Container>
  );
};

export default StatementTypeQuestion;
