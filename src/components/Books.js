import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import * as securedLocalStorage from "./SecureLocalaStorage";
import * as CheckAccess from "./CheckAccess";
import api from '../services/api';
import SnackBar from './SnackBar';
import Loader from './Loader';
import { DataGrid } from '@mui/x-data-grid';

export default function Books() {
    const serverUrl = securedLocalStorage.baseUrl + 'books/';
    const [readAndWriteAccess, setReadAndWriteAccess] = React.useState(false);
    const [isValid, setIsValid] = React.useState(false);
    const [booksData, setBooksData] = React.useState([]);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [showLoader, setShowLoader] = React.useState(false);
    const [showSreen, setShowSreen] = React.useState("Grid");
    const [buttonName, setButtonName] = React.useState("save");
    const [updateRow, setUpdateRow] = React.useState("");
    const [coverPageName, setCoverPageName] = React.useState("");
    const [samplePageName, setSamplePageName] = React.useState("");

    const columns = [
        { field: 'title', headerName: 'Book Title', minWidth: 250, },
        { field: 'author', headerName: 'Author', minWidth: 250, },
        { field: 'edition', headerName: 'Edition', minWidth: 200, },
        { field: 'isbn_number', headerName: 'ISBN Number', minWidth: 200, },
        { field: 'book_description', headerName: 'Description', minWidth: 400, },
        {
            field: '', headerName: 'Action', minWidth: 150,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" disabled={!readAndWriteAccess} onClick={() => updateBookData(params.row)} >Update</Button>
                    </Stack>)
            }
        },
    ];

    const defaultBookFields = {
        bookTiltle: "",
        edition: "",
        authorName: "",
        isbnNumber: "",
        coverPage: "",
        bookSample: "",
        bookDescription: "",
    }

    const [bookForm, setBookForm] = React.useState(defaultBookFields);

    const errorFields = {
        bookTiltle: "",
        edition: "",
        authorName: "",
        isbnNumber: "",
        coverPage: "",
        bookSample: "",
        bookDescription: "",

    }
    const [errors, setErrors] = React.useState(errorFields);

    function handleChange(e) {
        let value = e.target.value;
        if (e.target.name === "coverPage" || e.target.name === "bookSample") {
            value = e.target.files[0];
        }
        const newData = {
            ...bookForm,
            [e.target.name]: value
        }
        setBookForm(newData);
        checkIsValid(e.target.name, e.target.value)
    }

    const checkIsValid = (name, value) => {
        if (value === "") {
            errors[name] = name;
        }
        else {
            errors[name] = "";
        }
    };

    function valid() {
        let retunValue = false;
        let result = Object.keys(bookForm).filter(ele => !bookForm[ele]);
        if (result.includes("isbnNumber")) {
            result.splice(result.indexOf('isbnNumber'), 1);
        }
        if (result.length === 0) {
            retunValue = true;
        }
        else {
            setIsValid(true);
            for (const v of result) {
                errors[v] = v
            }
            retunValue = false;
        }
        return retunValue;
    }

    function updateBookData(row) {
        setCoverPageName(row.cover_page_url);
        setSamplePageName(row.content_page_url);
        setShowSreen("Form")
        setButtonName("Update");
        setUpdateRow(row);
        bookForm.bookTiltle = row.title;
        bookForm.edition = row.edition;
        bookForm.authorName = row.author;
        bookForm.isbnNumbe = row.isbn_number;
        bookForm.bookDescription = row.book_description;
        bookForm.coverPage = row.cover_page_url;
        bookForm.bookSample = row.content_page_url;
        setBookForm(bookForm)
    }

    async function saveBookData() {
        if (valid()) {
            const payload = {
                bookTiltle: bookForm.bookTiltle,
                edition: bookForm.edition,
                authorName: bookForm.authorName,
                isbnNumber: bookForm.isbnNumber,
                bookDescription: bookForm.bookDescription,
            }
            if (buttonName === "Update") {
                payload.id = updateRow.id;
                if (typeof bookForm.coverPage !== 'string') {
                    payload.oldCoverUrl = updateRow.cover_page_url;
                }
                if (typeof bookForm.bookSample !== 'string') {
                    payload.oldContentUrl = updateRow.content_page_url;
                }
            }
            const formData = new FormData();
            formData.append(
                "files", bookForm.coverPage,
            );
            formData.append(
                "files", bookForm.bookSample,
            );

            formData.append(
                "bookdata", JSON.stringify(payload)
            );
            const resp = await api(formData, serverUrl + "save/update ", 'post');
            if (resp.status === 200) {
                setShowSreen("Grid");
                setOpenSnackBar(true);
                const data = {
                    type: "success",
                    message: buttonName === "save" ? "Books data saved sucessfully!...." : "Books data updated successfully!..."
                }
                setSnackBarData(data);
                getBooksData();
            }
            else {
                setOpenSnackBar(true);
                const data = {
                    type: "error",
                    message: resp.response.data.errorMsg
                }
                setSnackBarData(data);
            }
        }
    }

    function resetBookForm() {
        setCoverPageName("");
        setSamplePageName("");
        setBookForm(defaultBookFields);
        setErrors(errorFields);
        if(document.getElementById("file") && document.getElementById("file1")){
            document.getElementById("file").value = "";
            document.getElementById("file1").value = "";
        }
        setIsValid(false);
    }

    function closeSnakBar() {
        setOpenSnackBar(false)
    }

    const getBooksData = async () => {
        setShowLoader(true);
        const url = serverUrl + "list";
        const resp = await api(null, url, 'get');
        if (resp.status === 200) {
            setBooksData(resp.data);
            setShowLoader(false);
        }
    }

    React.useEffect(() => {
        const currentScreen = (window.location.pathname.slice(1)).replace(/%20/g, ' ');
        if (CheckAccess.checkAccess(currentScreen, 'read') && CheckAccess.checkAccess(currentScreen, 'write')) {
            setReadAndWriteAccess(true);
        }
        getBooksData();
    }, []);

    return (
        <div>
            {showSreen === "Grid" &&
                <span>
                    <Button variant="contained" onClick={() => { setShowSreen("Form"); resetBookForm(); setButtonName("save"); }}>Add Book</Button>
                    <div style={{ height: 370, width: '100%', marginTop: "5px" }}>
                        <DataGrid
                            rows={booksData}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            getRowId={(row) => row.id}
                        />
                    </div>
                </span>
            }
            {showSreen === "Form" &&
                <Grid container spacing={1}  style={{marginTop:"20px"}} >
                    <Grid item xs={1} />
                    <Grid item xs={4} >
                        <TextField
                            label="Book Title"
                            required
                            id="outlined-start-adornment"
                            sx={{ width: '100%' }}
                            value={bookForm.bookTiltle}
                            onChange={handleChange}
                            name="bookTiltle"
                            error={errors.bookTiltle !== ""}
                            helperText={errors.bookTiltle !== "" ? 'Book Title is reuired' : ' '}
                            disabled={!readAndWriteAccess}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            label="Edition"
                            required
                            id="outlined-start-adornment"
                            sx={{ width: '100%' }}
                            value={bookForm.edition}
                            onChange={handleChange}
                            name="edition"
                            error={errors.edition !== ""}
                            helperText={errors.edition !== "" ? 'Edition Name is reuired' : ' '}
                            disabled={!readAndWriteAccess}
                        />
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={1} />
                    <Grid item xs={4} >
                        <TextField
                            label="Auther Name"
                            required
                            id="outlined-start-adornment"
                            sx={{ width: '100%' }}
                            value={bookForm.authorName}
                            onChange={handleChange}
                            name="authorName"
                            error={errors.authorName !== ""}
                            helperText={errors.authorName !== "" ? 'Auther Name is reuired' : ' '}
                            disabled={!readAndWriteAccess}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            label="Isbn Number"
                            id="outlined-start-adornment"
                            sx={{ width: '100%' }}
                            value={bookForm.isbnNumber}
                            onChange={handleChange}
                            name="isbnNumber"
                            type="number"
                            disabled={!readAndWriteAccess}
                        />
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={1} />
                    <Grid item xs={3} >
                        <span>Cover Page *</span>
                        <div >
                            <input id="file" type="file" name="coverPage" onChange={handleChange} disabled={!readAndWriteAccess} />
                        </div>
                        {errors.coverPage !== "" ? <span style={{ color: "#d32f2f" }}> Cover Page is reuired </span> : ""}

                    </Grid>
                    <Grid item xs={1} style={{ marginTop: "30px" }}>
                        {coverPageName !== "" && <a href={updateRow.cover_page_url} style={{ color: "blue", textDecoration: "underline", marginTop: "30px" }} >download</a>}
                    </Grid>
                    <Grid item xs={3}  >
                        <span>BooK Sample *</span>
                        <div >
                            <input id="file1" type="file" name="bookSample" onChange={handleChange} disabled={!readAndWriteAccess} />
                        </div>
                        {errors.bookSample !== "" ? <span style={{ color: "#d32f2f", }}> Book Sample is reuired </span> : ""}

                    </Grid>
                    <Grid item xs={1} style={{ marginTop: "30px" }}>
                        {samplePageName !== "" && <a href={updateRow.content_page_url} style={{ color: "blue", textDecoration: "underline" }}>download</a>}
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={1} />
                    <Grid item xs={6} style={{ marginTop: "10px" }}>
                        <TextField
                            required
                            id="outlined-multiline-static"
                            label="Book Description"
                            sx={{ width: '100%' }}
                            multiline
                            value={bookForm.bookDescription}
                            name="bookDescription"
                            onChange={handleChange}
                            rows={4}
                            error={errors.bookDescription !== ""}
                            helperText={errors.bookDescription !== "" ? 'Book Description is reuired' : ' '}
                            disabled={!readAndWriteAccess}
                        />
                    </Grid>

                    <Grid item xs={5} />
                    <Grid item xs={1} />
                    <Grid item xs={10} style={{ marginTop: "20px" }} >
                        <Stack spacing={2} direction="row" >
                            <Button variant="contained" onClick={() => setShowSreen("Grid")}>Back</Button>
                            <Button variant="contained" onClick={() => resetBookForm()}>reset</Button>
                            <Button variant="contained" onClick={() => saveBookData()}>{buttonName}</Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
            {openSnackBar &&
                <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />
            }
            {showLoader &&
                <Loader />
            }
        </div>
    )

}