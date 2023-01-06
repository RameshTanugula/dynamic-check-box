import * as React from 'react'
import api from '../services/api';
import './flashCard.css';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


export default function CreatePairs() {
    // const serverUrl = `http://localhost:8080/pairs/`;
    const serverUrl = `http://3.111.29.120:8080/pairs/`;
    const initTypes = [{ value: 'bitbank', label: 'BitBank' },
    { value: 'statements', label: 'Statements' }];
    const [data, setData] = React.useState([]);
    const [typeList, setTypeList] = React.useState([...initTypes]);
    const [type, setType] = React.useState(initTypes[0].value);
    const [part_a, setPart_a] = React.useState("");
    const [part_b, setPart_b] = React.useState("");
    const [pairList, setPairList] = React.useState([]);
    const [selectedId, setSelectedId] = React.useState("");
    const [tags, setTags] = React.useState("");
    React.useEffect(() => {
        async function fetchData() {
            const response = await api(null, serverUrl + 'get/list/' + type, 'get');
            if (response.status === 200) {
                setData(response.data)
            }
        }
        fetchData();
    }, [type])

    const renderSelect = () => {
        return (
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={type}
                onChange={(e) => setType(e.target.value)}
            >

                {typeList.map((tl) => { return (<MenuItem value={tl.value}>{tl.label}</MenuItem>) })}
            </Select>
        )
    }
    const getSelectionHandler = () => {
        const selection = window.getSelection()?.toString();
        if (part_a === "") {
            setPart_a(selection);
            setPart_b("");
        } else if (part_b === "") {
            setPart_b(selection)
        }
    };
    const onClickHandler = (d) => {
        setSelectedId(d.id);
        setTags(d.tags);
    }
    const renderContent = () => {
        return (
            <div>
                {data.map((d => {
                    return <span onClick={() => onClickHandler(d)} style={{ display: 'flex' }}><p>{d.question} &nbsp;</p> <p> -&nbsp;{d.answer}</p></span>
                }))}
            </div>
        )
    }
    const renderPairContent = () => {
        return (
            <div>
                <span><input type="text" value={part_a} /> <input type="text" value={part_b} /></span>
            </div>
        )
    }
    const addToPairBox = () => {
        if (!(part_a && part_b)) {
            alert('please select the values');
        } else {
            pairList.push({ part_a: part_a, part_b: part_b, selectedId: selectedId, type: type, tags: tags });
            setPart_a("");
            setPart_b("");
            setPairList([...pairList]);
        }
    }
    const getPairedContent = () => {
        return (
            <><table>
                <tr>
                    <th>S.No.</th>
                    <th>Part A</th>
                    <th>Part B</th>
                </tr>
                {pairList?.map((p, i) => {
                    return (<tr>
                        <td>{i + 1}.</td>
                        <td>{p.part_a}</td>
                        <td>{p.part_b}</td>
                    </tr>)
                })
                }

            </table>
                <button type="button" onClick={savePairs}>
                    Save Pairs
                </button>
            </>
        )
    }
    const savePairs = async () => {
        if (pairList && pairList.length > 0) {
            const response = await api(pairList, serverUrl + 'save', 'post');
            if (response.status === 200) {

                const responseList = await api(null, serverUrl + 'get/list/' + type, 'get');
                if (responseList.status === 200) {
                    setData(responseList.data)
                }
                setPairList([]);
                setPart_a("");
                setPart_b("");
                alert("Pairs Saved!")
            }
        } else {
            alert('Please Generate Pairs')
        }
    }
    return (
        <div >
            <div>
                {renderSelect()}
            </div>

            <div style={{ width: '100%' }}>
                <div style={{ textAlign: 'end' }}>
                    <div>
                        <button type="button" onClick={getSelectionHandler}>
                            Copy Selection
                        </button>
                        <br />
                        <br />
                    </div>
                    {renderPairContent()}
                    <div>
                        <br />
                        <button type="button" onClick={addToPairBox}>
                            Add
                        </button>
                        <br />
                        <br />
                    </div>
                    <div style={{ width: '50%', float: 'right' }}>
                        {pairList?.length > 0 && getPairedContent()}
                    </div>
                    <div>
                        <br />
                    </div>
                </div>
                <div style={{ width: '50%', height: '30rem', overflow: 'auto' }}>
                    {data?.length > 0 && renderContent()}
                </div>


            </div>

        </div>
    )
}