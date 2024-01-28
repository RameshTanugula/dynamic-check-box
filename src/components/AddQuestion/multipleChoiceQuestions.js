import React, { useState } from 'react';
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';
import * as securedLocalStorage from '../SecureLocalaStorage';
import SnackbarView from '../../common/SnackBar';
import Loader from '../Loader';

const MultipleChoiceQuestions = () => {
  const serverUrl = securedLocalStorage.baseUrl + 'question/';
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarData, setSnackBarData] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [solution, setSolution] = useState('');
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [explanationEditorState, setExplanationEditorState] = useState(EditorState.createEmpty());

  const [questions, setQuestions] = useState([
    { id: 1, statement: '', selectedOption: null },
    { id: 2, statement: '', selectedOption: null },
    { id: 3, statement: '', selectedOption: null },
    { id: 4, statement: '', selectedOption: null },
  ]);

  const [errors, setErrors] = useState({
    question: Array(questions.length).fill({
      statement: '',
    }),
    explanation: '',
  });

  const onchangeTitle = (e) => {
    if (e.blocks.length > 0) {
      setTitle(e.blocks[0].text);
    }
  };

  const onChangeSolution = (e) => {
    if (e.blocks.length > 0) {
      setSolution(e.blocks[0].text);
    }
  };

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
    const newTitle = editorState.getCurrentContent().getPlainText('\u0001');
    setTitle(newTitle);
  };

  const handleExplanationEditorChange = (explanationEditorState) => {
    setExplanationEditorState(explanationEditorState);
    setSolution(explanationEditorState.getCurrentContent().getPlainText('\u0001'));
  };

  const handleOptionChange = (questionIndex, option) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].selectedOption = option;
      return updatedQuestions;
    });
  };

  const handleInputChange = (index, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].statement = value;
      return updatedQuestions;
    });

    // Validate the changed field
    validateQuestion(index);
  };

  const validateQuestion = (index) => {
    const question = questions[index];
    const questionErrors = {};

    if (!question.statement.trim()) {
      questionErrors.statement = 'Statement is required';
    }

    setErrors((prevErrors) => {
      const updatedErrors = [...prevErrors.question];
      updatedErrors[index] = questionErrors;
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

  const doValidation = () => {
    return true; 
  };


  const handleSubmit = async () => {
    if (doValidation()) {
      const statementArray = questions.map((q) => q.statement);
      const ans = questions.find((q) => q.selectedOption);
      console.log(ans , 'ans');
      let options = [];
      for(let i=0; i<questions.length; i++){
        options.push(questions[i].statement);
      }
      console.log(options, options);
      let correctAnswer = ans.selectedOption
     
      const payload = {
        title: title,
        solution: solution,
        options: options,
        ans: correctAnswer,
        type:''
      };

      if (payload.type !== "MCQ1" && payload.type !== "MCQ2") {
        // Set part_a and part_b to null
        payload.part_a = null;
        payload.part_b = null;
      } 

      try {
        const resp = await api(payload, serverUrl + 'create/questions/mcq', 'post');
         
        if (resp.status === 200) {
          setOpenSnackBar(true);
          const data = {
            type: 'success',
            message: 'Multiple Choice Questions added successfully!....',
            open: true,
          };
          setSnackBarData(data);
          setQuestions([
            { id: 1, statement: '', selectedOption: null },
            { id: 2, statement: '', selectedOption: null },
            { id: 3, statement: '', selectedOption: null },
            { id: 4, statement: '', selectedOption: null },
          ]);
          setEditorState(EditorState.createEmpty());
          setExplanationEditorState(EditorState.createEmpty());
        } else {
          setOpenSnackBar(true);
          const data = {
            type: 'error',
            message: 'Multiple Choice Questions added failed.',
            open: true,
          };
          setSnackBarData(data);
        }
      } catch (error) {
        console.error('Error during API call:', error);
      } finally {
        setShowLoader(false);
      }
    }
  };

  const closeSnackBar = () => {
    setOpenSnackBar(false); 
  };

  return (
    <Container>
      <Typography variant="h5" align="center" gutterBottom>
        Multiple Choice Questions
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
            {questions.map((question, index) => (
              <Grid container spacing={2} key={question.id}>
                <Grid item xs={12} sm={8} style={{ marginBottom: '8px' , display: 'flex'}}>
                  <Radio
                    value={question.selectedOption}
                    checked={question.selectedOption !== null}
                    onChange={() => handleOptionChange(index, question.id)}
                  />
                  <TextField
                    label={`Option ${question.id}`}
                    value={question.statement}
                    fullWidth
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    required
                    error={Boolean(errors.question[index]?.statement)}
                    helperText={errors.question[index]?.statement}
                  />
                </Grid>
              </Grid>
            ))}
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
                onChange={(e) => onChangeSolution(e)}
              />
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
      {/* <Loader /> */}
    </Container>
  );
};

export default MultipleChoiceQuestions;
