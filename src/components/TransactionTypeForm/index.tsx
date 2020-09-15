import React, { useEffect, FunctionComponent } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/transactionTypeActions";
import { getList as getCurrencyList } from "../../actions/currencyActions";
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
  description: string;
  apply_main: string;
  apply_extension: string;
  apply_change_user: string;
  currency_id: string;
  rate: string;
};

type TransactionTypeFormProps = {
  id?: number;
};

const TransactionTypeForm: FunctionComponent<TransactionTypeFormProps> = ({
  id
}) => {
  const classes = useStyles();
  const { handleSubmit, register, errors, reset, setValue } = useForm<
    FormData
  >();

  const {
    transactionTypeReducer: { loading },
    currencyReducer: { listData: currencyList },
  } = useSelector((state: any) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      dispatch(getCurrencyList());
      if (id) {
        const response: any = await dispatch(get(id));
        const { description, rate, apply_main, apply_extension, apply_change_user, currency_id } = response;
        setValue("description", description);
        setValue("rate", rate);
        setValue("apply_main", apply_main);
        setValue("apply_extension", apply_extension);
        setValue("apply_change_user", apply_change_user);
        setValue("currency_id", currency_id);
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
          Tipo de Transacion
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Description"
                field="description"
                required
                register={register}
                errorsField={errors.description}
                errorsMessageField={
                  errors.description && errors.description.message
                }
              />
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                placeholder="Tarifa"
                field="rate"
                required
                register={register}
                errorsField={errors.rate}
                errorsMessageField={errors.rate && errors.rate.message}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                label="Moneda"
                selectionMessage="Seleccione"
                field="currency_id"
                required
                register={register}
                errorsMessageField={
                  errors.currency_id && errors.currency_id.message
                }
              >
                {currencyList.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.description}
                  </option>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                label="Aplica Principal"
                selectionMessage="Seleccione"
                field="apply_main"
                register={register}
                errorsMessageField={
                  errors.apply_main && errors.apply_main.message
                }
                required
              >
                <option value={1}> SI </option>
                <option value={0}> NO </option>
              </CustomSelect>
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                label="Aplica Extension"
                selectionMessage="Seleccione"
                field="apply_extension"
                register={register}
                errorsMessageField={
                  errors.apply_extension && errors.apply_extension.message
                }
                optionValueSelected={0}
                required
              >
                <option value={1}> SI </option>
                <option value={0}> NO </option>
              </CustomSelect>
            </Grid>
            <Grid item xs={6}>
              <CustomSelect
                label="Aplica Cambio Usuario"
                selectionMessage="Seleccione"
                field="apply_change_user"
                register={register}
                errorsMessageField={
                  errors.apply_change_user && errors.apply_change_user.message
                }
                optionValueSelected={0}
                required
              >
                <option value={1}> SI </option>
                <option value={0}> NO </option>
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

export default TransactionTypeForm;
