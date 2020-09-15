import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CardMembershipIcon from "@material-ui/icons/CardMembership";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import FaceIcon from "@material-ui/icons/Face";
import PersonIcon from "@material-ui/icons/Person";
import FunctionsIcon from "@material-ui/icons/Functions";
import BlockIcon from "@material-ui/icons/Block";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import CakeIcon from "@material-ui/icons/Cake";
import { useDispatch, useSelector } from "react-redux";

import Widgtet from "../../components/Widget";
import Chart from "../../components/chart";
import { Paper } from "@material-ui/core";
import {
  getPartnerStatistics,
  getFamilyStatistics,
  getGuestStatistics,
  getPersonsStatistics,
  getPersonsExceptionStatistics,
  getPersonsBirthdayStatistics
} from "../../actions/personActions";
import Loader from "../../components/common/Loader";
import { getRecordStatistics } from "../../actions/recordActions";
import { getCardStatistics } from "../../actions/cardPersonActions";
import { getPartnerFamilyStatistics, getGuestStatistics as getGuestStatisticsGraph } from "../../actions/accessControlActions";
import { getWidgetList } from "../../actions/menuActions";

const useStyles = makeStyles({
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  widgetContainer: {
    marginBottom: "100px"
  }
});

export default function Home() {
  const classes = useStyles();
  const {
    personReducer: {
      partnerStatistics,
      partnerStatisticsLoading,
      familyStatistics,
      familyStatisticsLoading,
      guestStatistics,
      guestStatisticsLoading,
      personsStatistics,
      personsStatisticsLoading,
      personsExceptionStatistics,
      personsExceptionStatisticsLoading,
      personsBirthdayStatistics,
      personsBirthdayStatisticsLoading
    },
    recordReducer: { recordStatistics, recordStatisticsLoading },
    cardPersonReducer: { cardStatistics, cardStatisticsLoading },
    accessControlReducer: {
      partnerFamilyStatistics,
      partnerFamilyStatisticsLoading,
      guestStatisticsGraph,
      guestStatisticsGraphLoading
    },
    menuReducer: {
      widgetList,
      setWidgetLoading
    }
  } = useSelector((state: any) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWidgetList());
  }, [dispatch]);

  const validateWidget = (value: string) => {
    const isValid = widgetList.find((e: any) => e.slug === value);
    if (isValid) {
      return true
    }
    return false;
  }

  useEffect(() => {
    if (validateWidget('PARTNERCONTROL_socios')) {
      dispatch(getPartnerStatistics());
    }
    if (validateWidget('PARTNERCONTROL_familiares')) {
      dispatch(getFamilyStatistics());
    }
    if (validateWidget('PARTNERCONTROL_invitados')) {
      dispatch(getGuestStatistics());
    }
    if (validateWidget('PARTNERCONTROL_totales')) {
      dispatch(getPersonsStatistics());
    }
    if (validateWidget('PARTNERCONTROL_bloqueo-expediente')) {
      dispatch(getRecordStatistics());
    }
    if (validateWidget('PARTNERCONTROL_lista-excepcion')) {
      dispatch(getPersonsExceptionStatistics());
    }
    if (validateWidget('PARTNERCONTROL_tdc-por-vencer')) {
      dispatch(getCardStatistics());
    }
    if (validateWidget('PARTNERCONTROL_cumpleanos')) {
      dispatch(getPersonsBirthdayStatistics());
    }
    if (validateWidget('PARTNERCONTROL_ingreso-socios-familiares')) {
      dispatch(getPartnerFamilyStatistics());
    }
    if (validateWidget('PARTNERCONTROL_ingreso-invitados')) {
      dispatch(getGuestStatisticsGraph());
    }
  }, [dispatch, widgetList]);


  // var str="3465389025"; //VERY BAD: Credit Card # *unencrypted* in source!
  // var n = str.replace(/.(?=.{4})/g, 'x');
  // console.log('n ', n);
  return (
    <div className="home-container">
      <Grid container spacing={3} className={classes.widgetContainer}>
        {
          validateWidget('PARTNERCONTROL_socios') && (
            <Grid item xs={3}>
              {partnerStatisticsLoading ? (
                <Loader />
              ) : (
                  <Paper>
                    <Widgtet
                      Icon={FaceIcon}
                      title="Socios"
                      amount={partnerStatistics.count}
                    />
                    <Widgtet
                      Icon={CardMembershipIcon}
                      title="Accesos"
                      subTitle="Mes anterior/Actual en curso"
                      amount={partnerStatistics.months}
                    />
                  </Paper>
                )}
            </Grid>
          )
        }


        {
          validateWidget('PARTNERCONTROL_familiares') && (
            <Grid item xs={3}>
              {familyStatisticsLoading ? (
                <Loader />
              ) : (
                  <Paper>
                    <Widgtet
                      Icon={PeopleAltIcon}
                      title="Familiares"
                      amount={familyStatistics.count}
                    />
                    <Widgtet
                      Icon={CardMembershipIcon}
                      title="Accesos"
                      subTitle="Mes anterior/Actual en curso"
                      amount={familyStatistics.months}
                    />
                  </Paper>
                )}
            </Grid>
          )
        }

        {
          validateWidget('PARTNERCONTROL_invitados') && (
            <Grid item xs={3}>
              {guestStatisticsLoading ? (
                <Loader />
              ) : (
                  <Paper>
                    <Widgtet
                      Icon={PersonIcon}
                      title="Invitados"
                      amount={guestStatistics.count}
                    />
                    <Widgtet
                      Icon={CardMembershipIcon}
                      title="Accesos"
                      subTitle="Mes anterior/Actual en curso"
                      amount={guestStatistics.months}
                    />
                  </Paper>
                )}
            </Grid>
          )
        }

        {
          validateWidget('PARTNERCONTROL_totales') && (
            <Grid item xs={3}>
              {personsStatisticsLoading ? (
                <Loader />
              ) : (
                  <Paper>
                    <Widgtet
                      Icon={FunctionsIcon}
                      title="Totales"
                      amount={personsStatistics.count}
                    />
                    <Widgtet
                      Icon={FunctionsIcon}
                      title="Accesos"
                      subTitle="Mes anterior/Actual en curso"
                      amount={personsStatistics.months}
                    />
                  </Paper>
                )}
            </Grid>
          )
        }

        {
          validateWidget('PARTNERCONTROL_bloqueo-expediente') && (
            <Grid item xs={3}>
              {recordStatisticsLoading ? (
                <Loader />
              ) : (
                  <Widgtet
                    Icon={BlockIcon}
                    title="Exp Bloqueo Si/No"
                    amount={recordStatistics.blockeds}
                  />
                )}
            </Grid>
          )
        }



        {
          validateWidget('PARTNERCONTROL_lista-excepcion') && (
            <Grid item xs={3}>
              {personsExceptionStatisticsLoading ? (
                <Loader />
              ) : (
                  <Widgtet
                    Icon={PersonAddDisabledIcon}
                    title="Lista Excepcion"
                    amount={personsExceptionStatistics.count}
                  />
                )}
            </Grid>
          )
        }

        {
          validateWidget('PARTNERCONTROL_tdc-por-vencer') && (
            <Grid item xs={3}>
              {cardStatisticsLoading ? (
                <Loader />
              ) : (
                  <Widgtet
                    Icon={CreditCardIcon}
                    title="TDC por vender 30d/60d"
                    amount={cardStatistics.cards}
                  />
                )}
            </Grid>
          )
        }

        {
          validateWidget('PARTNERCONTROL_cumpleanos') && (
            <Grid item xs={3}>
              {personsBirthdayStatisticsLoading ? (
                <Loader />
              ) : (
                  <Widgtet
                    Icon={CakeIcon}
                    title="Cumpleaños del mes"
                    amount={personsBirthdayStatistics.count}
                  />
                )}
            </Grid>
          )
        }

        {
          validateWidget('PARTNERCONTROL_ingreso-socios-familiares') && (
            <Grid item xs={6}>
              {partnerFamilyStatisticsLoading ? (
                <Loader />
              ) : (
                  <Chart
                    title={"Ingresos Socios/Familiares por mes"}
                    type={"bar"}
                    labels={partnerFamilyStatistics.labels}
                    dataLabels={partnerFamilyStatistics.dataMonth}
                  />
                )}
            </Grid>
          )
        }

        {
          validateWidget('PARTNERCONTROL_ingreso-invitados') && (
            <Grid item xs={6}>
              {guestStatisticsGraphLoading ? (
                <Loader />
              ) : (
                  <Chart
                    title={"Ingresos Invitados por mes"}
                    type={"bar"}
                    labels={guestStatisticsGraph.labels}
                    dataLabels={guestStatisticsGraph.dataMonth}
                  />
                )}
            </Grid>
          )
        }


      </Grid>
    </div>
  );
}
