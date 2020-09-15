import React, { useEffect, FunctionComponent } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/sharePermitMovementsTypesActions";
import { Grid } from "@material-ui/core";
import CustomSelect from "../FormElements/CustomSelect";

const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
    textAlign: "center"
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -9,
    marginLeft: -9
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "30%"
  },
  select: {
    padding: "10px 0px 10px 0px",
    width: " 100%",
    backgroundColor: "transparent",
    border: 0,
    borderBottom: "1px solid grey",
    fontSize: "16px"
  }
}));

type FormData = {
  desc: string;
  days: string;
  status: string;
};

type SharePermitMovementsTypesFormProps = {
  id?: number;
};

const SharePermitMovementsTypesForm: FunctionComponent<SharePermitMovementsTypesFormProps> = ({
  id
}) => {
  const classes = useStyles();
  const { handleSubmit, register, errors, reset, setValue } = useForm<
    FormData
  >();

  const {
    sharePermitMovementsTypesReducer: { loading },
  } = useSelector((state: any) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      if (id) {
        const response: any = await dispatch(get(id));
        const { desc, days, status } = response;
        setValue("desc", desc);
        setValue("days", days);
        setValue("status", status);
      }
    }
    fetch();
  }, [id, dispatch, setValue]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleForm = (form: object) => {
    if (id) {
      dispatch(update({ id, ...form }));
    } else {
      dispatch(create(form));
    }
  };

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Tipo de Permiso de Accion
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={3}>

            <Grid item xs={6}>
              <CustomTextField
                placeholder="Descripcion"
                field="desc"
                required
                register={register}
                errorsField={errors.desc}
                errorsMessageField={errors.desc && errors.desc.message}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                placeholder="Dias"
                field="days"
                required
                register={register}
                errorsField={errors.days}
                errorsMessageField={errors.days && errors.days.message}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                label="Status"
                selectionMessage="Seleccione"
                field="status"
                register={register}
                errorsMessageField={
                  errors.status && errors.status.message
                }
                optionValueSelected={0}
                required
              >
                <option value={1}> Activo </option>
                <option value={0}> Inactivo </option>
              </CustomSelect>
            </Grid>



          </Grid>






          <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.submit}
            >
              {id ? "Actualizar" : "Crear"}
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </form>
      </div>
    </Container>
  );
};

export default SharePermitMovementsTypesForm;
