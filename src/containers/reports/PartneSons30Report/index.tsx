import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from 'react-hook-form';
import SearchIcon from "@material-ui/icons/Search";
import Button from '@material-ui/core/Button';
import Chip from "@material-ui/core/Chip";
import isEmpty from 'lodash/isEmpty';

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
import Chart from "../../../components/chart";
import {  getSonsMoreThan30Statistics } from '../../../actions/accessControlActions';
import Columns from '../../../interfaces/PersonColumn';
import Loader from "../../../components/common/Loader";

const columns: Columns[] = [
    {
        id: "name",
        label: "Nombre",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "last_name",
        label: "Apellido",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "rif_ci",
        label: "RIF/CI",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "card_number",
        label: "Carnet",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "primary_email",
        label: "Correo",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "birth_date",
        label: "Nacimiento",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "phone_mobile1",
        label: "Telefono",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    },
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


export default function PartneSons30Report() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { partnerSons30, partnerFamilyStatisticsLoading: loading } = useSelector((state: any) => state.accessControlReducer);
    const {
        handleSubmit,
        register,
        errors,
        getValues,
        watch,
        reset
    } = useForm<FormData>();

    useEffect(() => {
        dispatch(getSonsMoreThan30Statistics());
    }, [dispatch]);

    // const handleChangePage = (newPage: number) => {
    //     const form = getValues();
    //     const page = pagination.currentPage === 1 ? 2 : newPage;
    //     dispatch(getPersonsBirthday(form, page, pagination.perPage))
    // };

    // const handlePerPage = (page: number, perPage: number) => {
    //     const form = getValues();
    //     dispatch(getPersonsBirthday(form, page, perPage))
    // }

    // const getReport = () => {
    //     const form = getValues();
    //     dispatch(getPersonsBirthdayReport(form))
    // }
    if(loading) {
        return (
            <Grid container spacing={3} justify="center" >
                <Loader size={35} />
            </Grid>
        )
    }
    return (
        <Grid container spacing={3}>
                <Grid item xs={12} > Reporte Hijos mayores de 30 años </Grid>
                <Grid item xs={12} style={{ marginTop: 20 }}>
                    <DataTable4
                        rows={partnerSons30}
                        columns={columns}
                        loading={loading}
                        fontSize="12px"
                    />
                </Grid>
        </Grid>
    );
}
