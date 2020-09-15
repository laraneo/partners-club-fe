import React, { useEffect, FunctionComponent, useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/sharePermitMovementActions";
import { getList } from "../../actions/sharePermitMovementsTypesActions";
import { Grid } from "@material-ui/core";
import CustomSelect from "../FormElements/CustomSelect";
import { getSharesBySearch, updateSharetoAssign } from "../../actions/shareActions";
import SearchAutoComplete from "../SearchAutoComplete";

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
  share_id: string;
  share_permit_movements_types_id: string;
};

type SharePermitMovementFormProps = {
  id?: number;
};

const SharePermitMovementForm: FunctionComponent<SharePermitMovementFormProps> = ({
  id
}) => {
  const [partner, setPartner] = useState<any>([]);
  const classes = useStyles();
  const { handleSubmit, register, errors, reset, setValue } = useForm<
    FormData
  >();

  const {
    sharePermitMovementReducer: { loading },
    sharePermitMovementsTypesReducer: { listData: sharePermitMovementsTypesList },
    shareReducer: { shareToAssignList, shareToAssignLoading },
  } = useSelector((state: any) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      dispatch(getList());
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
    const body = {
      ...form,
      status: 1,
      date_cancelled: null,
      userid_cancelled: null
    }
    dispatch(create(body));
  };

  const handleSearchShares = _.debounce((term: any) => {
    setPartner([]);
    if (term !== "") {
      dispatch(getSharesBySearch(term));
    } else {
      dispatch(updateSharetoAssign());
    }
  }, 1000);

  const handleSelectShare = (option: any) => {
    setValue("share_id", option.id);
    setPartner(option);
    dispatch(updateSharetoAssign());
  };

  const getOptionLabelShare = (option: any) => option.share_number;

  const onTypeChange = (event: any) => {
    const find = sharePermitMovementsTypesList.find((element: any) => element.id.toString() === event.target.value);
    if (find) {
      setValue('days', find.days);
    }
  }

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Permiso de Accion
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <SearchAutoComplete
                label="Accion"
                options={shareToAssignList}
                loading={shareToAssignLoading}
                handleSearch={handleSearchShares}
                handleSelect={handleSelectShare}
                required
                errorsField={errors.share_id}
                getOptionLabel={getOptionLabelShare}
                errorsMessageField={
                  errors.share_id && errors.share_id.message
                }
              />
              <input
                style={{ display: "none" }}
                name="share_id"
                ref={register({
                  required: true
                })}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomSelect
                label="Tipo"
                selectionMessage="Seleccione"
                field="share_permit_movements_types_id"
                required
                register={register}
                errorsMessageField={
                  errors.share_permit_movements_types_id &&
                  errors.share_permit_movements_types_id.message
                }
                onChange={onTypeChange}
              >
                {sharePermitMovementsTypesList.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.desc}
                  </option>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={6}>
              {!_.isEmpty(partner) && (<div style={{ marginTop: 15, fontWeight: 'bold' }}>Socio: {partner.titular.name} {partner.titular.last_name}</div>)}
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                placeholder="Dias"
                field="days"
                required
                register={register}
                errorsField={errors.days}
                errorsMessageField={errors.days && errors.days.message}
                readOnly
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                placeholder="Descripcion"
                field="desc"
                required
                register={register}
                errorsField={errors.desc}
                errorsMessageField={errors.desc && errors.desc.message}
              />
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

export default SharePermitMovementForm;
