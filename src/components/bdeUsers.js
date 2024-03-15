import { Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect } from 'react'
import api from '../services/api';
import * as securedLocalStorage from "./SecureLocalaStorage";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import { DataGrid } from '@mui/x-data-grid';
import SnackBar from './SnackBar';
import DeleteIcon from '@mui/icons-material/Delete';

const BdeUsers = () => {
    // const Razorpay = require('razorpay'); // Import Razorpay SDK
    const serverUrl = securedLocalStorage.baseUrl;
    const serverUrl1 = securedLocalStorage.baseUrl + 'course/';
    const [uploadedFileName, setUploadedFileName] = React.useState('');
    const [bdeUsersList, setBdeUsersList] = React.useState('');
    const [courseList, setCourseList] = React.useState('');
    const [selectedUser, setSelectedUser] = React.useState('');
    const [selectedCourse, setSelectedCourse] = React.useState('');
    const [files, setFiles] = React.useState('');
    const [promoCodesList, setPromoCodesList] = React.useState([]);
    const [selectedPromoCode, setSelectedPromoCode] = React.useState('');
    const [usersData, setUsersData] = React.useState([]);
    const [columns, setColumns] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [usersList, setUsersList] = React.useState([]);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackBarData, setSnackBarData] = React.useState();
    const [courseType, setCourseType] = React.useState();
    const [selectedCourseId, setSelectedCourseID] = React.useState();
    const [newUsersList, setNewUsersList] = React.useState();
    const [bdeId, setBdeId] = React.useState();
    const [selectedCoursePrice, setSelectedCoursePrice] = React.useState();
    const [selectedCourseDiscount, setSelectedCourseDiscount] = React.useState();
    const [totalAmount, setTotalAmount] = React.useState('');

    function closeSnakBar() {
        setOpenSnackBar(false);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFileName(file.name);
            setFiles(file)
        }

        // Read the uploaded Excel file
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            // Assuming the first sheet is the one you want to parse
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            // Convert the sheet data to JSON format
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            setUsersData(jsonData)
            console.log(usersData);
            // Log the parsed JSON data

            console.log('Parsed Excel data:', jsonData);
        };
        reader.readAsArrayBuffer(file)
    };

    //table data

    React.useEffect(() => {
        // Logic to compute columns and rows based on usersData state
        let newColumns = [];
        let newRows = [];
        let headers = ['First Name', 'Last Name', 'Email', 'Password', 'Mobile No', 'Address'];

        newColumns = headers.map((header, index) => ({
            field: `field${index}`,
            headerName: header,
            width: 150
        }));
        const deleteColumn = {
            field: 'delete',
            headerName: 'Delete',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteRow(params.row.id)}
                >
                    Delete
                </Button>
            ),
        };
        if (usersData?.length > 0) {
            let isValid = true;
            let errorMessages = [];
            const uniqueValuesSet = new Set();

            newRows = usersData.map((rowData, rowIndex) => {
                const rowObject = {};
                if (rowData) {
                    rowData.forEach((value, colIndex) => {
                        if (!/\S/.test(value)) { // Check if value is empty or only whitespace
                            isValid = false;
                            errorMessages.push(`Row ${rowIndex + 1}, Column ${colIndex + 1} is empty or contains only whitespace.`);
                        } else if (uniqueValuesSet.has(value)) { // Check if value is repeated
                            isValid = false;
                            errorMessages.push(`Value '${value}' in Row ${rowIndex + 1}, Column ${colIndex + 1} is repeated.`);
                        } else {
                            uniqueValuesSet.add(value); // Add value to the set to check for uniqueness
                        }
                        rowObject[`field${colIndex}`] = value;
                    });
                }
                return { id: rowIndex, ...rowObject };
            });

            if (!isValid) {
                // Handle validation error here, such as showing a message to the user
                alert(errorMessages.join('\n'));
                return;
            }
        }
        setColumns(newColumns);
        // setColumns([...newColumns, deleteColumn]);
        console.log(newColumns, 'columns');
        setRows(newRows);
        console.log(rows, 'rows');
    }, [usersData]);

    const handleDeleteRow = (rowId) => {
        // Filter out the row to be deleted based on its ID
        const updatedRows = rows.filter(row => row.id !== rowId);
        setRows(updatedRows);
    };

    React.useEffect(() => {
        async function fetchData() {
            const bdeUserData = await api(null, serverUrl + 'users/bde/list', 'get')
            console.log(bdeUserData?.data, 'userData');
            if (bdeUserData.status === 200) {
                setBdeUsersList(bdeUserData?.data);
                // console.log(bdeUsersList, 'user');
            }
            const courseData = await api(null, serverUrl + 'course/list', 'get')
            console.log(courseData?.data, 'courseData');
            if (courseData.status === 200) {
                setCourseList(courseData?.data);
                // console.log(courseList, 'courseList');
            }
            const promocodes = await api(null, serverUrl + "promocodes/list", 'post');
            console.log(promocodes, 'promocodes');
            if (promocodes.status === 200) {
                setPromoCodesList(promocodes?.data)
                console.log(promoCodesList, 'promocodelist***87');
            }
            const userData = await api(null, serverUrl + "users/list", 'get');
            console.log(userData?.data, 'userdata***151');
            if (userData.status === 200) {
                setUsersList(userData?.data)
                // console.log(usersList, 'userDatalist***87');
            }
        }
        fetchData();
    }, [])



    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
        let SelectedBID = bdeUsersList.find((bde) => bde.first_name === event.target.value);
        console.log(SelectedBID, 'SelectedBID***176');
        setBdeId(SelectedBID)
    };

    const handleCourseChange = (event, id) => {
        console.log(event, id);
        const selectedCourseTitle = event.target.value;
        setSelectedCourse(selectedCourseTitle);
        const selectedCourseObj = courseList.find(course => course.title === selectedCourseTitle);
        if (selectedCourseObj) {
            const courseId = selectedCourseObj.id;
            const courseType = selectedCourseObj.course_type;
            const coursePrice = parseFloat(selectedCourseObj.offerPrice);
            setSelectedCourseID(courseId);
            setCourseType(courseType);
            setSelectedCoursePrice(coursePrice);
        }

    };

    const handlePromoCodeChange = (e) => {
        const selectedPromoCodeValue = e.target.value;
        setSelectedPromoCode(selectedPromoCodeValue);
        console.log(selectedPromoCodeValue, 'promocode');
        const selectedPromoCodeObj = promoCodesList?.find(code => code.coupon_code === selectedPromoCodeValue);
        const discount = selectedPromoCodeObj ? parseFloat(selectedPromoCodeObj.discount) : 0;
        setSelectedCourseDiscount(discount);
    };

    useEffect(() => {
        if (selectedCoursePrice && selectedCourseDiscount && usersData.length > 0) {
            const discountedPrice = (parseFloat(selectedCoursePrice) * 100) - ((parseFloat(selectedCoursePrice) * 100) * parseFloat(selectedCourseDiscount) / 100);
            const newTotalCourseAmount = (discountedPrice * usersData.length) / 100;
            setTotalAmount(newTotalCourseAmount);
        }
    }, [selectedCoursePrice, selectedCourseDiscount, usersData])



    //submit

    const handleSubmit = async () => {


        const emails = [];
        const mobiles = [];
        const addresses = [];
        let discountedPrice
        let userIds = [];
        const newids = []

        rows.forEach(row => {
            const email = row.field2;
            const mobile = row.field4;
            const addres = row.field5;

            if (email) {
                emails.push(email);
                console.log(emails, 'allemails');
            }
            if (mobile) {
                mobiles.push(mobile);
            }
            if (addres) {
                addresses.push(addres)
            }
        });

        console.log(mobiles, 'mobiles');
        console.log(emails, 'allemails');

        const findMatchData = await api({ emails, mobiles }, serverUrl + 'users/search/list', 'post');
        console.log(findMatchData, 'data');
        if (findMatchData.status === 200) {
            const data = {

                type: "success",
                message: findMatchData.data.message
            };
            setOpenSnackBar(true);
            setSnackBarData(data);
            discountedPrice = (parseFloat(selectedCoursePrice) * 100) - ((parseFloat(selectedCoursePrice) * 100) * parseFloat(selectedCourseDiscount) / 100);
            console.log(discountedPrice, 'discountedPrice');
            const totalPrice = discountedPrice * usersData?.length;
            console.log('Total Amount:', totalPrice);
            var options = {
                key: "rzp_test_lm8VPKkm6VALiO",
                amount: totalPrice,
                currency: "INR",
                name: selectedCourse,
                description: courseList[0]?.description,
                // order_id:'963',
                prefill: {
                    name: selectedUser,
                    email: bdeId.email,
                    contact: bdeId.mobile,
                },
                "handler": async function (response) {
                    console.log(response);
                    alert(response.razorpay_payment_id);
                    alert(response?.http_status_code)
                    handlePaymentSuccess();
                    let BDEID = bdeId.id
                    const data1 = await api({ usersData, BDEID }, serverUrl + 'users/bde/bulk/add', 'post');
                    console.log(data1, 'data1**270');
                    if (data1?.status === 200) {
                        const data12 = await api({ emails, mobiles }, serverUrl + 'users/bde/register/users/list', 'post');
                        console.log(data12.data, 'new data');
                        if (data12.status === 200) {
                            // setCourseType(data12)
                            setNewUsersList(data12?.data)
                            let newUserIds = data12?.data.map(user => user.id);
                            console.log(newUsersList, newUserIds);
                            var formdata = [];
                            for (var i = 0; i < newUserIds.length; i++) {
                                formdata.push([
                                    newUserIds[i],
                                    discountedPrice / 100,
                                    selectedPromoCode,
                                    response?.http_status_code === 200 ? "success" : "failed",
                                    response.razorpay_payment_id,
                                    selectedCourseId,
                                    courseType,
                                    addresses[i]
                                ]);
                            }
                            console.log(formdata, 'formdata***268');
                            const purchase = await api({ formdata, BDEID }, serverUrl + 'orders/purchase/bde', 'post');
                            console.log(purchase, 'data');
                            if (purchase.status === 200) {
                                setSelectedCourse('');
                                setSelectedUser('');
                                setSelectedPromoCode('');
                                setUsersData('');
                                setFiles('');
                                setSelectedCoursePrice('');
                                setSelectedCourseDiscount('');
                                setTotalAmount('');
                                setUploadedFileName('')
                            }

                        }
                    }
                },
                theme: {
                    color: "#139814"
                }
            }
            var rzp1 = new window.Razorpay(options);
            rzp1.open();
            //payment
        } else if (findMatchData?.response.status === 409) {
            // // Users already exist with the provided email addresses or phone numbers
            const formattedMessage = findMatchData?.response.data.existingUsers.map(user => `${user.email}: ${user.mobile}`).join('\n');
            const customMessage = `These users already have an account with :\n`;
            const message = customMessage + formattedMessage;
            const data = {
                type: "info",
                message: message,
            };
            setOpenSnackBar(true);
            setSnackBarData(data);
        } else {
            // Handle other error cases
            const data = {
                type: "error",
                message: findMatchData.response.data.error
            };
            setOpenSnackBar(true);
            setSnackBarData(data);
        }

        const handlePaymentSuccess = () => {
            alert("payment sucsess");
        }
    };

    return (
        <div>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <FormControl sx={{ minWidth: 200 }} >
                        <InputLabel id="demo-simple-select-label">Users List</InputLabel>
                        <Select
                            sx={{ minWidth: 200 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={filters.promo_code}
                            label="Users List"
                            name="users_list"
                            value={selectedUser}
                            onChange={handleUserChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {bdeUsersList?.length > 0 ? (
                                bdeUsersList.map((user) => (
                                    <MenuItem key={user.id} value={user.first_name}>
                                        {user.first_name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="">
                                    <em>Not Found</em>
                                </MenuItem>
                            )}

                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl sx={{ minWidth: 200 }} >
                        <InputLabel id="demo-simple-select-label">Course List</InputLabel>
                        <Select
                            sx={{ minWidth: 200 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={filters.promo_code}
                            label="Course List"
                            name="course_list"
                            value={selectedCourse}
                            onChange={handleCourseChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {courseList?.length > 0 ? (
                                courseList.map((course) => (
                                    <MenuItem key={course.id} value={course.title}>
                                        {course.title}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="">
                                    <em>Not Found</em>
                                </MenuItem>
                            )}
                        </Select>
                        {selectedCoursePrice && <InputAdornment position="end" style={{ position: 'absolute', right: '-40px', top: '50%', color: 'black' }}>
                            {selectedCoursePrice}/-
                        </InputAdornment>}
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="demo-simple-select-label">Promo Code</InputLabel>
                        <Select
                            sx={{ minWidth: 200 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Promo Code"
                            name="promo_code"
                            onChange={handlePromoCodeChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {promoCodesList.map((data, i) => (
                                <MenuItem key={i} value={data.coupon_code}>
                                    {data.coupon_code}
                                </MenuItem>
                            ))}
                        </Select>
                        {selectedCourseDiscount && <InputAdornment position="end" style={{ position: 'absolute', right: '-40px', top: '50%', color: 'black' }}>
                            {selectedCourseDiscount}%
                        </InputAdornment>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} >
                    <Button
                        component="label"
                        role={undefined}
                        variant="outlined"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload file
                        <input
                            accept=".xlsx,.pdf"
                            style={{ display: 'none' }}
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Button>
                    {uploadedFileName && <p>{uploadedFileName}</p>}
                </Grid>
                <Grid item xs={12}>
                    <FormControl>
                        <Button variant="contained" onClick={() => handleSubmit()} component="span" style={{ marginRight: '10px', marginBottom: '10px' }}>
                            submit
                        </Button>
                        {totalAmount && <InputAdornment position="end" style={{ position: 'absolute', left: '90%', top: '50%', color: 'black' }}>
                            Total Amount = {totalAmount}
                        </InputAdornment>}
                        {/* </FormControl> */}
                    </FormControl>
                </Grid>
            </Grid>
            <div style={{ height: 400, width: '64%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
            {openSnackBar &&
                <SnackBar data={snackBarData} closeSnakBar={closeSnakBar} />
            }
        </div>
    )
}

export default BdeUsers;