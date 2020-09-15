import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from 'react-redux';
import parse from 'react-html-parser';

import snackBarUpdate from '../../actions/snackBarActions'

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    '&': {

    },
    "& > * + *": {
      marginTop: theme.spacing(2)
    },
  },
  activeDashboardContent: {
    left: '58% !important'
  }
}));

export default function SnackBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { status, message, type, autoHide, dashboardContent } = useSelector((state: any) => state.snackBarReducer);

  const handleClose = () => {
    dispatch(
      snackBarUpdate({
        payload: {
          message: "",
          status: false,
          autoHide: false,
          dashboardContent: false,
        }
      })
    );
  };

  return (
    <div className={classes.root}>
      <Snackbar 
        open={status} 
        autoHideDuration={autoHide ? 20000 : null} 
        onClose={handleClose} 
        className={dashboardContent ? classes.activeDashboardContent : ''} 
      >
        <Alert onClose={handleClose} severity={type}>
          {parse(message)}
        </Alert>
      </Snackbar>
    </div>
  );
}
