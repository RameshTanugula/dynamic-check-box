import * as React from 'react'
import { useState } from 'react';
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import Loader from './circularProgress';


export default function Mapping() {
  // const serverUrl = `http://localhost:8080/`
  const serverUrl = `http://3.111.29.120:8080/`
  const [checked, setChecked] = useState([]);
  const [allCheckBoxValue, setAllCheckBoxValue] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [qFrom, setQFrom] = useState(null);
  const [qTo, setQTo] = useState(null);
  const [catagoryData, setCategoryData] = useState([]);
  const [result, setResult] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] =useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRange, setIsRange] = useState(false);
  const contentTypeList = [{label:"Content Type", value:null},{label:"Bit Bank",value:"bitbank"}, {label:"Questions", value:"questions"}]
  const getTagName = (id) => {
    return result?.find(r => r.id === +id)?.label;
  }

  React.useEffect(() => {
    async function fetchData() {
      // You can await here 
      setLoading(true);
      const user = await api(null, serverUrl + 'get/users', 'get');
      if(user.status === 200){
        // setSelectedUser(user.data.res[0].user);
        setUser(user.data.res);
        if(user?.data?.res[0]?.user && type){
        const data = await api(null, serverUrl + 'get/data/'+type+'/'+user.data.res[0].user, 'get');
        if (data.status === 200) {
          setQuestionData(data.data?.res)
        }
      }
      }
      const catData = await api(null, serverUrl + 'get/categories', 'get');

      if (catData.status === 200) {
        setCategoryData(catData.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  React.useEffect(() => {
    const flat = ({ hostNames, children = [], ...o }) => [o, ...children.flatMap(flat)];
    const tmpData = { viewData: catagoryData }
    const tmpResult = tmpData.viewData.flatMap(flat);
    setResult([...tmpResult])
  }, [catagoryData])
  React.useEffect(() => {
    async function fetchData() {
      if(selectedUser && type){
        setLoading(true);
    const data = await api(null, serverUrl + 'get/data/'+type+'/'+selectedUser, 'get');
    if (data.status === 200) {
      setQuestionData(data.data?.res)
    }
    setLoading(false);
  }
  }
  fetchData();
  }, [type])
  const getQuestions = async () => {
    if (from && to) {
      setLoading(true);
      const data = await api(null, serverUrl + 'get/data/'+type+'/'+selectedUser +'/'+ from + '/' + to, 'get');
      if (data.status === 200) {
        setQuestionData(data.data.res);
        setFrom("");
        setTo("");
      }
      setLoading(false);
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
    setLoading(true);
    const data = await api({ tagToBeRemoved: tagId }, serverUrl + 'delete/tag/' + type +'/' + qId, 'put');
    if (data.status === 200) {
      const data = await api(null, serverUrl + 'get/data/'+ type +'/' + selectedUser, 'get');
      if (data.status === 200) {
        setQuestionData(data.data.res);
      }
    }
    setLoading(false);
    // /delete/tag
  }
  const applyTags = async () => {
    console.log(isRange, from , to, 'applytags******');
    const selectedQuestions = questionData.filter(q => q.checked)?.map(sq => sq.q_id)
    if (selectedQuestions?.length > 0 && checked?.length > 0) {

      // const catIds = generateCategoryIds(checked);
      const catIds = getExpandedKeys();
      setLoading(true);
      const data = await api({ selectedQuestions, checked: catIds, type }, serverUrl + 'add/tags', 'post');
      if (data.status === 200) {
        const data = await api(null, serverUrl + 'get/data/'+ type +'/' +selectedUser, 'get');
        if (data.status === 200) {
          setQuestionData([...data.data.res]);
          setChecked([])
        }
      }
      setLoading(false);
    } else {
      alert('please select categories and question to apply tags')
    }
  }
  const removeDuplicates = (arr)=> {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
  }
  const getTreePath=(model, id)=> {
    let path,
        item = model.id ;

    if (!model || typeof model !== 'object') {
        return;
    }

    if (model.id === id) {
        return [item];
    }

    (model.children || []).some(child => (path = getTreePath(child, id)));
    return path && [item, ...path];
}

const getExpandedKeys=()=> {
  let expandedKeys = [];
    if (checked && checked.length > 0) {
        checked.forEach(k => {
          catagoryData.forEach(
                mt => {
                    const result = getTreePath(mt, k);
                    if (result) {
                        expandedKeys.push(...result);
                    }
                }
            );
        });
    }
    return removeDuplicates(expandedKeys);
}

// this.setExpandedKeys();
//   const generateCategoryIds = (checkedIds) => {
//     let selCatIds = [];
//     if (checkedIds?.length > 0) {
//       for (let i = 0; i < checkedIds.length; i++) {
//         selCatIds = selCatIds.concat(getPath(result, checkedIds[i]));

//       }
//       return removeDuplicates(checkedIds.concat(selCatIds));
//     }
//     return [];
//   }

  const applyTagsToQset = async () => {
    let selectedQuestions = [];
    questionData.map((q) => {
      if ((q.q_id >= from) && (q.q_id <= to)) {
        selectedQuestions.push(q.q_id);
      }
      return q;
    })
    if (selectedQuestions?.length > 0 && checked?.length > 0) {
      // const catIds = generateCategoryIds(checked);
      const catIds = getExpandedKeys();console.log(catIds, 'catIds****')
      setLoading(true);
      const data = await api({ selectedQuestions, checked: catIds, type }, serverUrl + 'add/tags', 'post');
      if (data.status === 200) {
        setFrom("");
        setTo("");
        setChecked([]);
        const data = await api(null, serverUrl + 'get/data/'+ type + '/'+ selectedUser, 'get');
        if (data.status === 200) {
          setQuestionData(data.data.res);
        }
      }
      setLoading(false);
    } else {
      alert('please select categories and question to apply tags')
    }
  }
//   function getPath(object, search) {
    
//     if (object.id === search) return [object.id];
//     else if ((object.children) || Array.isArray(object)) {
//       let children = Array.isArray(object) ? object : object.children;
//       for (let child of children) {
//         let result = getPath(child, search);
//         if (result) {
//           if (object.id) result.unshift(object.id);
//           return result;
//         }
//       }
//     }
//   }
  const onChangeUser=async (user)=>{
    setSelectedUser(user);
    setQuestionData([])
    setLoading(true);
    const data = await api(null, serverUrl + 'get/data/'+ type + '/' + user, 'get');
    if (data.status === 200) {
      setQuestionData(data.data?.res)
    }
    setLoading(false);
  }
  const onChangeRange=()=>{
    setIsRange(!isRange);
    setFrom("");
    setTo("");
  }
  return (
    <>
    {/* {loading && <Loader />} */}
    {/* {loading && "Loading...!"} */}
    { <div>
      <div style={{}}>
        <span><select value={selectedUser} onChange={(e)=>onChangeUser(e.target.value)}>
        <option  value={""}>Select User</option>
          { user && user?.map((u, i)=> {
            return(
            <option key={i} value={u.user}>{u.user}</option>
            )
            })}
          </select>
          </span>
          &nbsp;&nbsp;<span><select onChange={(e)=>setType(e.target.value)}>
          { contentTypeList.map((c, i)=> {
            return(
            <option key={i} value={c.value}>{c.label}</option>
            )
            })}
          </select>
          </span>
          <span><input type="checkbox"  checked={isRange} onClick={()=>onChangeRange()}/> Select Range</span>
          {/* <span>Questions:<input type="checkbox" checked={type==="questions"} onClick={()=>setType("questions")}/>
           BitBank:<input type="checkbox" checked={type==="bitbank"} onClick={()=>setType("bitbank")}/> </span> */}
          
          &nbsp;&nbsp;&nbsp;&nbsp;<input placeholder='From:' type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
          &nbsp;&nbsp;<input type="text" placeholder='To:' value={to} onChange={(e) => setTo(e.target.value)} />
        &nbsp;&nbsp;&nbsp;{!isRange && <button onClick={() => { (!isRange && from && to) ? applyTagsToQset() : applyTags() }}>Add Tags</button>}
        {isRange && <button onClick={() => { getQuestions() }}>Get Questions</button>}

      </div>
      {/* <button onClick={() => { applyTags() }}>Apply Tags</button> */}

      <div style={{ height: '30rem', overflow: 'auto', marginTop: '5%', width: '65%', float: 'left', paddingLeft: '5%', paddingTop: '5%' }}>

        {/* <div style={{ marginTop: '2%', paddingLeft: '10%' }}>
          <span>From:</span><input type="text" value={qFrom} onChange={(e) => setQFrom(e.target.value)} />
          <span>To:</span><input type="text" value={qTo} onChange={(e) => setQTo(e.target.value)} /><br /><br />
          <button onClick={() => { applyTagsToQset() }}>Apply Tags </button>

        </div> */}
        {questionData?.length > 0 && <><p>Select All:</p><input checked={allCheckBoxValue} value={allCheckBoxValue} onClick={() => onClickCheckBox()} type="checkbox" /></>}

        {questionData?.length > 0 &&
          questionData?.map((qData, i) => {
            return (
              <div style={{ padding: '5px' }}>

                <div style={{ display: 'flex' }}>
                  <div>
                  <span>{qData.q_id}.</span>
                    <input checked={qData.checked} onClick={() => onClickCheckBox(qData.q_id, i)} type="checkbox" /></div>
                  <div style={{
                    paddingTop: '5px',
                    border: '1px solid blue'
                  }}>
                    
                    <span>Question: {qData.question}</span> <br />
                    <span>Answer: {qData.answer}</span>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  {qData.tags &&
                    qData.tags?.split(',')?.sort()?.map((tg, j) =>
                      <div style={{ paddingRight: '5px' }}>
                       {tg !=='' && <span><button onClick={() => removeTag(tg, j, qData.q_id)}>{getTagName(tg)} X</button></span>}
                      </div>)}
                </div>
              </div>)
          })
        }
      </div>
      <div style={{height:'30rem', width: '20%', float: 'right', paddingRight: '5%', marginTop:'5%', paddingTop: '5%', overflow: 'auto' }}>
        {catagoryData?.length > 0 && <CheckboxTree
          // nodes={treeViewData}
          nodes={catagoryData}
          checked={checked}
          onCheck={checked => setChecked(checked)}
          onClick={(e) => onClickCheckBox(e)}
        />}
      </div>

    </div>}
    </>
  )
}