import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Grid } from '@mui/material';

const EditQuestionDialog = ({ open, handleClose, questionData, handleSave }) => {
    console.log(questionData, 'questionData');
    const [editedQuestion, setEditedQuestion] = useState('');
    const [editedAnswer, setEditedAnswer] = useState('');
    const [editedPartA, setEditedPartA] = useState('');
    const [editedPartB, setEditedPartB] = useState('');
    const [editedSolution, setEditedSolution] = useState('');
    const [editedOptions, setEditedOptions] = useState({
        Option1: '',
        Option2: '',
        Option3: '',
        Option4: ''
    });


    React.useEffect(() => {
      if (questionData) {
          setEditedQuestion(questionData?.question );
          setEditedAnswer(questionData?.answer||'');
          setEditedPartA(questionData.part_a === null ||undefined ? '' : questionData.part_a || '');
          setEditedPartB(questionData.part_b === null ||undefined ? '': questionData.part_b|| '');
          setEditedSolution(questionData?.Solution || '');
          setEditedOptions({
            Option1: questionData?.Option1 || '',
            Option2: questionData?.Option2 || '',
            Option3: questionData?.Option3 || '',
            Option4: questionData?.Option4 || ''
        });
      }
  }, [questionData]);


  const handleFormSubmit = () => {

    handleSave({
      q_id : questionData?.q_id,
      question: editedQuestion,
    //   answer: questionData.type !== ''? questionData.answer : editedAnswer,
     answer : editedAnswer,
      tags:questionData?.tags,
      part_a: editedPartA,
      part_b: editedPartB,
      qUrls : questionData?.QUrls === null ? '': questionData?.QUrls || '',
      type : questionData?.type || '',
      solution:editedSolution,
      Option1: editedOptions.Option1,
      Option2: editedOptions.Option2,
      Option3: editedOptions.Option3,
      Option4: editedOptions.Option4,
      
      // option1:
    });
    handleClose();
  };


  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
        <Grid container  spacing={2}>
        <Grid item xs={12} style={{marginTop:5}}>
            <TextField
                fullWidth
                label="Question"
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
            /></Grid>
            <br/>
            <Grid item xs={12}>
            <TextField
                fullWidth
                label="Answer"
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
            /></Grid>
            <Grid item xs={12}>
            {questionData?.part_a&&questionData.type!=""&&editedPartA && (
                <span className='mcq1-left' style={{width:'100%'}}>
                <TextField
                    fullWidth
                    multiline
                    label="Part A"
                    value={editedPartA}
                    onChange={(e) => setEditedPartA(e.target.value)}
                /></span>
            )}</Grid>
            <Grid item xs={12}>
            {questionData?.part_b&&questionData.type!=""&&questionData.type != 'MCQ2'&&editedPartB && (
                 <span className='mcq1-left' style={{width:'100%'}}>
                <TextField
                    fullWidth
                    multiline
                    label="Part B"
                    // style={{height:100}}
                    // value={editedPartB.split(',').map(item => item.trim()).join(',\n')} // Split the string by comma, trim each part, then join with comma and a newline
                    // onChange={(e) => setEditedPartB(e.target.value)} // Set the value directly as a string
                    // value={editedPartB.replace(/,/g, ',\n')} // Add '\n' after each comma
                    value={editedPartB}
                    // value={editedPartB.join(',\n')} // Join the array elements with a comma and a new line
                    onChange={(e) => setEditedPartB(e.target.value)}
                    // onChange={(e) => setEditedPartB(e.target.value.split(',').map(item => item.trim()))} // Split the input value by comma and convert it back to an array

                /></span>
            )}</Grid>
            {questionData?.Option1&&editedOptions && (
              Object.keys(editedOptions).map((optionKey, index) => (
            <Grid item xs={12} key={index}>
            <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={editedOptions[optionKey]}
                onChange={(e) => setEditedOptions({
                    ...editedOptions,
                    [optionKey]: e.target.value
                        })}
                     />
                    </Grid>
                   ))
                  )}
           {/* <Grid item xs={12}>
           {questionData?.Solution || questionData?.Solution === null || questionData?.Solution === "" &&(
            <TextField
                fullWidth
                label="Explanation"
                value={editedSolution}
                onChange={(e) => setEditedSolution(e.target.value)}
            />)}</Grid> */}
             <Grid item xs={12}>
             <TextField
                            fullWidth
                            label="Explanation"
                            value={editedSolution}
                            onChange={(e) => setEditedSolution(e.target.value)}
                        />
                    </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
    </Dialog>
);
};


export default EditQuestionDialog;
