import * as React from 'react'
import CheckboxTree from 'react-dynamic-checkbox-tree';
import subjectJson from './subject.json';
import examinationsJson from './examinations.json';
import conceptsJson from './concepts.json';
import sourceJson from './source.json';
import api from './services/api';

const treeViewData = [
  examinationsJson,
  subjectJson,
  conceptsJson,
  sourceJson,
];

export default function App() {
  // const serverUrl = `http://localhost:3000/`
  const serverUrl = `http://65.2.168.137:8080/`
  const [checked, setChecked] = React.useState([]);
  const [allCheckBoxValue, setAllCheckBoxValue] = React.useState(false);
  const [questionData, setQuestionData] = React.useState([]);
  const [from, setFrom] = React.useState(null);
  const [to, setTo] = React.useState(null);
  const [qFrom, setQFrom] = React.useState(null);
  const [qTo, setQTo] = React.useState(null);
  const [catagoryData, setCategoryData] = React.useState([]);
  const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
  const tmpData = { viewData: treeViewData }
  const result = tmpData.viewData.flatMap(flat);
  const getTagName = (id) => {
    return result?.find(r => r.id === +id)?.label;
  }




  React.useEffect(() => {
    async function fetchData() {
      // You can await here  
      const data = await api(null, serverUrl+'get/data', 'get');
      const catData = await api(null, 'http://3.111.198.158/api/AdminPanel/GetCategoryTrees', 'get');
      console.log(catData, 'catData$$')
      // if(catData.status ===200){
      //   let catTmp = [catData.data.lstExaminitations[0], 
      //   catData.data.lstSubject[0],
      //   catData.data.lstConcepts[0],
      //   catData.data.lstSubject[0]];
      //   catTmp = catTmp.map((m)=>{m.label=m.text; return m})
      //   setCategoryData([...catTmp]);
      //   console.log(catTmp, 'catTmp', catagoryData, treeViewData)
      // }
      console.log(data, '$$$$data')
      if (data.status === 200) {
        setQuestionData(data.data?.res)
      }
    }
    fetchData();
  }, []);
  const getQuestions = async () => {
    if (from && to) {
      const data = await api(null, serverUrl+'get/data/' + from + '/' + to, 'get');
      if (data.status === 200) {
        setQuestionData(data.data.res);
      }
    } else {
      alert('please try with from and to values')
    }
  }
  const onClickCheckBox = (id, index) => {
    if (id && index >= 0) {
      setAllCheckBoxValue(false);
      questionData[index]['checked'] = !questionData[index]['checked'];
    } else {
      setAllCheckBoxValue(!allCheckBoxValue)
      questionData.map(q => q.checked = !allCheckBoxValue)
    }
    setQuestionData(questionData);
  }
  const removeTag = async (tagId, i, qId) => {
    const data = await api({ tagToBeRemoved: tagId }, serverUrl+'delete/tag/' + qId, 'put');
    if (data.status === 200) {
      const data = await api(null, serverUrl+'get/data', 'get');
      if (data.status === 200) {
        setQuestionData(data.data.res);
      }
    }
    // /delete/tag
  }
  const applyTags = async () => {
    const selectedQuestions = questionData.filter(q => q.checked)?.map(sq => sq.q_id)
    if (selectedQuestions?.length > 0 && checked?.length > 0) {

      const catIds = generateCategoryIds(checked);
      const data = await api({ selectedQuestions, checked: catIds }, serverUrl+'add/tags', 'post');
      if (data.status === 200) {
        const data = await api(null, serverUrl+'get/data', 'get');
        if (data.status === 200) {
          setQuestionData(data.data.res);
        }
      }
    } else {
      alert('please select categories and question to apply tags')
    }
  }
  function removeDuplicates(arr) {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
  }
  const generateCategoryIds = (checkedIds) => {

    let selCatIds = [];
    if (checkedIds?.length > 0) {
      for (let i = 0; i < checkedIds.length; i++) {
        selCatIds = selCatIds.concat(getPath(result, checkedIds[i]));

      }
      return removeDuplicates(checkedIds.concat(selCatIds));
    }
    return [];
  }

  const applyTagsToQset = async () => {
    let selectedQuestions = [];
    questionData.map((q) => {
      if ((q.q_id >= qFrom) && (q.q_id <= qTo)) {
        selectedQuestions.push(q.q_id);
      }
      return q;
    })
    if (selectedQuestions?.length > 0 && checked?.length > 0) {
      const catIds = generateCategoryIds(checked);
      const data = await api({ selectedQuestions, checked: catIds }, serverUrl+'add/tags', 'post');
      if (data.status === 200) {
        const data = await api(null, serverUrl+'get/data', 'get');
        if (data.status === 200) {
          setQuestionData(data.data.res);
        }
      }
    } else {
      alert('please select categories and question to apply tags')
    }
  }
  function getPath(object, search) {
    if (object.id === search) return [object.id];
    else if ((object.lstSubCatagoryTree) || Array.isArray(object)) {
      let children = Array.isArray(object) ? object : object.lstSubCatagoryTree;
      for (let child of children) {
        let result = getPath(child, search);
        if (result) {
          if (object.id) result.unshift(object.id);
          return result;
        }
      }
    }
  }
  console.log(questionData, 'questionData==>')
  return (
    <div>
      <div style={{ marginTop: '2%', paddingLeft: '10%' }}>
        <span>From:</span><input type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
        <span>To:</span><input type="text" value={to} onChange={(e) => setTo(e.target.value)} /><br /><br />
        <button onClick={() => { getQuestions() }}>Get Questions</button>

      </div>
      <button onClick={() => { applyTags() }}>Apply Tags</button>

      <div style={{ height: '15rem', overflow: 'auto', marginTop: '5%', width: '55%', float: 'left', paddingLeft: '5%', paddingTop: '5%' }}>

        <div style={{ marginTop: '2%', paddingLeft: '10%' }}>
          <span>From:</span><input type="text" value={qFrom} onChange={(e) => setQFrom(e.target.value)} />
          <span>To:</span><input type="text" value={qTo} onChange={(e) => setQTo(e.target.value)} /><br /><br />
          <button onClick={() => { applyTagsToQset() }}>Apply Tags </button>

        </div>
        {questionData?.length > 0 && <><p>Select All:</p><input checked={allCheckBoxValue} value={allCheckBoxValue} onClick={() => onClickCheckBox()} type="checkbox" /></>}

        {questionData?.length > 0 &&
          questionData?.map((qData, i) => {
            return (
              <div style={{ padding: '5px' }}>

                <div style={{ display: 'flex' }}>
                  <div><input checked={qData.checked} onClick={() => onClickCheckBox(qData.q_id, i)} type="checkbox" /></div>
                  <div style={{
                    paddingTop: '5px',
                    border: '1px solid blue'
                  }}><span>Question: {qData.question}</span> <br/>
                  <span>Answer: {qData.answer}</span>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  {qData.tags &&
                    qData.tags?.split(',')?.sort()?.map((tg, j) =>
                      <div style={{ paddingRight: '5px' }}>
                        <span><button onClick={() => removeTag(tg, j, qData.q_id)}>{getTagName(tg)} X</button></span>
                      </div>)}
                </div>
              </div>)
          })
        }
      </div>
      <div style={{ width: '20%', float: 'right', paddingRight: '5%', paddingTop: '5%' }}>
        {/* <p>{catagoryData[0]?.CatagoryName}</p> */}
        <CheckboxTree
          nodes={treeViewData}
          // nodes={catagoryData}
          checked={checked}
          onCheck={checked => setChecked(checked)}
          onClick={(e) => onClickCheckBox(e)}
        />
      </div>

    </div>
  )
}