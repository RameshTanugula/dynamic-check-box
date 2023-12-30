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

const StatementTypeQuestion = ({ onUpdate }) => {
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
    { id: 3, statement: '', isTrueFalse: false },
    { id: 4, statement: '', isTrueFalse: false },

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

  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleSubmit =  () => {
    const optionArray = questions.map((q) => q.isTrueFalse);
    const statementArray = questions.map((q) => q.statement);
    let options = [optionArray.join(', ')];
    for (let i = 0; i < 3; i++) {
      options.push(shuffleArray(optionArray).join(', '));
    }
    const payload = {
      title: title,
      solution: solution,
      part_a: statementArray.join(', '),
      options: options,
      ans: 1,
      type: 'MCQ2'
    };

    onUpdate(payload)
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
