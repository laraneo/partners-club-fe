import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import isEmpty from 'lodash/isEmpty';

import DataTable4 from "../../../components/DataTable4";
import Chart from "../../../components/chart";
import { getPartnerAgeStatistics } from '../../../actions/accessControlActions';
import Loader from "../../../components/common/Loader";

interface Columns {
    id:
    | "label"
    | "data";
    label: string;
    minWidth?: number;
    align?: "right";
    component?: any;
}

const columns: Columns[] = [
    {
        id: "label",
        label: "Edades",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>,
    },
    {
        id: "data",
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

export default function PartnerAgesReport() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { partnerAges, partnerAgesReport, partnerFamilyStatisticsLoading: loading } = useSelector((state: any) => state.accessControlReducer);

    useEffect(() => {
        dispatch(getPartnerAgeStatistics());
    }, [dispatch]);

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
                    <Grid item xs={12}>
                    Reporte Socios Por Edades
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.printButtonContainer} >
                            <Grid container justify="center" >
                                <Grid item xs={6}>
                                    {
                                        !isEmpty(partnerAges) && (
                                            <Chart
                                                title={""}
                                                type={"pie"}
                                                labels={partnerAges.labels}
                                                dataLabels={partnerAges.dataLabels}
                                                multiColors
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
                        rows={partnerAgesReport}
                        columns={columns}
                        loading={loading}
                        fontSize="12px"
                    />
                </Grid>
        </Grid>
    );
}
