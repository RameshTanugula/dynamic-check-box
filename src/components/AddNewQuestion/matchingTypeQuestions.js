import React, { useState } from 'react';
import {
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';
import * as securedLocalStorage from '../SecureLocalaStorage';
import Loader from '../Loader';
import SnackbarView from '../../common/SnackBar';

const MatchingTypeQuestions = ({onUpdate, onClose}) => {
  const serverUrl = securedLocalStorage.baseUrl;
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarData, setSnackBarData] = React.useState();
  const [showLoader, setShowLoader] = React.useState(false);
  const [solution, setSolution] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [explanationEditorState, setExplanationEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');

  const [question, setQuestion] = useState([
    { id: 1, parts_a: '', Option: '', parts_b: '' },
    { id: 2, parts_a: '', Option: '', parts_b: '' },
    { id: 3, parts_a: '', Option: '', parts_b: '' },
    { id: 4, parts_a: '', Option: '', parts_b: '' },

  ]);

  const [errors, setErrors] = useState({
    title: '',
    parts_a: '',
    parts_b: '',
    solution: '',
    Option: '',
  });

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
  };

  const handleExplanationEditorChange = (explanationEditorState) => {
    setExplanationEditorState(explanationEditorState);
    const ExplanationState = explanationEditorState.getCurrentContent();
    const rawContentState = convertToRaw(ExplanationState);
  };

  const handleStatementChange = (id, value, field) => {
    setQuestion((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const handleAddStatement = () => {
    if (question.length > 4) {
      alert('You can choose a maximum of four statements only!');
    } else {
      setQuestion((prevQuestions) => [
        ...prevQuestions,
        {
          id: prevQuestions.length + 1,
          parts_a: '',
          Option: '',
          parts_b: '',
        },
      ]);
    }
  };

  const checkIsValid = (fieldName, value) => {
    switch (fieldName) {
        case 'title':
        case 'parts_a':
        case 'parts_b':
        // Regex pattern for solution (alphanumeric characters, spaces, and special characters)
        const alphanumericRegex = /^[a-zA-Z0-9\s!@#$%^&*()_+{}\[\]:;<>,.?~\\/=-]+$/;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: value.trim() === '' ? `${fieldName} is required` : !alphanumericRegex.test(value) ? `Invalid ${fieldName}` : '',
        }));
        break;
      case 'Option':
        // Regex pattern for Option (only accepts "1", "2", or "3")
        const optionRegex = /^[0-4]$/;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: value.trim() === '' ? 'Option is required' : !optionRegex.test(value) ? 'Invalid option' : '',
        }));
        break;
      default:
        break;
    }
  };

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
  const doValidation = () => {
    let valid = true;

    // Validate title
    checkIsValid('title', title);

    // Validate each question
    question.forEach((q) => {
      checkIsValid('parts_a', q.parts_a);
      checkIsValid('parts_b', q.parts_b);
      checkIsValid('Option', q.Option);
    });


    // Check if any error exists
    for (const key in errors) {
      if (errors[key] !== '') {
        valid = false;
        break;
      }
    }

    return valid;
  };
  function shuffleOptions(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function createShuffledSets(originalArray, numberOfSets) {
    const shuffledSets = new Set();
    
    while (shuffledSets.size < numberOfSets) {
      const shuffledArray = shuffleOptions([...originalArray]);
      shuffledSets.add(shuffledArray.join(','));
    }
  
    return Array.from(shuffledSets);
  }

  const getOptionsAsStatementMCQ1 = (arr) => {
    return arr.map((ele) => {
        const optionArr = ele.split(",");
        const formattedOptions = optionArr.map((option, index) => `${String.fromCharCode(65 + index)}${option.trim()}`);
        return formattedOptions.join(', ');
    });
}


  const handleSubmit = async () => {
    if (doValidation()) {
      const statementArray = question.map((q) => q.parts_a);
      const optionArray = question.map((q) => q.Option);
      const matchArray = question.map((q) => q.parts_b);
 
    let originalOption = [optionArray.join(',')];
     let options = createShuffledSets([...optionArray], 3);
     let combinedOptions = originalOption.concat(options);
    let option = shuffleOptions(combinedOptions)

   const indexValue  = option.findIndex((l)=>l===originalOption.join(', '));
   let correctAnswer  = indexValue+1
   //  console.log(correctAnswer)
   
   let optionsList = getOptionsAsStatementMCQ1(option)
  //  console.log(optionsList, 'optionsList**229');

      const payload = {
        title: title,
        solution: solution,
        part_a: statementArray.join(', '),
        part_b: matchArray.join(', '),
        options: optionsList,
        ans: correctAnswer,
        type:'MCQ1'
      };
      onUpdate(payload);
      onClose()
    }
  };

  const closeSnackBar = () => {
    setOpenSnackBar(false);
  };



  return (
    <Container>
      <Typography variant="h5" align="center" gutterBottom>
        Matching Type Questions
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
                required={true}
                value={title}
                onChange={(e) => onchangeTitle(e)}
                error={errors.title !== ''}
                helperText={errors.title !== '' ? 'Question is required' : ' '}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            {question.map(({ id, parts_a, Option, parts_b }) => (
              <Grid container spacing={2} key={id}>
                <Grid item xs={5} sm={5} lg={5} style={{ display: 'flex', alignItems: 'center' }}>
                  <InputLabel>{String.fromCharCode(65 + id - 1)}</InputLabel>
                  <TextField
                    required
                    value={parts_a}
                    onChange={(e) => handleStatementChange(id, e.target.value, 'parts_a')}
                    placeholder="Statement"
                    style={{ marginLeft: '5px' }}
                    error={errors.parts_a !== ''}
                    helperText={errors.parts_a !== '' ? 'Statement is required' : ' '}
                  />
                </Grid>
                <Grid item xs={5} sm={5} lg={5} style={{ display: 'flex', alignItems: 'center' }}>
                  <InputLabel>{id} </InputLabel>
                  <TextField
                    value={parts_b}
                    onChange={(e) => handleStatementChange(id, e.target.value, 'parts_b')}
                    placeholder="Match"
                    style={{ marginLeft: '5px' }}
                    required
                    error={errors.parts_b !== ''}
                    helperText={errors.parts_b !== '' ? 'Match statement is required' : ' '}
                  />
                </Grid>
                <Grid item xs={2} sm={2} lg={2}>
                  <InputLabel>Correct</InputLabel>
                  <TextField
                    value={Option}
                    onChange={(e) => handleStatementChange(id, e.target.value, 'Option')}
                    placeholder="Option"
                    required={true}
                    error={errors.Option !== ''}
                    helperText={errors.Option !== '' ? 'Option is required' : ' '}
                    type='number'
                    min={1}
                    max={4}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} sm={12} style={{ textAlign: 'right', marginTop: '10px' }}>
            <IconButton onClick={handleAddStatement} color="primary">
              <AddIcon />
            </IconButton>
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
      {openSnackBar && <SnackbarView {...snackBarData} onClose={closeSnackBar} />}
      {showLoader && <Loader />}
    </Container>
  );
};

export default MatchingTypeQuestions;