import React, { useEffect } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";

import Dashboard from "../containers/dashboard";
import Modal from "../components/Modal";
import SecondModal from "../components/SecondModal";
import MainLayout from "../Hoc/MainLayout";
import SnackBar from "../components/SnackBar";
import Login from "../containers/login";
import SecureStorage from "./SecureStorage";
import { 
  checkLogin, 
  //setupInterceptors 
} from "../actions/loginActions";
import Bank from "../containers/bank";
import Country from "../containers/Country";
import Sport from "../containers/Sport";
import Profession from "../containers/Profession";
import Person from "../containers/person";
import MaritalStatus from "../containers/maritalStatus";
import StatusPerson from "../containers/statusPerson";
import Gender from "../containers/gender";
import Role from "../containers/role";
import Permission from "../containers/permission";
import User from "../containers/user";
import Home from "../containers/home";
import Reports from "../containers/reports";
import ExpirationCard from "../containers/Templates/ExpirationCard";
import RelationType from "../containers/relationType";
import PaymentMethod from "../containers/paymentMethod";
import CardType from "../containers/cardType";
import TransactionType from "../containers/transactionType";
import ShareMovement from "../containers/shareMovement";
import ShareType from "../containers/shareType";
import Share from "../containers/share";
import Location from "../containers/location";
import GeneralReport from "../containers/reports/GeneralReport";
import SharesReport from "../containers/reports/SharesReport";
import AccessControlReport from "../containers/reports/AccessControlReport";
import Parameter from "../containers/parameter";
import Locker from "../containers/locker";
import Widget from "../containers/widget";
import Menu from "../containers/menu";
import MainLoader from "../components/MainLoading";
import MenuItem from "../containers/MenuItem";
import CustomModal from "../components/CustomModal";
import AccessControl from "../containers/accessControl";
import Guest from "../containers/guest";
import About from "../containers/about";
import PersonBirthdayReport from "../containers/reports/BirthayReport";
import MonthlyIncomeReport from "../containers/reports/MonthlyIncomeReport";
import PartnerAgesReport from "../containers/reports/PartnersAgeReport";
import PartneSons30Report from "../containers/reports/PartneSons30Report";
import RegisterPassword from "../containers/registerPassword";
import ShareMovementDisable from "../containers/shareMovementDisable";
import SharePermitMovementsTypes from "../containers/sharePermitMovementsTypes";
import SharePermitMovement from "../containers/sharePermitMovement";

export default function Routes() {
  const dispatch = useDispatch();
  const token = SecureStorage.getItem("token");

  useEffect(() => {
    async function run(){
      if(window.location.pathname !== '/') {
        await dispatch(checkLogin());
      }
    }
    run();
  },[dispatch, token])

  // useEffect(() => {
  //   setupInterceptors();
  // }, [token]);

  return (
    <HashRouter>
      <MainLayout>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/template/expiration-cards" component={ExpirationCard} />
          <Route
            path="/dashboard"
            exact={false}
            component={() => {
              if (SecureStorage.getItem("token")) {
                return (
                  <Switch>
                    <Dashboard>
                      <Route path="/dashboard/main" component={Home} />
                      <Route path="/dashboard/reports" component={Reports} />
                      <Route path="/dashboard/user" component={User} />
                      <Route path="/dashboard/role" component={Role} />
                      <Route
                        path="/dashboard/permission"
                        component={Permission}
                      />
                      <Route path="/dashboard/banco" component={Bank} />
                      <Route path="/dashboard/pais" component={Country} />
                      <Route path="/dashboard/deporte" component={Sport} />
                      <Route path="/dashboard/transaction-type" component={TransactionType} />
                      <Route path="/dashboard/share-movement" component={ShareMovement} />
                      <Route path="/dashboard/share-movement-disable" component={ShareMovementDisable} />
                      <Route
                        path="/dashboard/profesion"
                        component={Profession}
                      />
                      <Route path="/dashboard/socio" component={Person} />
                      <Route
                        path="/dashboard/estado-civil"
                        component={MaritalStatus}
                      />
                      <Route
                        path="/dashboard/status-persona"
                        component={StatusPerson}
                      />
                      <Route path="/dashboard/sexo" component={Gender} />
                      <Route path="/dashboard/relation-type" component={RelationType} />
                      <Route path="/dashboard/payment-method" component={PaymentMethod} />
                      <Route path="/dashboard/card-type" component={CardType} />
                      <Route path="/dashboard/share-type" component={ShareType} />
                      <Route path="/dashboard/share" exact component={Share} />
                      <Route path="/dashboard/location" exact component={Location} />
                      <Route path="/dashboard/report-general" exact component={GeneralReport} />
                      <Route path="/dashboard/share-report" exact component={SharesReport} />
                      <Route path="/dashboard/access-control-report" exact component={AccessControlReport} />
                      <Route path="/dashboard/parameter" exact component={Parameter} />
                      <Route path="/dashboard/locker" exact component={Locker} />
                      <Route path="/dashboard/widget" exact component={Widget} />
                      <Route path="/dashboard/menu" exact component={Menu} />
                      <Route path="/dashboard/menu-item" exact component={MenuItem} />
                      <Route path="/dashboard/access-control" exact component={AccessControl} />
                      <Route path="/dashboard/guest" exact component={Guest} />
                      <Route path="/dashboard/about" exact component={About} />
                      <Route path="/dashboard/person-birthday-report" exact component={PersonBirthdayReport} />
                      <Route path="/dashboard/monthly-income-report" exact component={MonthlyIncomeReport} />
                      <Route path="/dashboard/partner-ages-report" exact component={PartnerAgesReport} />
                      <Route path="/dashboard/partners-sons-30" exact component={PartneSons30Report} />
                      <Route path="/dashboard/update-password" exact component={RegisterPassword} />
                      <Route path="/dashboard/share-permit-movements-types" exact component={SharePermitMovementsTypes} />
                      <Route path="/dashboard/share-permit-movements" exact component={SharePermitMovement} />
                    </Dashboard>
                  </Switch>
                );
              }
              return <Redirect to="/login" />;
            }}
          />
        </Switch>
        <Modal />
        <SecondModal />
        <CustomModal />
        <SnackBar />
        <MainLoader />
      </MainLayout>
    </HashRouter>
  );
}
