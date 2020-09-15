import React, { useEffect, FunctionComponent, useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Fab from "@material-ui/core/Fab";
import parse from 'react-html-parser'

import { create, get as getRecord } from "../../actions/recordActions";
import { getList as getTypeList, get } from "../../actions/recordTypeActions";
import CustomSelect from "../FormElements/CustomSelect";
import Upload from "../FormElements/Upload";
import CustomEditor from "../Editor";

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
    textAlign: 'center',
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
    width: '30%'
  },
  select: {
    padding: "10px 0px 10px 0px",
    width: " 100%",
    backgroundColor: "transparent",
    border: 0,
    borderBottom: "1px solid grey",
    fontSize: "16px"
  },
  typeRecordDetail: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  typeRecorBlocked: {
    color: 'red',
  }
}));

type FormData = {
  description: string;
  exp1: string;
  exp2: string;
  exp3: string;
  exp4: string;
  exp5: string;
  record_type_id: number;
};

type RecordFormProps = {
  id?: number;
  isView?: boolean;
};

interface selectedRecordType {
  blocked: number;
  days: number;
}

const RecordForm: FunctionComponent<RecordFormProps> = ({
  id,
  isView
}) => {
  const [ selectedDescription, setSelectedDecription ] = useState<any>('');
  const classes = useStyles();
  const [selectedRecord, setSelectedRecord] = useState<any>({});
  // const [image, setImage] = useState({ preview: "", raw: "" });
  const [selectedRecordType, setSelectedRecordType] = useState<any>(null);
  // const [imageField, setImageField] = useState();
  const { handleSubmit, register, errors, reset, getValues, setValue, watch } = useForm<
    FormData
  >();
  const { loading } = useSelector((state: any) => state.recordReducer);

  const { listData: recordTypeList } = useSelector((state: any) => state.recordTypeReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTypeList());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);


  const handleForm = async (form: object) => {
    const { record_type_id } = getValues();
    const res: any = await dispatch(get(record_type_id));
    const { days, blocked } = res;
    const expiration_date = moment().add(days, 'days').format('YYYY-MM-DD');
    const created = moment().format('YYYY-MM-DD');
    const data = {
      ...form,
      people_id: id,
      created,
      days,
      expiration_date,
      blocked,
      description: selectedDescription
    };;
    dispatch(create({ ...data }));
  };

  useEffect(() => {
    async function fetch() {
      if (id && isView) {
        const response: any = await dispatch(getRecord(id));
        setSelectedRecord(response);
      } else {
        setSelectedRecord({});
      }
    }
    fetch();
  }, [id, dispatch, isView]);

  const renderFile = (url: any) => {
    return (
      <Grid item xs={1}>
      <a target="_blank" rel="noopener noreferrer" href={url} title="file2" >
        <Fab size="small" color="primary" aria-label="add" >
          <SystemUpdateAltIcon />
        </Fab>
      </a>
    </Grid>
    )
  }

  const renderDetail = () => {
    return !_.isEmpty(selectedRecord) && (
      <Grid container spacing={1} style={{ marginTop: 20 }}>
        <Grid item xs={6}>
          <strong>Fecha:</strong> {selectedRecord.created}
        </Grid>
        <Grid item xs={6}>
          <strong>Motivo:</strong> {selectedRecord.type.description}
        </Grid>
        <Grid item xs={12}>
          <strong>Description:</strong> {selectedRecord.description && parse(selectedRecord.description)}
        </Grid>
        <Grid item xs={12}>
          <strong>Adjuntos</strong>
        </Grid>
        {selectedRecord.file1 && selectedRecord.file1 !== '' && renderFile(selectedRecord.file1)}
        {selectedRecord.file2 && selectedRecord.file2 !== '' && renderFile(selectedRecord.file2)}
        {selectedRecord.file3 && selectedRecord.file3 !== '' && renderFile(selectedRecord.file3)}
        {selectedRecord.file4 && selectedRecord.file4 !== '' && renderFile(selectedRecord.file4)}
        {selectedRecord.file5 && selectedRecord.file5 !== '' && renderFile(selectedRecord.file5)}

      </Grid>
    )
  }

  const onTypeChange = async () => {
    const recordType = watch('record_type_id');
    if (recordType > 0) {
      const res: any = await dispatch(get(recordType));
      setSelectedRecordType(res);
    } else {
      setSelectedRecordType(null);
    }
  }

  const handleDescription = (content: string) => {
    setSelectedDecription(content);
  }

  const renderForm = () => {
    return (
      <form
        className={classes.form}
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3} >
              <Grid item xs={6}>
                <CustomSelect
                  label="Motivo"
                  selectionMessage="Seleccione"
                  field="record_type_id"
                  required
                  register={register}
                  errorsMessageField={
                    errors.record_type_id && errors.record_type_id.message
                  }
                  onChange={onTypeChange}
                >
                  {recordTypeList.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.description}
                    </option>
                  ))}
                </CustomSelect>
              </Grid>
              <Grid item xs={6}>
                {
                  selectedRecordType && (
                    <div className={`${classes.typeRecordDetail} ${selectedRecordType.blocked == 1 ? classes.typeRecorBlocked : ''}`}>
                      <div>Bloqueo: {selectedRecordType.blocked == 1 ? 'SI' : 'NO'}</div>
                      {
                        selectedRecordType.blocked == 1 && (
                          <React.Fragment>
                            <div>Dias: {selectedRecordType.days}</div>
                            <div>Vencimiento: {moment().add(selectedRecordType.days, 'days').format('YYYY-MM-DD')}</div>
                          </React.Fragment>
                        )
                      }

                    </div>
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <CustomEditor onChange={handleDescription} content={selectedDescription} />
            </Grid>
          <Grid item xs={12}>
            <Upload
              field="exp1"
              label="Archivo 1"
              register={register}
              setValue={setValue}
            />
          </Grid>
          <Grid item xs={12}>
            <Upload
              field="exp2"
              label="Archivo 2"
              register={register}
              setValue={setValue}
            />
          </Grid>
          <Grid item xs={12}>
            <Upload
              field="exp3"
              label="Archivo 3"
              register={register}
              setValue={setValue}
            />
          </Grid>
          <Grid item xs={12}>
            <Upload
              field="exp4"
              label="Archivo 4"
              register={register}
              setValue={setValue}
            />
          </Grid>
          <Grid item xs={12}>
            <Upload
              field="exp5"
              label="Archivo 5"
              register={register}
              setValue={setValue}
            />
          </Grid>

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
                Crear
                </Button>
              {loading && (
                <CircularProgress size={24} className={classes.buttonProgress} />
              )}
            </div>
          </Grid>
        </Grid>
      </form>
    )
  }
  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Expediente
        </Typography>
        {isView ? renderDetail() : renderForm()}
      </div>
    </Container>
  );
};

export default RecordForm;
