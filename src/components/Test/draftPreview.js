// TestPreviewPage.js
import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DraftPreview = ({ selectedQuestionsList, onDelete, onClose }) => {
//  console.log(selectedQuestionsList ,'selectedQuestionsData');

//  if (!Array.isArray(selectedQuestionsData)) {
//   console.error('selectedQuestionsList is not an array:', selectedQuestionsData);
//   return null;
// }
console.log(selectedQuestionsList, '*******selectedQuestionsList(*******')

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
    {/* <TableCell>{question.question || question.title || question.QuestionTitle}</TableCell> */}
    <TableCell>
  {(question.question || question.QuestionTitle) && (
    <>
      {(question.question || question.QuestionTitle) && (
        <>
          {(question.question || question.QuestionTitle)}
          {question.type !== '' && question.part_a && question.part_b && (
            <div>
              <span className='mcq1-left'>PART A</span>
              {question.type !== 'MCQ2' && <span className='mcq1-left'>PART B</span>}
            </div>
          )}
          {question.type === 'IMG' && question.QUrls && (
            <img
              style={{
                height: '10rem',
                width: 'auto',
              }}
              src={question.QUrls}
              alt="Question Image"
            />
          )}
          {question.type !== '' && question.part_a &&
            question.part_b &&
            question.part_a?.split(',').map((a, i) => (
              <div key={i}>
                <br />
                <div style={{ width: '100%' }}>
                  {question.type !== 'MCQ2' ? (
                    <span className='mcq1-left'>{String.fromCharCode(65 + i)}.{a}</span>
                  ) : (
                    <span>{String.fromCharCode(65 + i)}.{a}</span>
                  )}
                  {question.type !== 'MCQ2' && (
                    <span className='mcq1-right'>&nbsp;&nbsp;&nbsp;&nbsp;{i + 1}. {question.part_b?.split(',')[i]}</span>
                  )}
                </div>
              </div>
            ))}
        </>
      )}
    </>
  ) ||
    (question.title && (
      <>
        {question.title}
        {question.part_b ? (
          <>
            {question.part_a?.split(',').map((a, i) => (
              <div key={i}>
                <br />
                <div style={{ width: '100%' }}>
                  <span className='mcq1-left'>{String.fromCharCode(65 + i)}.{a}</span>
                  {question.part_b?.split(',')[i] && (
                    <span className='mcq1-right'>&nbsp;&nbsp;&nbsp;&nbsp;{i + 1}. {question.part_b?.split(',')[i]}</span>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <span className='mcq1-left'>{question.part_a?.split(',').map((a, i) => (
            <div key={i}>
              <br />
              <div style={{ width: '100%' }}>
                <span className='mcq1-left'>{String.fromCharCode(65 + i)}.{a}</span>
              </div>
            </div>
          )) || ''}</span>
        )}
      </>
    ))}
</TableCell>

  {/* <TableCell>
  {question.question || (
    <>
      {question.title && (
        <>
          {question.title}
          {question.part_b ? (
            <>
              {question.part_a?.split(',').map((a, i) => (
                <div key={i}>
                  <br />
                  <div style={{ width: "100%" }}>
                    <span className='mcq1-left'>{String.fromCharCode(65 + i)}.{a}</span>
                    {question.part_b?.split(',')[i] && (
                      <span className='mcq1-right'>&nbsp;&nbsp;&nbsp;&nbsp;{i + 1}. {question.part_b?.split(',')[i]}</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <span className='mcq1-left'>
              {question.part_a?.split(',').map((a, i) => (
                <div key={i}>
                  <br />
                  <div style={{ width: "100%" }}>
                    <span className='mcq1-left'>{String.fromCharCode(65 + i)}.{a}</span>
                  </div>
                </div>
              )) || ''}
            </span>
          )}
        </>
      )}
    </>
  )}
</TableCell> */}
    <TableCell>{question.answer || question.ans}</TableCell>
    <TableCell>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleDelete(question.q_id ? question.q_id : question.title || question.QuestionTitle)}
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

export default DraftPreview;