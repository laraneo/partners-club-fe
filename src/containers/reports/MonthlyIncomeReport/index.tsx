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
import { getMonthlyIncomeStatistics } from '../../../actions/accessControlActions';
import moment from "moment";
import Loader from "../../../components/common/Loader";

interface Columns {
    id:
    | "month"
    | "cant";
    label: string;
    minWidth?: number;
    align?: "right";
    component?: any;
}

const columns: Columns[] = [
    {
        id: "month",
        label: "Mes",
        minWidth: 10,
        component: (value: any) => <span>{moment().month(value.value).format("MMM")}</span>,
    },
    {
        id: "cant",
        label: "Cantidad",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    }
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


export default function MonthlyIncomeReport() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { monthlyIncomes, monthlyIncomesReport, partnerFamilyStatisticsLoading: loading } = useSelector((state: any) => state.accessControlReducer);
    const {
        handleSubmit,
        register,
        errors,
        getValues,
        watch,
        reset
    } = useForm<FormData>();

    useEffect(() => {
        dispatch(getMonthlyIncomeStatistics());
    }, [dispatch]);

    const handleForm = async (form: FormData) => {
        dispatch(getPersonsBirthday(form))
    };

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
                <Grid item xs={12} >
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.printButtonContainer} >
                            <Grid container justify="center" >
                                <Grid item xs={6}>
                                    {
                                        !isEmpty(monthlyIncomes) && (
                                            <Chart
                                                title={"Reporte de Accesos Mensuales"}
                                                type={"horizontal-bar"}
                                                labels={monthlyIncomes.labels}
                                                dataLabels={monthlyIncomes.dataMonth}
                                            />
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} style={{ marginTop: 20 }}>
                    <DataTable4
                        rows={monthlyIncomesReport}
                        columns={columns}
                        loading={loading}
                        fontSize="12px"
                    />
                </Grid>
        </Grid>
    );
}
