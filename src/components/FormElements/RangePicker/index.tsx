import React, { FunctionComponent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
        },
        textFieldRangePicker: {
            flexDirection: 'inherit'
        },
        error: {
            color: '#f44336',
        },
        label: {
            padding: '0px !important',
            fontWeight: 'bold',
        },
        fieldContainer: {
            paddingTop: '0px !important',
            paddingBottom: '0px !important',
        }
    }),
);

type ComponentProps = {
    startField: string;
    endField: string;
    startMsgErr: any;
    endMsgErr: any;
    register: Function;
    required?: boolean;
    watch?: any;
    label: string;
    type?: string;
};

const RangePicker: FunctionComponent<ComponentProps> = ({
    startField,
    endField,
    startMsgErr,
    endMsgErr,
    register,
    required,
    watch,
    label,
    type = "date"
}) => {
    const classes = useStyles();

    const validate = () => {
        const start = watch(startField);
        const end = watch(endField);
        if (start > end) {
          return "Fecha inicio debe ser menor";
        }
        return true;
      }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} className={classes.label}>{label}</Grid>
            <Grid item xs={6} className={classes.fieldContainer}>
                <TextField
                    label="Desde"
                    name={startField}
                    type={type}
                    fullWidth
                    inputRef={register({
                        required: required ? "Required" : false,
                        validate,
                      })}
                    className={classes.textFieldRangePicker}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    error={startMsgErr ? true : false }
                />
            </Grid>
            <Grid item xs={6} className={classes.fieldContainer}>
                <TextField
                    label="Hasta"
                    type={type}
                    name={endField}
                    fullWidth
                    className={classes.textFieldRangePicker}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputRef={register({
                        required: required ? "Required" : false,
                        validate
                      })}
                />
            </Grid>
                    <div className={classes.error}>{startMsgErr || endMsgErr}</div>
        </Grid>
    );
}

export default RangePicker;