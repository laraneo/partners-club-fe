import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from 'react-hook-form';
import SearchIcon from "@material-ui/icons/Search";
import Button from '@material-ui/core/Button';
import Chip from "@material-ui/core/Chip";

import {
    // getAll, 
    filter,
    filterReport,
    clearPersons,
    clearReport,
    getPersonsBirthday,
    getPersonsBirthdayReport
} from "../../../actions/personActions";
import PersonColumn from '../../../interfaces/PersonColumn';
import DataTable4 from "../../../components/DataTable4";
import PrintIcon from "@material-ui/icons/Print";
import LoadingButton from "../../../components/FormElements/LoadingButton";
import CustomTextField from '../../../components/FormElements/CustomTextField'
import CustomSelect from "../../../components/FormElements/CustomSelect";
import RangePicker from "../../../components/FormElements/RangePicker";
import RangeAge from "../../../components/FormElements/RangeAge";
import { getAll as getProfessions } from "../../../actions/professionActions";
import { getAll as getSports } from "../../../actions/sportActions";

const columns: PersonColumn[] = [
    {
        id: "id",
        label: "Id", minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "shares",
        label: "Accion",
        minWidth: 10,
        align: "right",
        component: (value: any) => value.value ?
            value.value.map((e: any, i: number) =>
                (<div >
                    <Chip
                        label={e.share_number}
                        style={{
                            fontSize: "10px",
                            marginTop: 2,
                            paddingBottom: 2,
                        }}
                        size="small"
                        color="primary"
                    />
                    <br />
                </div>)
            )
            : '',
    },
    {
        id: "relation",
        label: "Parentesco",
        minWidth: 10,
        align: "right",
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "rif_ci",
        label: "Cedula",
        minWidth: 10,
        align: "right",
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "name",
        label: "Nombre",
        minWidth: 10,
        align: "right",
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "last_name",
        label: "Apellido",
        minWidth: 10,
        align: "right",
        component: (value: any) => <span>{value.value}</span>,
    },

    {
        id: "birth_date",
        label: "Nacimiento",
        minWidth: 10,
        align: "right",
        component: (value: any) => <span>{value.value}</span>,
    },

    // {
    //   id: "birth_date",
    //   label: "Edad",
    //   minWidth: 10,
    //   align: "right",
    //   component: (value: any) => <span>{moment(value.value, "YYYY/MM/DD").fromNow().split(" ")[0]}</span>,
    // },

]

const useStyles = makeStyles(theme => ({
    printButtonContainer: {
        textAlign: "right",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    rangleTitle: {
        lineHeight: 3,
        fontWeight: 'bold'
    },
    filtersContainer: {
        marginBottom: 10
    }
}));

type FormData = {
    month: string;
};


export default function PersonBirthdayReport() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { personsBirthday, pagination, loading } = useSelector((state: any) => state.personReducer);
    const {
        handleSubmit,
        register,
        errors,
        getValues,
        watch,
        reset
    } = useForm<FormData>();

    useEffect(() => {
        return () => {
            dispatch(clearPersons());
            dispatch(clearReport());
            reset();
        };
    }, [reset, dispatch]);

    const handleForm = async (form: FormData) => {
        dispatch(getPersonsBirthday(form))
    };

    const handleChangePage = (newPage: number) => {
        const form = getValues();
        const page = pagination.currentPage === 1 ? 2 : newPage;
        dispatch(getPersonsBirthday(form, page, pagination.perPage))
    };

    const handlePerPage = (page: number, perPage: number) => {
        const form = getValues();
        dispatch(getPersonsBirthday(form, page, perPage))
    }

    const getReport = () => {
        const form = getValues();
        dispatch(getPersonsBirthdayReport(form))
    }

    return (
        <Grid container spacing={3}>
            <form
                onSubmit={handleSubmit(handleForm)}
                noValidate
                className={classes.form}
            >
                <Grid item xs={12} >
                    <Grid container spacing={3}>
                        <Grid item xs={6}> Reporte de Cumpleanos</Grid>
                        <Grid item xs={6} className={classes.printButtonContainer} >
                            <LoadingButton
                                Icon={PrintIcon}
                                loading={loading}
                                handleClick={() => getReport()}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} >
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <CustomSelect
                                label="Mes"
                                selectionMessage="Seleccione"
                                field="month"
                                register={register}
                                errorsMessageField={
                                    errors.month && errors.month.message
                                }
                                required
                            >
                                <option value={1}>Enero</option>
                                <option value={2}>Febrero</option>
                                <option value={3}>Marzo</option>
                                <option value={4}>Abril</option>
                                <option value={5}>Mayo</option>
                                <option value={6}>Junio</option>
                                <option value={7}>Julio</option>
                                <option value={8}>Agosto</option>
                                <option value={9}>Septiembre</option>
                                <option value={10}>Octubre</option>
                                <option value={11}>Noviembre</option>
                                <option value={12}>Diciembre</option>
                            </CustomSelect>

                        </Grid>
                        <Grid item xs={6} style={{
                            marginBottom: '10px'
                        }}>
                            <Button variant="contained" color="primary" type="submit">
                                Buscar
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={12}>
                    <DataTable4
                        rows={personsBirthday}
                        pagination={pagination}
                        columns={columns}
                        loading={loading}
                        onChangePage={handleChangePage}
                        onChangePerPage={handlePerPage}
                        fontSize="12px"
                    />
                </Grid>
            </form>
        </Grid>
    );
}
