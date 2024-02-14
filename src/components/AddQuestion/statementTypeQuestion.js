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
  RadioGroup,
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

const StatementTypeQuestion = () => {
  const serverUrl = securedLocalStorage.baseUrl + 'question/';
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
  });

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
    const newTitle = editorState.getCurrentContent().getPlainText('\u0001');
    setTitle(newTitle);
  };

  const handleExplanationEditorChange = (explanationEditorState) => {
    setExplanationEditorState(explanationEditorState);
    setSolution(explanationEditorState.getCurrentContent().getPlainText('\u0001'));
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

  const handleStatementChange = (id, value, field) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
    // Validate the changed field
    validateQuestion(id - 1);
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


  const doValidation = () => {
    let isValid = true;

    // Validate each question
    const questionErrors = questions.map((question, index) => {
      validateQuestion(index);
      return errors.question[index]?.statement;
    });
     {
      isValid = false;
    }
    return isValid;
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
  const shuffledArray = array.slice(0, subsetSize);

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

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


const getOptionsAsStatement = (arr) => {
  const list = arr.map((ele) => {
    const optionarr = ele.split(",");
    let trueOptions = [];
    let falseOptions = [];
    optionarr.map((newVal, index) => {
      if (newVal.trim() == 'true') {
          trueOptions.push(String.fromCharCode(65 + index));
          return trueOptions;
      }
      else {
          falseOptions.push(String.fromCharCode(65 + index));
          return falseOptions;
      }
  });
  // console.log(trueOptions, "trueOptions");
  // console.log(falseOptions, "falseOptions");
  const trueStatement = trueOptions.length > 0
      ? `Statement ${trueOptions.length > 1 ? trueOptions.join(' & ') : trueOptions[0]} true`
      : '';
  const falseStatement = falseOptions.length > 0
      ? `Statement ${falseOptions.length > 1 ? falseOptions.join(' & ') : falseOptions[0]} false`
      : '';

      return `${trueStatement}${trueStatement && falseStatement ? ', ' : ''}${falseStatement}`.trim();


});
return list;
}



  const handleSubmit = async () => {
    // if (validateQuestion()) {

      const statementArray = questions.map((q) => q.statement);

      setShowLoader(true);

      const optionsArray = questions.map((q) => q.isTrueFalse);
            let originalOption = [optionsArray.join(', ')];
      let list
      if (optionsArray.length === 2) {      
       list = generateOptions(shuffledSets_2, optionsArray.join(', '));
       console.log(list, 'list');
      }else if(optionsArray.length === 3){
      list = generateOptions(shuffledSets_3, optionsArray.join(', '));
      console.log(list, 'list');
    }else if(optionsArray.length === 4){
       list = generateOptions(shuffledSets_4, optionsArray.join(', '));
      console.log(list, 'list');
    }


    const optionsList = getOptionsAsStatement(list);

    // console.log(optionsList, '**251');
         const indexValue  = list.findIndex((l)=>l===optionsArray.join(', '));
         const correctAnswer = indexValue + 1;
        //  console.log(correctAnswer)
   
      const payload = {
        title: title,
        solution: solution,
        part_a: statementArray.join(', '),
        options: optionsList,
        ans: correctAnswer,
        type:'MCQ2'
      };

      const resp = await api(payload, serverUrl + 'create/questions/mcq', 'post');
      setShowLoader(false);

      if (resp.status === 200) {
        setOpenSnackBar(true);
        const data = {
          type: 'success',
          message: 'Statement Type Question added successfully!....',
          open: true,
        };
        setSnackBarData(data);
        setEditorState(EditorState.createEmpty());
        setExplanationEditorState(EditorState.createEmpty());
        setQuestions([
          { id: 1, statement: '', isTrueFalse: false },
          { id: 2, statement: '', isTrueFalse: false },
        ]);
      } else {
        setOpenSnackBar(true);
        const data = {
          type: 'error',
          message: 'Statement Type Question added failed.',
          open: true,
        };
        setSnackBarData(data);
      }
    // }
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
                    error={Boolean(errors.question[index]?.statement)}
                    helperText={errors.question[index]?.statement}
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
