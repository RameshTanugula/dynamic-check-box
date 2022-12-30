import React, { Component, useState } from 'react';
import api from '../services/api';
import './flashCard.css';

export default function FileUpload() {

	// const serverUrl = `http://localhost:8080/files/`
	  const serverUrl = `http://3.111.29.120:8080/files/`
	const [selectedFile, setSelectedFile] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [list, setList] = useState([]);
	const [showTable, setShowTable] = useState(true);
	const [selectedSubject, setSelectedSubject] = useState()
	React.useEffect(() => {
		async function fetchData() {
			const subData = await api(null, serverUrl + 'get/subjects', 'get');

			if (subData.status === 200) {
				setSelectedSubject(subData.data[0].id)
				setSubjects(subData.data)
			}
			const listData = await api(null, serverUrl + 'get/file/list', 'get');

			if (listData.status === 200) {
				setList(listData.data)
			}

		}
		fetchData();
	}, []);
	// On file select (from the pop up)
	const onFileChange = event => {

		setSelectedFile(event.target.files);

	};

	// On file upload (click the upload button)
	const onFileUpload = async () => {

		// Create an object of formData
		if (selectedFile?.length > 0) {
			const formData = new FormData();

			for (let i = 0; i < selectedFile?.length; i++) {
				formData.append(
					"files", selectedFile[i],
				);
			}
			formData.append('selectedSubject',
				selectedSubject)
			const data = await api(formData, serverUrl + 'upload', 'post');
			if (data.status === 200) {
				const data = await api(null, serverUrl + 'get/subjects', 'get');
				const listData = await api(null, serverUrl + 'get/file/list', 'get');

				if (listData.status === 200) {
					setList(listData.data)
				}
				if (data.status === 200) {
					setSelectedSubject(data.data[0].id)
					setSubjects(data.data)
				}
				alert('File uploaded!')
				setSelectedFile([])
				setShowTable(true);
			}
		} else {
			alert('Please choose file to uplad!')
		}
	};
	const fileData = () => {

		return (
			<div>
				<br />
				<h4>Choose before the Upload</h4>
			</div>
		);

	};
	return (
		<div>
			{showTable && <div style={{ width: "60%", textAlign: "right", paddingBottom: '2rem' }}>
				<button style={{ height: '2rem' }} onClick={() => setShowTable(false)}>Upload new Document</button>
			</div>}
			{showTable && <table>
				<tr>
					<th>S.No.</th>
					<th>Subject</th>
					<th>Url</th>
				</tr>
				{list?.map((c, i) => {
					return (<tr>
						<td>{i + 1}</td>
						<td>{c.name}</td>
						<td>{c.location_url}</td>
					</tr>)
				})
				}

			</table>}
			{!showTable &&
				<div style={{ paddingTop: '2rem', textAlign: 'center' }}>

					<div>
						<select onChange={(e) => { setSelectedSubject(e.target.value) }}>
							{subjects.map(s => {
								return <option value={s.id}>{s.name}</option>
							})}</select>
					</div>
					<div style={{ paddingTop: '2rem' }}>
						<input type="file" multiple onChange={onFileChange} />
						<button onClick={onFileUpload}>
							Upload
						</button>
					</div>
					{fileData()}
				</div>}
		</div>
	);
}

