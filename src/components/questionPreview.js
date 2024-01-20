// TestPreviewPage.js
import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const QuestionPreview = ({ selectedQuestionsList, onDelete, onClose }) => {
//  console.log(selectedQuestionsList ,'selectedQuestionsData');

//  if (!Array.isArray(selectedQuestionsData)) {
//   console.error('selectedQuestionsList is not an array:', selectedQuestionsData);
//   return null;
// }


  const handleDelete = (id) => {
    console.log('Delete button clicked for questionId:', id);
    // Call the onDelete function to remove the question from selectedQuestionsList
    onDelete(id);
  };

  return (
    <div>
      <h2>Preview Page</h2>
      <Button variant="contained" onClick={onClose}>Close Preview</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {selectedQuestionsList.map((question, index , id) => (
  <TableRow key={index}>
    <TableCell>{question.q_id?question.q_id:index+1 }</TableCell>
    <TableCell>{question.question || question.title}</TableCell>
    <TableCell>{question.answer || question.ans}</TableCell>
    <TableCell>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleDelete(question.q_id ? question.q_id : question.title )}
      >
        Delete
      </Button>
    </TableCell>
  </TableRow>
))}

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default QuestionPreview;