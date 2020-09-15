import React, { useEffect, FunctionComponent, useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import _ from 'lodash';
import parse from 'react-html-parser'

import CustomTextField from "../FormElements/CustomTextField";
import { create, get } from "../../actions/noteActions";
import { getList as getDepartmentList } from "../../actions/departmentActions";
import { getList as getNoteTypeList } from "../../actions/noteTypeActions";
import CustomSelect from "../FormElements/CustomSelect";
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
        color: 'red',
        fontStyle: 'italic',
        fontWeight: 'bold',
    }
}));

type FormData = {
    description: string;
    status: string;
    department_id: number;
    note_type_id: number;
    subject: number;
    is_sent: number;
};

type NoteFormProps = {
    id?: number;
    isView?: boolean;
};

const NoteForm: FunctionComponent<NoteFormProps> = ({
    id,
    isView = false
}) => {
    const [selectedDescription, setSelectedDecription] = useState<any>('');
    const [selectedNote, setSelectedNote] = useState<any>({});
    const classes = useStyles();
    const { handleSubmit, register, errors, reset, setValue } = useForm<FormData>();
    const { loading } = useSelector((state: any) => state.noteReducer);

    const { listData: departmentList } = useSelector((state: any) => state.departmentReducer);

    const { listData: noteTypeList } = useSelector((state: any) => state.noteTypeReducer);

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            if (id) {
                const response: any = await dispatch(get(id));
                setSelectedNote(response);
            } else {
                setSelectedNote({});
            }
        }
        fetch();
    }, [id, dispatch, setValue]);

    useEffect(() => {
        dispatch(getDepartmentList());
        dispatch(getNoteTypeList());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);



    const handleForm = (form: object) => {
        const data = {
            people_id: id,
            status: 1,
            created: moment().format('YYYY-MM-DD'),
            ...form,
            description: selectedDescription
        };
        dispatch(create(data));
    };

    const handleDescription = (content: string) => {
        setSelectedDecription(content);
    }

    const renderDetail = () => {
        return !_.isEmpty(selectedNote) && (
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <strong>Fecha:</strong> {selectedNote.created}
                </Grid>
                <Grid item xs={12}>
                    <strong>Status:</strong> {selectedNote.status === "1" ? 'Activo' : 'Inactivo'}
                </Grid>
                <Grid item xs={12}>
                    <strong>Departamento:</strong> {selectedNote.department.description}
                </Grid>
                <Grid item xs={12}>
                    <strong>Description:</strong> {selectedNote.description && parse(selectedNote.description)}
                </Grid>
            </Grid>
        )
    }

    const renderForm = () => {
        return (
            <form
                className={classes.form}
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <CustomTextField
                            placeholder="Asunto"
                            field="subject"
                            required
                            register={register}
                            errorsField={errors.subject}
                            errorsMessageField={
                                errors.subject && errors.subject.message
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomSelect
                            label="Departamento"
                            selectionMessage="Seleccione"
                            field="department_id"
                            required
                            register={register}
                            errorsMessageField={
                                errors.department_id && errors.department_id.message
                            }
                        >
                            {departmentList.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                    {item.description}
                                </option>
                            ))}
                        </CustomSelect>
                    </Grid>
                    <Grid item xs={6}>
                        <CustomSelect
                            label="Tipo de Nota"
                            selectionMessage="Seleccione"
                            field="note_type_id"
                            required
                            register={register}
                            errorsMessageField={
                                errors.note_type_id && errors.note_type_id.message
                            }
                        >
                            {noteTypeList.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                    {item.description}
                                </option>
                            ))}
                        </CustomSelect>
                    </Grid>
                    <Grid item xs={12}>
                        <CustomEditor onChange={handleDescription} content={selectedDescription} />
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
                    Nota
        </Typography>
                {isView ? renderDetail() : renderForm()}
            </div>
        </Container>
    );
};

export default NoteForm;
