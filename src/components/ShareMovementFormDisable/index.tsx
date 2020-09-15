import React, { useEffect, FunctionComponent, useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";
import moment from 'moment';

import CustomTextField from "../FormElements/CustomTextField";
import { disableShare } from "../../actions/shareMovementActions";
import { singleSearchToAssign, searchDisableToAssign , reset as resetShare, updateSharetoAssign } from "../../actions/shareActions";

import {
  searchPartnersToAssign,
  searchTitularToAssign,
  clearPartnersToAssign,
  clearTitularToAssign
} from "../../actions/personActions";
import SearchAutoComplete from "../SearchAutoComplete";
import CustomSelect from "../FormElements/CustomSelect";
import Utils from '../../helpers/utilities'

const useStyles = makeStyles(theme => ({
  rootShareMovementFormDisable: {
    flexGrow: 1
  },
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
  rate: string;
  share_id: string;
  people_id: string;
  id_titular_persona: string;
  transaction_type_id: string;
  number_sale_price: string;
  currency_rate_id: string;
  currency_sale_price_id: string;
};

type ShareMovementFormDisableProps = {
  id?: number;
  condition?: any;
  title?: string;
};

const ShareMovementFormDisable: FunctionComponent<ShareMovementFormDisableProps> = ({
  id, condition, title
}) => {
  const classes = useStyles();
  const {
    handleSubmit,
    register,
    errors,
    reset,
    setValue,
    getValues,
    watch
  } = useForm<FormData>();
  const [selectedTypeTransaction, setSelectedTypeTransaction] = useState<any>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<boolean>(false);
  const [tempPartnersToAssign, setTempPartnersToAssign] = useState<any>([]);
  const [partner, setPartner] = useState<any>([]);
  const { shareToAssignList, shareToAssignLoading } = useSelector(
    (state: any) => state.shareReducer
  );
  const {
    partnersToAssign,
    titularToAssign,
    setPartnersLoading,
    setTitularLoading
  } = useSelector((state: any) => state.personReducer);


  const {
    shareMovementReducer: { loading },
    transactionTypeReducer: { listData: transactionTypeList },
    currencyReducer: { listData: currencyList },
    parameterReducer: { listData: parameterList },
  } = useSelector((state: any) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      reset();
      dispatch(resetShare());
    };
  }, [reset, dispatch]);

  useEffect(() => {
    if (transactionTypeList.length > 0) {
      let paramCondition = ''
      if (condition === 'DAR_DE_BAJA') paramCondition = 'MOVIMIENTO_BAJA';
      if (condition === 'RECUPERAR_BAJA') paramCondition = 'MOVIMIENTO_RESTAURAR_BAJA';
      const currentParam = Utils.getParameter(parameterList, paramCondition);
      if (currentParam) {
        setValue('transaction_type_id', currentParam.value);
      }
    }

  }, [setValue, transactionTypeList])

  const handleForm = (form: any) => {
    // const created = moment().format('YYYY-MM-DD');
    // const body = {
    //   ...form,
    //   number_procesed: 1,
    //   created,
    //   condition,
    // };
    setConfirmationMessage(true);
  };

  const handleConfirmationForm = () => {
    const form = getValues();
    const created = moment().format('YYYY-MM-DD');
    const body = {
      ...form,
      number_procesed: 1,
      created: null,
      condition,
    };
    setConfirmationMessage(false);
    dispatch(disableShare({ ...body }));
  };

  const switchDispatchCondition = (condition : string, term: string) => {
    switch (condition) {
      case 'DAR_DE_BAJA':
        return singleSearchToAssign(term, condition)
      case 'RECUPERAR_BAJA':
        return searchDisableToAssign(term, condition)
    }
  }

  const handleSearchShares = _.debounce((term: any) => {
    setPartner([]);
    if (term !== "") {
      dispatch(switchDispatchCondition(condition, term));
    } else {
      dispatch(updateSharetoAssign());
    }
  }, 1000);

  const handleSearchPartners = _.debounce(async (term: any) => {
    if (term !== "") {
      const res: any = await dispatch(searchPartnersToAssign(term));
      if (res) {
        setTempPartnersToAssign(res);
      }
    } else {
      dispatch(clearPartnersToAssign());
      setTempPartnersToAssign([]);
    }
  }, 1000);

  const handleSearchOwner = _.debounce((term: any) => {
    if (term !== "") {
      dispatch(searchTitularToAssign(term));
    } else {
      dispatch(clearTitularToAssign());
    }
  }, 1000);

  const handleSelectShare = (option: any) => {
    setValue("share_id", option.id);
    setPartner(option);
    dispatch(updateSharetoAssign());
  };

  const handleSelectPartner = (option: any) => {
    setValue("people_id", option.id);
    dispatch(clearPartnersToAssign());
  };

  const handleSelectOwner = (option: any) => {
    setValue("id_titular_persona", option.id);
    dispatch(clearTitularToAssign());
  };

  const getOptionLabelShare = (option: any) => option.share_number;

  const getOptionLabelPerson = (option: any) =>
    `${option.name} ${option.last_name}`;

  const selectDefaultOwner = () => {
    const { people_id } = getValues();
    if (people_id === "") {
      return false;
    }
    const partner = tempPartnersToAssign.find(
      (e: any) => e.id.toString() === people_id
    );
    return partner;
  };

  const renderConfirmationMessage = () => {
    return (
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>Esta Seguro?</Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} justify="center" >
            <Grid item xs={2}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.submit}
              onClick={handleConfirmationForm}
            >
              SI
                  </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => setConfirmationMessage(false)}
            >
              NO
                  </Button>
          </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Movimiento Accion
        </Typography>
        <Typography component="h5" variant="h5" style={{ fontSize: 16, marginTop: 10, marginBottom: 10 }}>
          {title}
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <div className={classes.rootShareMovementFormDisable}>
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
                {!_.isEmpty(partner) && (<div style={{ marginTop: 15, fontWeight: 'bold' }}>Socio: {partner.titular.name} {partner.titular.last_name}</div>)}
              </Grid>
              <Grid item xs={6}>
                <CustomSelect
                  label="Tipo de Transacion"
                  selectionMessage="Seleccione"
                  field="transaction_type_id"
                  register={register}
                  errorsMessageField={
                    errors.transaction_type_id &&
                    errors.transaction_type_id.message
                  }
                  disabled
                >
                  {transactionTypeList.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.description}
                    </option>
                  ))}
                </CustomSelect>
              </Grid>
              {
                confirmationMessage ? renderConfirmationMessage() :
                  <Grid item xs={12}>
                    <div className={classes.wrapper}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        className={classes.submit}
                      >
                        {title}
                  </Button>
                      {loading && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </div>
                    <input
                      style={{ display: "none" }}
                      name="currency_rate_id"
                      ref={register}
                    />
                    <input
                      style={{ display: "none" }}
                      name="rate"
                      ref={register}
                    />
                  </Grid>
              }
            </Grid>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default ShareMovementFormDisable;
