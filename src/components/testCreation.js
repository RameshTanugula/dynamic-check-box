import * as React from 'react'
import CheckboxTree from 'react-dynamic-checkbox-tree';
import api from '../services/api';
import './common.css';


export default function TestCreation() {
    // const serverUrl = `http://localhost:8080/test/`
      const serverUrl = `http://3.111.29.120:8080/test/`
    const [checked, setChecked] = React.useState([]);
    const [allCheckBoxValue, setAllCheckBoxValue] = React.useState(false);
    const [questionData, setQuestionData] = React.useState([]);
    const [testName, setTestName] = React.useState('');
    const [testDesc, setTestDesc] = React.useState('');
    const [testDur, setTestDur] = React.useState(0);
    const [testNoOfQuestions, setTestNoOfQuestions] = React.useState(0);
    const [showForm, setShowForm] = React.useState(true);
    const [catagoryData, setCategoryData] = React.useState([]);
    const [result, setResult] = React.useState([]);
    




    React.useEffect(() => {
        async function fetchData() {
            // You can await here  
            const data = await api(null, serverUrl + 'get/data', 'get');
            // const catData = await api(null, 'http://3.111.198.158/api/AdminPanel/GetCategoryTrees', 'get');

            const catData = await api(null, serverUrl + 'get/categories', 'get');

            if (catData.status === 200) {
                setCategoryData(catData.data);
            }
            if (data.status === 200) {
                setQuestionData(data.data?.res)
            }
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
        async function getData() {
            const data = await api({ catIds: checked }, serverUrl + 'get/data/bycategory', 'post');
            if (data.status === 200) {
                setQuestionData(data.data?.res)
            }
        }
        getData();
    }, [checked])
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
    const handleSubmit = (e) => {
        if (testName && testDesc && testDur) {
            setShowForm(false)
        }
    }
    const addToTestHandler = async () => {
        const selectedQuestions = questionData.filter(q => q.checked);
        if (selectedQuestions && selectedQuestions?.length !== parseInt(testNoOfQuestions)) {
            window.alert('please verify selected no of questions')
        } else {
            const payload = {
                test_name: testName,
                test_duration: testDur,
                test_description: testDur,
                no_of_questions: testNoOfQuestions,
                question_ids: selectedQuestions.map(qi => qi.q_id),
                is_active: 1, created_by: 1, update_by: 1
            }
            const data = await api(payload, serverUrl + 'add/test', 'post');
            if(data.status === 200){
                alert(data.data.message);
                setShowForm(true);
                setTestName('');
                setTestDesc('');
                setTestNoOfQuestions(0);
                setTestDur('');

            }
        }
    }
    return (
        <div>
            {!showForm && <div>
                <div className='button-add'><span><button onClick={() => addToTestHandler()}>Add Test</button></span></div>
                <div style={{ width: '100%', float: 'left', paddingLeft: '5%', paddingTop: '5%' }}>
                    {catagoryData?.length > 0 && <CheckboxTree
                        // nodes={treeViewData}
                        nodes={catagoryData}
                        checked={checked}
                        onCheck={checked => setChecked(checked)}
                        onClick={(e) => onClickCheckBox(e)}
                    />
                    }
                </div>
                <br/>
                
                <div>
                    {questionData?.length > 0 &&
                        questionData?.map((qData, i) => {
                            return (
                                <div style={{ padding: '5px' }}>

                                    <div>
                                        <div><input checked={qData.checked} onClick={() => onClickCheckBox(qData.q_id, i)} type="checkbox" /></div>
                                        <div style={{
                                            paddingTop: '5px',
                                            border: '1px solid blue'
                                        }}><span>Question: {qData.question}</span> <br />
                                            <span>Answer: {qData.answer}</span>
                                        </div>
                                    </div>
                                    
                                </div>)
                        })
                    }
                </div>
            </div>}
            {showForm &&
                <div className="App">
                    <header className="App-header">
                        <form onSubmit={(e) => { handleSubmit(e) }}>
                            <label >
                                Test Name:
                            </label><br />
                            <input type="text" value={testName} required onChange={(e) => { setTestName(e.target.value) }} /><br />
                           
                            <label >
                                Test Description:
                            </label><br />
                            <textarea id="dur" name="w3review" rows="4" cols="50" value={testDesc} required onChange={(e) => { setTestDesc(e.target.value) }} ></textarea><br />
                           
                            <label>
                                Test Duration (in Min):
                            </label><br />
                            <input type="number" value={testDur} required onChange={(e) => { setTestDur(e.target.value) }} /><br />
                            <label>
                                No.Of Questions:
                            </label><br />
                            <input type="number" value={testNoOfQuestions} required onChange={(e) => { setTestNoOfQuestions(e.target.value) }} /><br />

                            <input type="submit" value="Submit" />
                        </form>
                    </header>
                </div>

            }
        </div>
    )
}