
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar(props) {
    const vertical = "bottom";
    const horizontal = "center";
    const [open, setOpen] = React.useState(true);

    function closeSnakBar() {
        props.closeSnakBar();
    }

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={closeSnakBar} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
            <Alert onClose={closeSnakBar} severity={props.data.type} sx={{ width: '100%' }}>
                {props.data.message}
            </Alert>
        </Snackbar>
    )
}