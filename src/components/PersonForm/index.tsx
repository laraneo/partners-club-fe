import React, { useEffect, FunctionComponent, useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import {
  makeStyles,
  Theme,
  useTheme,
  withStyles,
} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PrintIcon from "@material-ui/icons/Print";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import _ from "lodash";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import CustomSelect from "../FormElements/CustomSelect";
import CustomTextField from "../FormElements/CustomTextField";
import {
  update,
  create,
  get,
  searchPersonToAssignFamily,
  searchFamilyByPerson,
  assignPerson,
  removeRelation,
  getReportsByPartner,
  updateRelation,
  getLockersByLocation,
  getLockersByPartner,
  clearPersonLockersByLocation,
  clear,
  searchCompanyPersons,
  searchPersonsByType,
  clearPersonToAssignFamily,
  clearSearchPersonsByType,
  clearSearchCompanyPersons,
} from "../../actions/personActions";
import { getByLocation, clearList } from "../../actions/lockerActions";
import { remove as removeCardPerson } from "../../actions/cardPersonActions";
import {
  getSharesByPartner,
  get as getShare,
  reset as resetShare,
} from "../../actions/shareActions";
import { updateModal } from "../../actions/secondModalActions";
import { update as updateNote } from "../../actions/noteActions";
import TransferList from "../TransferList";
import DataTableAssignPersons from "../DataTableAssignPersons";
import PersonColumn from "../../interfaces/PersonColumn";
import CardPersonColumns from "../../interfaces/CardPersonColumns";
import FamilyPersonColumns from "../../interfaces/FamilyPersonColumns";
import RecordColumns from "../../interfaces/RecordColumns";
import NoteColumns from "../../interfaces/NoteColumns";
import DataTable2 from "../DataTable2";
import DataTable3 from "../DataTable3";
import DataTable4 from "../DataTable4";
import CustomSearch from "../FormElements/CustomSearch";
import LoadingButton from "../FormElements/LoadingButton";
import CardPersonForm from "../CardPersonForm";
import Loader from "../common/Loader";
import RecordForm from "../RecordForm";
import {
  getRecordsByPerson,
  remove as removeRecord,
} from "../../actions/recordActions";
import {
  getNotesByPerson,
  remove as removeNotes,
} from "../../actions/noteActions";
import { update as updateShare } from "../../actions/shareActions";
import NoteForm from "../NoteForm";
import FamilyForm from "../FamilyForm";
import SearchAutoComplete from "../SearchAutoComplete";
import Helper from "../../helpers/utilities";
import moment from "moment";
import {
  getLastMovement,
  updateLastMovement,
} from "../../actions/shareMovementActions";

const formatCreditCard = (card: string) => card.replace(/.(?=.{4})/g, "x");

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
  },
})(MuiExpansionPanelSummary);
const cardPersonColumns: CardPersonColumns[] = [
  {
    id: "id",
    label: "ID",
    minWidth: 5,
    align: "left",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "titular",
    label: "Titular",
    minWidth: 30,
    align: "left",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "ci",
    label: "Cedula",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "card_number",
    label: "Numero",
    minWidth: 15,
    align: "left",
    component: (value: any) => <span>{formatCreditCard(value.value)}</span>,
  },
  {
    id: "sec_code",
    label: "CVC",
    minWidth: 10,
    align: "left",
    component: (value: any) => (
      <span>{value.value.replace(/[0-9]/g, "x")}</span>
    ),
  },
  {
    id: "expiration_date",
    label: "Vence",
    minWidth: 30,
    align: "left",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "card",
    label: "Tipo",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value.description}</span>,
  },
  {
    id: "bank",
    label: "Banco",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value.description}</span>,
  },
  {
    id: "orderDetail",
    label: "Orden",
    minWidth: 10,
    align: "left",
    component: (value: any) => (
      <Chip
        label={value.value}
        style={{
          fontSize: "10px",
        }}
        size="small"
        color="primary"
      />
    ),
  },
];

const FamilysColumns: FamilyPersonColumns[] = [
  {
    id: "id",
    label: "ID",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "rif_ci",
    label: "Rif/CI",
    minWidth: 20,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "description",
    label: "Parentesco",
    minWidth: 20,
    align: "right",
    component: (value: any) => (
      <span>
        <strong>{value.value}</strong>
      </span>
    ),
  },
  {
    id: "name",
    label: "Nombre",
    minWidth: 20,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "last_name",
    label: "Apellido",
    minWidth: 20,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "status",
    label: "",
    minWidth: 20,
    align: "right",
    component: (value: any) => (
      <Chip
        label={value.value === "1" ? "Activo" : "Inactivo"}
        style={{
          backgroundColor: value.value === "1" ? "#2ecc71" : "#e74c3c",
          color: "white",
          fontWeight: "bold",
          fontSize: "10px",
        }}
        size="small"
      />
    ),
  },
];

const relationsColumns: FamilyPersonColumns[] = [
  {
    id: "id",
    label: "ID",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "base",
    label: "Rif/CI",
    minWidth: 20,
    align: "right",
    component: (value: any) => (
      <span>
        <strong>{value.value.rif_ci}</strong>
      </span>
    ),
  },
  {
    id: "relation_type",
    label: "Parentesco",
    minWidth: 20,
    align: "right",
    component: (value: any) => (
      <span>
        <strong>{value.value.inverse_relation}</strong>
      </span>
    ),
  },
  {
    id: "base",
    label: "Nombre",
    minWidth: 20,
    align: "right",
    component: (value: any) => (
      <span>
        <strong>{value.value.name}</strong>
      </span>
    ),
  },
  {
    id: "base",
    label: "Apellido",
    minWidth: 20,
    align: "right",
    component: (value: any) => (
      <span>
        <strong>{value.value.last_name}</strong>
      </span>
    ),
  },
  {
    id: "shares",
    label: "Acciones",
    minWidth: 20,
    align: "right",
    component: (value: any) => (
      <span>
        <strong>{value.value}</strong>
      </span>
    ),
  },
];

const columns: PersonColumn[] = [
  {
    id: "id",
    label: "Id",
    minWidth: 10,
  },
  {
    id: "rif_ci",
    label: "Cedula",
    minWidth: 20,
    align: "right",
  },
  {
    id: "passport",
    label: "Pasaporte",
    minWidth: 20,
    align: "right",
  },
  {
    id: "name",
    label: "Nombre",
    minWidth: 20,
    align: "right",
  },
  {
    id: "last_name",
    label: "Apellido",
    minWidth: 20,
    align: "right",
  },
];

const recordColumns: RecordColumns[] = [
  {
    id: "id",
    label: "Id",
    minWidth: 10,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "created",
    label: "Fecha",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "type",
    label: "Motivo",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value.description}</span>,
  },
  {
    id: "blocked",
    label: "Bloqueado",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value == 1 ? "SI" : "NO"}</span>,
  },
  {
    id: "user",
    label: "Usuario",
    minWidth: 10,
    align: "left",
    component: (value: any) => (
      <span>{value.value ? value.value.username : "-"}</span>
    ),
  },
];

const noteColumns: NoteColumns[] = [
  {
    id: "id",
    label: "Id",
    minWidth: 10,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "created",
    label: "Fecha",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "type",
    label: "Tipo",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value.description}</span>,
  },
  {
    id: "subject",
    label: "Asunto",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 5,
    align: "left",
    component: (value: any) => (
      <span>{value.value == "1" ? "Activo" : "Inactivo"}</span>
    ),
  },
  {
    id: "department",
    label: "Departamento",
    minWidth: 10,
    align: "left",
    component: (value: any) => <span>{value.value.description}</span>,
  },
  {
    id: "user",
    label: "Usuario",
    minWidth: 10,
    align: "left",
    component: (value: any) => (
      <span>{value.value ? value.value.username : "-"}</span>
    ),
  },
];

function getParsePerson(data: any, classes: any) {
  const {
    name,
    last_name,
    telephone1,
    rif_ci,
    address,
    primary_email,
    type_person,
  } = data;
  return (
    <Grid container spacing={1} className={classes.parsedPersonContainer}>
      <Grid item xs={4} className={classes.parsedPersonContainerTitle}>
        <Paper className={classes.parsedPersonContainerDetail}>
          <strong>Tipo Persona:</strong>
          {type_person === "1" ? "Natural" : "Empresa"}
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.parsedPersonContainerDetail}>
          <strong>Cedula/RIF:</strong> {rif_ci}
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.parsedPersonContainerDetail}>
          <strong>Nombre:</strong> {name} {last_name}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.parsedPersonContainerDetail}>
          <strong>Direccion:</strong> {address}
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper className={classes.parsedPersonContainerDetail}>
          <strong>Telefono:</strong> {telephone1}
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper className={classes.parsedPersonContainerDetail}>
          <strong>Correo:</strong> {primary_email}
        </Paper>
      </Grid>
    </Grid>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
    textAlign: "center",
  },
  actionButtonContainer: {
    margin: theme.spacing(1),
    position: "relative",
    textAlign: "right",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -9,
    marginLeft: -9,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "10%",
  },
  select: {
    padding: "10px 0px 10px 0px",
    width: " 100%",
    backgroundColor: "transparent",
    border: 0,
    borderBottom: "1px solid grey",
    fontSize: "16px",
    "&:focus": {
      outline: 0,
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  pictureContainer: {
    maxWidth: 185,
  },
  media: {
    height: 200,
  },
  formContainer: {
    maxWidth: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  swipeableViewsContainer: {},
  reportButtonContainer: {
    textAlign: "right",
  },
  profileName: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#3f51b5",
    fontSize: "20px",
  },
  cardPersonButtonContainer: {
    textAlign: "right",
  },
  cardPersonButton: {
    width: "15%",
    fontSize: "12px",
  },
  cardPaymentMethodPersonButton: {
    width: "100%",
    fontSize: "12px",
  },
  parsedPersonContainer: {
    fontSize: "12px",
  },
  parsedPersonContainerDetail: {
    textAlign: "left",
    padding: "4px",
  },
  personLockersTitle: {
    color: "#3f51b5",
    fontWeight: "bold",
  },
  personRecordTitle: {
    textAlign: "right",
  },
  profileShareTitle: {
    textAlign: "left",
    fontWeight: "bold",
    color: "#3f51b5",
    fontSize: "16px",
  },
  profileMovement: {
    textAlign: "left",
    fontSize: "14px",
  },
}));

type FormData = {
  name: string;
  last_name: string;
  rif_ci: string;
  primary_email: string;
  secondary_email: string;
  passport: string;
  card_number: string;
  birth_date: Date;
  expiration_date: Date;
  gender_id: number;
  representante: string;
  picture: string;
  id_card_picture: string;
  address: string;
  telephone1: string;
  telephone2: string;
  phone_mobile1: string;
  phone_mobile2: string;
  fax: string;
  city: string;
  state: string;
  type_person: number;
  postal_code: string;
  status_person_id: string;
  marital_statuses_id: string;
  countries_id: number;
  profession_list: any;
  share_list: number;
  person: string;
  payment_method_id: number;
  card_people1: number;
  card_people2: number;
  card_people3: number;
  country_list: any;
  sport_list: any;
  locker_list: any;
  locker_location_id: string;
  company_person_id: number;
  id_factura_persona: number;
  type_facturador: string;
  id_fiador_persona: string;
  type_fiador: string;
};

type PersonFormProps = {
  id?: number;
};

interface Item {
  id: number;
  description: string;
}

interface SelectedItems {
  itemsToAdd: Array<string | number>;
  itemsToRemove: Array<string | number>;
}

const initialSelectedItems = {
  itemsToAdd: [],
  itemsToRemove: [],
};

const PersonForm: FunctionComponent<PersonFormProps> = ({ id }) => {
  /* States */
  const [tempPersonId, setTempPersonId] = useState(0);
  const [isPartner, setIsPartner] = useState<any>("0");
  const [selectedRelations, setSelectedRelations] = useState<
    Array<string | number>
  >([]);
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [imageField, setImageField] = useState();
  const [tabValue, setTabValue] = useState(0);
  const [selectedProff, setSelectedProff] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedFacturador, setSelectedFacturador] = useState<any>(null);
  const [selectedFiador, setSelectedFiador] = useState<any>(null);
  const [selectedCountries, setSelectedCountries] = useState<
    Array<string | number>
  >([]);
  const [selectedSports, setSelectedSports] = useState<Array<string | number>>(
    []
  );
  const [selectedLockers, setSelectedLockers] = useState<SelectedItems>(
    initialSelectedItems
  );

  /* Form */

  const {
    handleSubmit,
    register,
    errors,
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<FormData>();
  const { picture, name, last_name } = getValues();

  /* Redux */
  const dispatch = useDispatch();
  const {
    loading,
    relationLoading,
    reportByPartnerLoading,
    personsToAssign,
    paginationPersonsToAssign,
    familyByPerson,
    personLockersByLocation,
    personLockersLoading,
    personLockers,
    setFamilyByPersonLoading,
    companyPersons,
    setCompanyPersonsLoading,
    personsByType,
    setPersonsByTypeLoaing,
  } = useSelector((state: any) => state.personReducer);
  const { list: statusPersonList } = useSelector(
    (state: any) => state.statusPersonReducer
  );

  const { list: maritalStatusList } = useSelector(
    (state: any) => state.maritalStatusReducer
  );
  const { countries: countryList } = useSelector(
    (state: any) => state.countryReducer
  );
  const { list: genderList } = useSelector((state: any) => state.genderReducer);
  const { sports: sportList } = useSelector((state: any) => state.sportReducer);
  const { listData: lockerList, loading: lockerLoading } = useSelector(
    (state: any) => state.lockerReducer
  );
  const { listData: lockerLocationList } = useSelector(
    (state: any) => state.lockerLocationReducer
  );
  const { professions: professionList } = useSelector(
    (state: any) => state.professionReducer
  );
  const { list: relationTypeList } = useSelector(
    (state: any) => state.relationTypeReducer
  );
  const { sharesByPartner, selectedShare } = useSelector(
    (state: any) => state.shareReducer
  );
  const { loading: cardPersonLoading } = useSelector(
    (state: any) => state.cardPersonReducer
  );
  const { list: paymentMethodList } = useSelector(
    (state: any) => state.paymentMethodReducer
  );

  const { lastMovement, lastMovementLoading } = useSelector(
    (state: any) => state.shareMovementReducer
  );

  const { listData: parameterList } = useSelector(
    (state: any) => state.parameterReducer
  );

  const { user } = useSelector((state: any) => state.loginReducer);

  const {
    recordsByPerson,
    loading: recordsByPersonLoading,
    pagination: recordPagination,
  } = useSelector((state: any) => state.recordReducer);

  const {
    notesByPerson,
    loading: notesByPersonLoading,
    pagination: notePagination,
  } = useSelector((state: any) => state.noteReducer);

  const disableTabs = tempPersonId > 0 ? false : true;
  console.log('relationTypeList ', relationTypeList);
  /* Styles */

  const classes = useStyles();
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<{}>, tabValue: number) => {
    setTabValue(tabValue);
  };

  const handleChangeIndex = (index: number) => {
    setTabValue(index);
  };

  const handleExpandedPanel = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const loadPerson = async (personId: number) => {
    setSelectedProff([]);
    const response: any = await dispatch(get(personId));
    // dispatch(searchPersonToAssignFamily(id));
    const {
      name,
      last_name,
      rif_ci,
      primary_email,
      secondary_email,
      passport,
      card_number,
      birth_date,
      expiration_date,
      gender_id,
      representante,
      picture,
      id_card_picture,
      address,
      telephone1,
      telephone2,
      phone_mobile1,
      phone_mobile2,
      fax,
      city,
      state,
      type_person,
      postal_code,
      status_person_id,
      marital_statuses_id,
      countries_id,
      professions,
      countries,
      sports,
      lockers,
      company,
      isPartner,
      relations,
    } = response;
    setValue("name", name);
    setValue("last_name", last_name);
    setValue("rif_ci", rif_ci);
    setValue("primary_email", primary_email);
    setValue("secondary_email", secondary_email);
    setValue("passport", passport);
    setValue("card_number", card_number);
    setValue("birth_date", birth_date);
    setValue("expiration_date", expiration_date);
    setValue("gender_id", gender_id);
    setValue("representante", representante);
    setValue("picture", picture);
    setValue("id_card_picture", id_card_picture);
    setValue("address", address);
    setValue("telephone1", telephone1);
    setValue("telephone2", telephone2);
    setValue("phone_mobile1", phone_mobile1);
    setValue("phone_mobile2", phone_mobile2);
    setValue("fax", fax);
    setValue("city", city);
    setValue("state", state);
    setValue("postal_code", postal_code);
    setValue("type_person", type_person);
    setValue("status_person_id", status_person_id);
    setValue("marital_statuses_id", marital_statuses_id);
    setValue("countries_id", countries_id);
    setImage({ ...image, preview: picture });
    setIsPartner(isPartner);

    if (isPartner === "1") {
      const shareResponse: any = await dispatch(getSharesByPartner(personId));
      if (shareResponse.length > 0) {
        const currentShare = shareResponse.find((e: any, i: any) => i === 0);
        setValue("payment_method_id", currentShare.payment_method_id);
      }
    }

    dispatch(searchFamilyByPerson(personId));
    dispatch(getLockersByPartner(personId));
    dispatch(getRecordsByPerson({ id: personId }));
    dispatch(getNotesByPerson({ id: personId }));

    if (isPartner === "2") {
      setSelectedRelations(relations);
    }
    if (company) {
      setSelectedCompany(company);
    }
    if (countries.length > 0) {
      const list = countries.map((element: any) => element.id);
      setValue("country_list", JSON.stringify(list));
      setSelectedCountries(countries);
    } else {
      setSelectedCountries([]);
    }
    if (sports.length > 0) {
      const list = sports.map((element: any) => element.id);
      setValue("sport_list", JSON.stringify(list));
      setSelectedSports(sports);
    } else {
      setSelectedSports([]);
    }
    if (professions) {
      const list = professions.map((element: any) => element.id);
      setValue("profession_list", JSON.stringify(list));
      setSelectedProff(professions);
    } else {
      setSelectedProff([]);
    }
    // if (lockers.length > 0) {
    //   const list = lockers.map((element: any) => element.id);
    //   setValue("locker_list", JSON.stringify(list));
    //   setSelectedLockers(lockers);
    // }
    setTempPersonId(personId);
  };

  useEffect(() => {
    if (id) {
      loadPerson(id);
    }
  }, [id, dispatch, setValue]);

  useEffect(() => {
    if (!_.isEmpty(sharesByPartner)) {
      const shares = sharesByPartner;
      const share: any = _.first(shares);
      dispatch(getLastMovement(share.share_number));
    }
  }, [dispatch, sharesByPartner]);

  useEffect(() => {
    return () => {
      reset();
      dispatch(resetShare());
      dispatch(clear());
      dispatch(clearPersonLockersByLocation());
      dispatch(clearList());
      dispatch(updateLastMovement());
    };
  }, [reset, dispatch]);

  const handleForm = async (form: object) => {
    const data = {
      ...form,
      lockers: selectedLockers,
      id_card_picture: null,
      user: user.username,
      date: moment().format("YYYY-MM-DD"),
      isPartner: 1,
    };
    if (tempPersonId > 0) {
      await dispatch(update({ id: tempPersonId, ...data }));
      dispatch(getLockersByPartner(tempPersonId));
    } else {
      const response: any = await dispatch(
        create({ ...data, id_card_picture: null })
      );
      setTempPersonId(response.id);
      dispatch(searchPersonToAssignFamily(response.id));
    }
  };

  const triggerClick = (input: any) => {
    if (input) {
      setImageField(input);
    }
  };

  const handleImage = () => {
    imageField.click();
    setImageField(imageField);
  };

  const loadImage = (e: any) => {
    const ObjecUrlImage = window.URL.createObjectURL(e.target.files[0]);
    setImage({
      preview: ObjecUrlImage,
      raw: e.target.files[0],
    });
    const reader: any = new FileReader();
    reader.onload = () => {
      setValue("picture", reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const onProfessionsChange = (event: any) => {
    setValue("profession_list", JSON.stringify(event));
  };

  const onCountriesChange = (event: any) => {
    setValue("country_list", JSON.stringify(event));
  };

  const onSportsChange = (event: any) => {
    setValue("sport_list", JSON.stringify(event));
  };

  const onLockersChange = (event: any, type: string, selected: any) => {
    let lockerList = selectedLockers;
    if (type === "add") {
      selected.forEach((element: any) => {
        const exist = lockerList.itemsToAdd.find(
          (e: any) => e.id === element.id
        );
        if (_.isEmpty(exist)) {
          const currentIndex = lockerList.itemsToRemove.indexOf(element);
          lockerList.itemsToRemove.splice(currentIndex, 1);
          lockerList.itemsToAdd.push(element);
        }
      });
    }
    if (type === "remove") {
      selected.forEach((element: any) => {
        const exist = lockerList.itemsToRemove.find(
          (e: any) => e.id === element.id
        );
        if (_.isEmpty(exist)) {
          const currentIndex = lockerList.itemsToAdd.indexOf(element);
          lockerList.itemsToAdd.splice(currentIndex, 1);
          lockerList.itemsToRemove.push(element);
        }
      });
    }
    setSelectedLockers(lockerList);

    // const list = selectedLockers.map((element: any) => element.id);
    // setValue("locker_list", JSON.stringify(list));
  };

  const handleAssign = async (personRelated: number, relationType: number) => {
    const data = {
      base_id: id,
      related_id: personRelated,
      relation_type_id: relationType,
      status: 1,
    };
    await dispatch(assignPerson(data));
    setExpanded("panel-familiars");
  };

  const handleChangePage = (newPage: number) => {
    // const page = pagination.currentPage === 1 ? 2 : newPage;
    // dispatch(getAll(page, pagination.perPage))
  };

  const handlePerPage = (page: number, perPage: number) => {
    // dispatch(getAll(page, perPage))
  };

  const handleSearch = (event: any) => {
    if (event.value !== "") {
      dispatch(searchPersonToAssignFamily(id, event.value));
    } else {
      dispatch(clearPersonToAssignFamily());
    }
  };

  const handleDeleteRelation = (relationId: number) => {
    dispatch(removeRelation(relationId, id));
  };

  const handleSwitchRelation = (relationId: number, relationStatus: string) => {
    const status = relationStatus == "1" ? 0 : 1;
    const data = {
      id: relationId,
      personId: id,
      status,
    };
    dispatch(updateRelation(data));
  };

  const handleSwitchNote = async (
    selectedId: number,
    relationStatus: string
  ) => {
    const status = relationStatus === "1" ? 0 : 1;
    const data = {
      id: selectedId,
      personId: id,
      status,
    };
    await dispatch(updateNote(data));
  };

  const handleReportByPartner = () => {
    dispatch(getReportsByPartner(id));
  };

  const handleCardPersonCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: (
            <CardPersonForm personId={tempPersonId} share={selectedShare} />
          ),
        },
      })
    );
  };

  const handleCardPersonEdit = (row: any) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: (
            <CardPersonForm
              personId={tempPersonId}
              id={row.id}
              share={selectedShare}
            />
          ),
        },
      })
    );
  };

  const handleCardPersonDelete = (row: any) => {
    dispatch(removeCardPerson(row.id, id, selectedShare.id, row.order));
  };

  const handleShareSelect = (event: any) => {
    dispatch(getShare(event.target.value));
    const share: any = sharesByPartner.find(
      (e: any) => e.id == event.target.value
    );
    if (share) {
      dispatch(getLastMovement(share.share_number));
    } else {
      dispatch(updateLastMovement());
    }
  };

  const handleSelectLockerLocation = async (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    const selected = selectedLockers;
    selected.itemsToAdd.length = 0;
    selected.itemsToRemove.length = 0;
    setSelectedLockers(selected);
    setValue("locker_list", "");
    dispatch(getLockersByLocation({ id, location: event.currentTarget.value }));
    dispatch(getByLocation(event.currentTarget.value));
  };

  const handleRecordChangePage = (newPage: number) => {
    const page = recordPagination.currentPage === 1 ? 2 : newPage;
    // dispatch(getAll(page, recordPagination.perPage))
  };

  const handleRecordPerPage = (page: number, perPage: number) => {
    // dispatch(getAll(page, perPage))
  };

  const handleRecordCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <RecordForm id={id} />,
        },
      })
    );
  };

  const handleNoteCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <NoteForm id={id} />,
        },
      })
    );
  };

  const handleRecordDelete = (recordId: number) => {
    dispatch(removeRecord(recordId, id));
  };

  const handleNoteDelete = (redordId: number) => {
    dispatch(removeNotes(redordId, id));
  };

  const handleNoteView = (id: number) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <NoteForm isView id={id} />,
        },
      })
    );
  };

  const handleRecordView = (id: number) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <RecordForm isView id={id} />,
        },
      })
    );
  };

  const handleFamilyCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <FamilyForm id={id} />,
        },
      })
    );
  };

  const handleSearchCompanys = _.debounce((term: any) => {
    if (term !== "") {
      dispatch(searchCompanyPersons(term));
    } else {
      dispatch(clearSearchCompanyPersons());
    }
  }, 1000);

  const handleSelectCompanyPerson = (option: any) => {
    const current = companyPersons;
    const selected = current.find((e: any) => e.id === option.id);
    if (_.isEmpty(selected)) {
      setSelectedCompany(null);
    } else {
      setSelectedCompany(selected);
      dispatch(clearSearchCompanyPersons());
    }

    setValue("company_person_id", option.id);
  };

  const handleSearchFacturador = _.debounce((term: any) => {
    const { type_facturador } = getValues();
    setSelectedFacturador(null);
    setSelectedFiador(null);
    if (term !== "") {
      dispatch(searchPersonsByType({ term, typePerson: type_facturador }));
    } else {
      dispatch(clearSearchPersonsByType());
    }
  }, 1000);

  const handleSelectFacturador = (option: any) => {
    const current = personsByType;
    const selected = current.find((e: any) => e.id === option.id);
    if (_.isEmpty(selected)) {
      setSelectedFacturador(null);
      setSelectedFiador(null);
    } else {
      dispatch(clearSearchPersonsByType());
      setSelectedFacturador(selected);
    }

    setValue("id_persona_facturador", option.id);
  };

  const handleSearchFiador = _.debounce((term: any) => {
    const { type_fiador } = getValues();
    setSelectedFiador(null);
    setSelectedFacturador(null);
    if (term !== "") {
      dispatch(searchPersonsByType({ term, typePerson: type_fiador }));
    } else {
      dispatch(clearSearchPersonsByType());
    }
  }, 1000);

  const handleSelectFiador = (option: any) => {
    const current = personsByType;
    const selected = current.find((e: any) => e.id === option.id);
    if (_.isEmpty(selected)) {
      setSelectedFiador(null);
      setSelectedFacturador(null);
    } else {
      dispatch(clearSearchPersonsByType());
      setSelectedFiador(selected);
    }

    setValue("id_persona_fiador", option.id);
  };

  const updatePersonShare = (body: object) => {
    dispatch(updateShare(body, true));
  };

  const updatePaymentMethodShare = () => {
    const { payment_method_id } = getValues();
    dispatch(updateShare({ id: selectedShare.id, payment_method_id }, true));
  };

  const getOptionLabelCompanyPerson = (option: any) =>
    `${option.name} ${option.last_name}`;

  const handleLoadPerson = (personId: number) => {
    const selected = selectedLockers;
    selected.itemsToAdd.length = 0;
    selected.itemsToRemove.length = 0;
    setSelectedLockers(selected);
    loadPerson(personId);
  };

  const renderMainData = () => {
    const { expiration_date } = getValues();
    return (
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <CustomSelect
            label="Tipo Persona"
            selectionMessage="Seleccione"
            field="type_person"
            register={register}
            errorsMessageField={
              errors.type_person && errors.type_person.message
            }
          >
            <option value={1}> Natural </option>
            <option value={2}> Empresa </option>
          </CustomSelect>
        </Grid>
        <Grid item xs={3}>
          <CustomTextField
            placeholder="Cedula / Rif"
            field="rif_ci"
            required
            register={register}
            errorsField={errors.rif_ci}
            errorsMessageField={errors.rif_ci && errors.rif_ci.message}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomTextField
            placeholder="Nombre"
            field="name"
            required
            register={register}
            errorsField={errors.name}
            errorsMessageField={errors.name && errors.name.message}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomTextField
            placeholder="Apellido"
            field="last_name"
            required
            register={register}
            errorsField={errors.last_name}
            errorsMessageField={errors.last_name && errors.last_name.message}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomTextField
            placeholder="Fecha de Nacimiento"
            field="birth_date"
            required
            register={register}
            errorsField={errors.birth_date}
            errorsMessageField={errors.birth_date && errors.birth_date.message}
            type="date"
          />
        </Grid>

        <Grid item xs={3}>
          <CustomTextField
            placeholder="Pasaporte"
            field="passport"
            register={register}
            errorsMessageField={errors.passport && errors.passport.message}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomSelect
            label="Estado Civil"
            selectionMessage="Seleccione"
            field="marital_statuses_id"
            required
            register={register}
            errorsMessageField={
              errors.marital_statuses_id && errors.marital_statuses_id.message
            }
          >
            {maritalStatusList.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.description}
              </option>
            ))}
          </CustomSelect>
        </Grid>
        <Grid item xs={3}>
          <CustomSelect
            label="Sexo"
            field="gender_id"
            required
            register={register}
            errorsMessageField={errors.gender_id && errors.gender_id.message}
            selectionMessage="Seleccione"
          >
            {genderList.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.description}
              </option>
            ))}
          </CustomSelect>
        </Grid>
        <Grid item xs={3}>
          <CustomTextField
            placeholder="N° Carnet"
            field="card_number"
            register={register}
            errorsField={errors.card_number}
            errorsMessageField={
              errors.card_number && errors.card_number.message
            }
          />
        </Grid>
        <Grid item xs={3} style={{ lineHeight: 2.5 }}>
          <Paper className={classes.parsedPersonContainerDetail}>
            <strong>Vencimiento</strong>{" "}
            {expiration_date && moment(expiration_date).format("DD-MM-YYYY")}
          </Paper>
          <input
            style={{ display: "none" }}
            name="expiration_date"
            ref={register}
          />
          {/* <CustomTextField
            placeholder="Fecha de Vencimiento"
            field="expiration_date"
            register={register}
            errorsField={errors.expiration_date}
            errorsMessageField={
              errors.expiration_date && errors.expiration_date.message
            }
            type="date"
          /> */}
        </Grid>
        <Grid item xs={3}>
          <CustomSelect
            label="Estatus"
            selectionMessage="Seleccione"
            field="status_person_id"
            required
            register={register}
            errorsMessageField={
              errors.status_person_id && errors.status_person_id.message
            }
          >
            {statusPersonList.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.description}
              </option>
            ))}
          </CustomSelect>
        </Grid>

        {/* <Grid item xs={3}>
          <CustomTextField
            placeholder="Representante"
            field="representante"
            required
            register={register}
            errorsField={errors.representante}
            errorsMessageField={
              errors.representante && errors.representante.message
            }
          />
        </Grid> */}
      </Grid>
    );
  };

  const renderAddressData = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid xs={6}>
              <CustomTextField
                placeholder="Direccion"
                field="address"
                register={register}
                errorsField={errors.address}
                errorsMessageField={errors.address && errors.address.message}
                multiline
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <CustomSelect
            label="Pais"
            selectionMessage="Seleccione"
            field="countries_id"
            register={register}
            errorsMessageField={
              errors.countries_id && errors.countries_id.message
            }
          >
            {countryList.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.description}
              </option>
            ))}
          </CustomSelect>
        </Grid>
        <Grid item xs={3}>
          <CustomTextField
            placeholder="Estado"
            field="state"
            register={register}
            errorsField={errors.state}
            errorsMessageField={errors.state && errors.state.message}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomTextField
            placeholder="Ciudad"
            field="city"
            register={register}
            errorsField={errors.city}
            errorsMessageField={errors.city && errors.city.message}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomTextField
            placeholder="Codigo Postal"
            field="postal_code"
            register={register}
            errorsField={errors.postal_code}
            errorsMessageField={
              errors.postal_code && errors.postal_code.message
            }
          />
        </Grid>
      </Grid>
    );
  };

  const renderContactsData = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Correo Primario"
                field="primary_email"
                register={register}
                errorsField={errors.primary_email}
                errorsMessageField={
                  errors.primary_email && errors.primary_email.message
                }
                inputType="email"
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Correo Secundario"
                field="secondary_email"
                register={register}
                errorsField={errors.secondary_email}
                errorsMessageField={
                  errors.secondary_email && errors.secondary_email.message
                }
                inputType="email"
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Telefono 1"
                field="telephone1"
                register={register}
                errorsField={errors.telephone1}
                errorsMessageField={
                  errors.telephone1 && errors.telephone1.message
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Telefono 2"
                field="telephone2"
                register={register}
                errorsField={errors.telephone2}
                errorsMessageField={
                  errors.telephone2 && errors.telephone2.message
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Celular 1"
                field="phone_mobile1"
                register={register}
                errorsField={errors.phone_mobile1}
                errorsMessageField={
                  errors.phone_mobile1 && errors.phone_mobile1.message
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Celular 2"
                field="phone_mobile2"
                register={register}
                errorsField={errors.phone_mobile2}
                errorsMessageField={
                  errors.phone_mobile2 && errors.phone_mobile2.message
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={6}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={3}
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Fax"
                field="fax"
                register={register}
                errorsField={errors.fax}
                errorsMessageField={errors.fax && errors.fax.message}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderPaymentMethod = () => {
    const {
      share_number,
      tarjeta_primaria,
      tarjeta_secundaria,
      tarjeta_terciaria,
    } = selectedShare;
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                style={{ fontSize: "12px", minWidth: 20 }}
              >
                Accion
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "12px", minWidth: 20 }}
              >
                Forma de Pago
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "12px", minWidth: 20 }}
              >
                Primaria
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "12px", minWidth: 20 }}
              >
                Secundaria
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "12px", minWidth: 20 }}
              >
                Terciaria
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: "12px", minWidth: 30 }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="left" style={{ fontSize: "12px" }}>
                {share_number}
              </TableCell>
              <TableCell align="left" style={{ fontSize: "12px" }}>
                <CustomSelect
                  selectionMessage="Seleccione"
                  field="payment_method_id"
                  register={register}
                  errorsMessageField={
                    errors.payment_method_id && errors.payment_method_id.message
                  }
                >
                  {paymentMethodList.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.description}
                    </option>
                  ))}
                </CustomSelect>
              </TableCell>
              <TableCell align="left" style={{ fontSize: "12px" }}>
                {tarjeta_primaria &&
                  formatCreditCard(tarjeta_primaria.card_number)}
              </TableCell>
              <TableCell align="left" style={{ fontSize: "12px" }}>
                {tarjeta_secundaria &&
                  formatCreditCard(tarjeta_secundaria.card_number)}
              </TableCell>
              <TableCell align="left" style={{ fontSize: "12px" }}>
                {tarjeta_terciaria &&
                  formatCreditCard(tarjeta_terciaria.card_number)}
              </TableCell>
              <TableCell align="left" style={{ fontSize: "12px" }}>
                <Button
                  size="small"
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.cardPaymentMethodPersonButton}
                  onClick={() => updatePaymentMethodShare()}
                >
                  Actualizar
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderCardPersonData = () => {
    const {
      tarjeta_primaria,
      tarjeta_secundaria,
      tarjeta_terciaria,
    } = selectedShare;
    const cardList = [];
    const dataList = [];

    if (tarjeta_primaria) {
      dataList.push({ ...tarjeta_primaria, orderDetail: "Primario", order: 1 });
      cardList.push({ ...tarjeta_primaria });
    }

    if (tarjeta_secundaria) {
      dataList.push({
        ...tarjeta_secundaria,
        orderDetail: "Secundario",
        order: 2,
      });
      cardList.push({ ...tarjeta_secundaria });
    }

    if (tarjeta_terciaria) {
      dataList.push({
        ...tarjeta_terciaria,
        orderDetail: "Terciario",
        order: 3,
      });
      cardList.push({ ...tarjeta_terciaria });
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} className="card-person-data-table">
          <DataTable3
            data={dataList}
            columns={cardPersonColumns}
            handleEdit={handleCardPersonEdit}
            isDelete
            handleDelete={handleCardPersonDelete}
            loading={cardPersonLoading}
            fontSize="12px"
          />
        </Grid>
        {cardList.length < 3 && (
          <Grid item xs={12} className={classes.cardPersonButtonContainer}>
            <Button
              size="small"
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.cardPersonButton}
              onClick={() => handleCardPersonCreate()}
            >
              Incluir Tarjeta
            </Button>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderRecords = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={3}
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={6}>
              Expedientes
            </Grid>
            <Grid
              item
              xs={6}
              className={classes.personRecordTitle}
              onClick={() => handleRecordCreate()}
            >
              <Fab size="small" color="primary" aria-label="add">
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DataTable4
            rows={recordsByPerson}
            pagination={recordPagination}
            handleDelete={handleRecordDelete}
            handleView={handleRecordView}
            columns={recordColumns}
            loading={recordsByPersonLoading}
            onChangePage={handleRecordChangePage}
            onChangePerPage={handleRecordPerPage}
            customFiles
          />
        </Grid>
      </Grid>
    );
  };

  const renderNotes = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={3}
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={6}>
              Notas
            </Grid>
            <Grid
              item
              xs={6}
              className={classes.personRecordTitle}
              onClick={() => handleNoteCreate()}
            >
              <Fab size="small" color="primary" aria-label="add">
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DataTable4
            rows={notesByPerson}
            pagination={notePagination}
            handleDelete={handleNoteDelete}
            handleView={handleNoteView}
            columns={noteColumns}
            loading={notesByPersonLoading}
            onChangePage={handleRecordChangePage}
            onChangePerPage={handleRecordPerPage}
            handleSwitch={handleSwitchNote}
          />
        </Grid>
      </Grid>
    );
  };

  const renderWork = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <CustomTextField
            placeholder="Cargo"
            field="representante"
            register={register}
            errorsField={errors.representante}
            errorsMessageField={
              errors.representante && errors.representante.message
            }
          />
        </Grid>
        <Grid item xs={6}>
          <SearchAutoComplete
            label="Buscar Compania"
            options={companyPersons}
            loading={setCompanyPersonsLoading}
            handleSearch={handleSearchCompanys}
            handleSelect={handleSelectCompanyPerson}
            errorsField={errors.company_person_id}
            getOptionLabel={getOptionLabelCompanyPerson}
            errorsMessageField={
              errors.company_person_id && errors.company_person_id.message
            }
          />
          <input
            style={{ display: "none" }}
            name="company_person_id"
            ref={register}
          />
        </Grid>
        {selectedCompany && (
          <React.Fragment>
            <Grid item xs={12}>
              Actual Compania:
            </Grid>
            <Grid item xs={12}>
              {getParsePerson(selectedCompany, classes)}
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    );
  };

  const renderFacturador = () => {
    let selected = selectedShare.facturador;
    if (selectedFacturador) {
      selected = selectedFacturador;
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <CustomSelect
                label="Tipo"
                selectionMessage="Seleccione"
                field="type_facturador"
                register={register}
                errorsMessageField={
                  errors.type_facturador && errors.type_facturador.message
                }
                optionValueSelected={1}
              >
                <option value={1}> Natural </option>
                <option value={2}> Empresa </option>
                <option value={3}> Ambos </option>
              </CustomSelect>
            </Grid>
            <Grid item xs={8}>
              <SearchAutoComplete
                label="Buscar Facturador"
                options={personsByType}
                loading={setPersonsByTypeLoaing}
                handleSearch={handleSearchFacturador}
                handleSelect={handleSelectFacturador}
                errorsField={errors.id_factura_persona}
                getOptionLabel={getOptionLabelCompanyPerson}
                errorsMessageField={
                  errors.id_factura_persona && errors.id_factura_persona.message
                }
              />
            </Grid>
            <Grid xs={2}>
              {selectedFacturador && (
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  size="small"
                  onClick={() =>
                    updatePersonShare({
                      id: selectedShare.id,
                      id_factura_persona: selectedFacturador.id,
                    })
                  }
                >
                  Actualizar
                </Button>
              )}
            </Grid>
          </Grid>
          <input
            style={{ display: "none" }}
            name="id_factura_persona"
            ref={register}
          />
        </Grid>
        {selected && (
          <React.Fragment>
            <Grid item xs={12}>
              Facturador Actual:
            </Grid>
            <Grid item xs={12}>
              {getParsePerson(selected, classes)}
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    );
  };

  const renderFiador = () => {
    let selected = selectedShare.fiador;
    if (selectedFiador) {
      selected = selectedFiador;
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <CustomSelect
                label="Tipo"
                selectionMessage="Seleccione"
                field="type_fiador"
                register={register}
                errorsMessageField={
                  errors.type_fiador && errors.type_fiador.message
                }
                optionValueSelected={1}
              >
                <option value={1}> Natural </option>
                <option value={2}> Empresa </option>
                <option value={3}> Ambos </option>
              </CustomSelect>
            </Grid>
            <Grid item xs={8}>
              <SearchAutoComplete
                label="Buscar Fiador"
                options={personsByType}
                loading={setPersonsByTypeLoaing}
                handleSearch={handleSearchFiador}
                handleSelect={handleSelectFiador}
                errorsField={errors.id_fiador_persona}
                getOptionLabel={getOptionLabelCompanyPerson}
                errorsMessageField={
                  errors.id_fiador_persona && errors.id_fiador_persona.message
                }
              />
            </Grid>
            <Grid xs={2}>
              {selectedFiador && (
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  size="small"
                  onClick={() =>
                    updatePersonShare({
                      id: selectedShare.id,
                      id_fiador_persona: selectedFiador.id,
                    })
                  }
                >
                  Actualizar
                </Button>
              )}
            </Grid>
          </Grid>
          <input
            style={{ display: "none" }}
            name="id_fiador_persona"
            ref={register}
          />
        </Grid>
        {selected && (
          <React.Fragment>
            <Grid item xs={12}>
              Fiador Actual:
            </Grid>
            <Grid item xs={12}>
              {getParsePerson(selected, classes)}
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    );
  };

  // const renderShareProfile = () => {
  //   if (!_.isEmpty(promotor)) {
  //     return (
  //       <Grid item xs={12}>
  //         <Grid item xs={12} className={classes.profileShareTitle}>Acciones</Grid>
  //         <div className="custom-select-container">
  //           <select
  //             name="relation"
  //             onChange={handleShareSelect}
  //             style={{ fontSize: "13px" }}
  //           >
  //             {sharesByPartner.map((item: any, i: number) => (
  //               <option value={item.id}>{item.share_number}</option>
  //             ))}
  //           </select>
  //         </div>
  //       </Grid>
  //     )
  //   }
  // }

  const renderLastMovement = () => {
    if (lastMovementLoading) {
      return <Loader />;
    }
    return (
      !_.isEmpty(lastMovement) && (
        <Grid container spacing={0} style={{ marginTop: 20 }}>
          <Grid item xs={12} className={classes.profileMovement}>
            {lastMovement.created}
          </Grid>
          <Grid item xs={12} className={classes.profileMovement}>
            {lastMovement.description}
          </Grid>
          <Grid item xs={12} className={classes.profileMovement}>
            {lastMovement.transaction.description}
          </Grid>
        </Grid>
      )
    );
  };

  const getNacionalityLabel = (row: any) => row.citizenship;

  let imagePreview = picture;
  if (image.preview) imagePreview = image.preview;
  return (
    <Container component="main" className={classes.formContainer}>
      <div className={classes.paper}>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card className={classes.pictureContainer}>
                    <CardActionArea onClick={() => handleImage()}>
                      <CardMedia
                        className={classes.media}
                        image={imagePreview}
                      />
                    </CardActionArea>
                  </Card>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="load_image"
                    accept="image/*"
                    ref={triggerClick}
                    onChange={loadImage}
                  />
                  <input
                    style={{ display: "none" }}
                    name="picture"
                    id="picture"
                    ref={register}
                  />
                </Grid>
                <Grid item xs={12} className={classes.profileName}>
                  {name} {last_name}
                </Grid>
                {sharesByPartner.length > 0 && (
                  <Grid item xs={12}>
                    <div className="custom-select-container">
                      <select
                        name="relation"
                        onChange={handleShareSelect}
                        style={{ fontSize: "13px" }}
                      >
                        {sharesByPartner.map((item: any, i: number) => (
                          <option value={item.id}>{item.share_number}</option>
                        ))}
                      </select>
                    </div>
                  </Grid>
                )}
              </Grid>
              {/* {renderShareProfile()} */}
              {renderLastMovement()}
            </Grid>

            <Grid item xs={10}>
              <Grid container spacing={2}>
                <div className={classes.root}>
                  <AppBar position="static" color="default">
                    <Tabs
                      value={tabValue}
                      onChange={handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab label="Socio" disabled={disableTabs} />
                      <Tab label="Familiares" disabled={disableTabs} />
                      <Tab label="Pagos" disabled={disableTabs} />
                      <Tab label="Notas" disabled={disableTabs} />
                      <Tab label="Expedientes" disabled={disableTabs} />
                      <Tab label="Lockers" disabled={disableTabs} />
                    </Tabs>
                  </AppBar>
                  <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={tabValue}
                    onChangeIndex={handleChangeIndex}
                    className={classes.swipeableViewsContainer}
                  >
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
                      <div className={classes.root}>
                        <ExpansionPanel
                          expanded={expanded === "panel1"}
                          onChange={handleExpandedPanel("panel1")}
                        >
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className={classes.heading}>
                              Datos Principales
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            {renderMainData()}
                          </ExpansionPanelDetails>
                        </ExpansionPanel>

                        <ExpansionPanel
                          disabled={disableTabs}
                          expanded={expanded === "panel2"}
                          onChange={handleExpandedPanel("panel2")}
                        >
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className={classes.heading}>
                              Direccion
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            {renderAddressData()}
                          </ExpansionPanelDetails>
                        </ExpansionPanel>

                        <ExpansionPanel
                          disabled={disableTabs}
                          expanded={expanded === "panel3"}
                          onChange={handleExpandedPanel("panel3")}
                        >
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className={classes.heading}>
                              Contactos
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            {renderContactsData()}
                          </ExpansionPanelDetails>
                        </ExpansionPanel>

                        <ExpansionPanel
                          disabled={disableTabs}
                          expanded={expanded === "panel4"}
                          onChange={handleExpandedPanel("panel4")}
                        >
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className={classes.heading}>
                              Profesiones
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                {professionList.length > 0 && selectedProff && (
                                  <TransferList
                                    data={professionList}
                                    selectedData={selectedProff}
                                    leftTitle="Profesiones"
                                    onSelectedList={onProfessionsChange}
                                  />
                                )}
                                <input
                                  style={{ display: "none" }}
                                  name="profession_list"
                                  ref={register}
                                />
                              </Grid>
                            </Grid>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>

                        <ExpansionPanel
                          disabled={disableTabs}
                          expanded={expanded === "panel5"}
                          onChange={handleExpandedPanel("panel5")}
                        >
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className={classes.heading}>
                              Nacionalidades
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                {countryList.length > 0 && (
                                  <TransferList
                                    data={countryList}
                                    selectedData={selectedCountries}
                                    leftTitle="Nacionalidades"
                                    onSelectedList={onCountriesChange}
                                    getLabel={getNacionalityLabel}
                                  />
                                )}
                                <input
                                  style={{ display: "none" }}
                                  name="country_list"
                                  ref={register}
                                />
                              </Grid>
                            </Grid>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel
                          disabled={disableTabs}
                          expanded={expanded === "panel6"}
                          onChange={handleExpandedPanel("panel6")}
                        >
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel6a-content"
                            id="panel6a-header"
                          >
                            <Typography className={classes.heading}>
                              Deportes
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                {sportList.length > 0 && (
                                  <TransferList
                                    data={sportList}
                                    selectedData={selectedSports}
                                    leftTitle="Deportes"
                                    onSelectedList={onSportsChange}
                                  />
                                )}
                                <input
                                  style={{ display: "none" }}
                                  name="sport_list"
                                  ref={register}
                                />
                              </Grid>
                            </Grid>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel
                          disabled={disableTabs}
                          expanded={expanded === "panel7"}
                          onChange={handleExpandedPanel("panel7")}
                        >
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel7a-content"
                            id="panel7a-header"
                          >
                            <Typography className={classes.heading}>
                              Trabajo
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            {renderWork()}
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </div>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1} dir={theme.direction}>
                      <div className={classes.root}>
                        <Grid
                          container
                          spacing={3}
                          style={{ marginBottom: 10 }}
                        >
                          <Grid item xs={12}>
                            <Grid
                              container
                              spacing={3}
                              direction="row"
                              justify="space-around"
                              alignItems="center"
                            >
                              <Grid item xs={isPartner === "1" ? 6 : 12}>
                                Familiares
                              </Grid>
                              {isPartner === "1" && (
                                <Grid item xs={6}>
                                  <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    spacing={3}
                                  >
                                    {Helper.checkParameter(
                                      parameterList,
                                      "PARTNER_ALLOW_ADD"
                                    ) && (
                                      <Grid
                                        item
                                        xs={2}
                                        onClick={() => handleFamilyCreate()}
                                        style={{ textAlign: "right" }}
                                      >
                                        <Fab
                                          size="small"
                                          color="primary"
                                          aria-label="add"
                                        >
                                          <AddIcon />
                                        </Fab>
                                      </Grid>
                                    )}
                                    <Grid
                                      item
                                      xs={2}
                                      onClick={() => handleReportByPartner()}
                                      style={{ textAlign: "right" }}
                                    >
                                      <div>
                                        <Fab
                                          size="small"
                                          color="primary"
                                          aria-label="report"
                                        >
                                          <PrintIcon />
                                        </Fab>
                                      </div>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                        {isPartner === "1" && (
                          <React.Fragment>
                            <ExpansionPanel
                              expanded={expanded === "panel-familiars-assing"}
                              onChange={handleExpandedPanel(
                                "panel-familiars-assing"
                              )}
                            >
                              <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel-familiarsa-assing-content"
                                id="panel-familiarsa-assing-header"
                              >
                                <Typography className={classes.heading}>
                                  Buscar familiares
                                </Typography>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <CustomSearch handleSearch={handleSearch} />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <DataTableAssignPersons
                                      rows={personsToAssign}
                                      pagination={paginationPersonsToAssign}
                                      handleAssign={handleAssign}
                                      columns={columns}
                                      onChangePage={handleChangePage}
                                      onChangePerPage={handlePerPage}
                                      selectOptionData={relationTypeList}
                                      loading={setFamilyByPersonLoading}
                                    />
                                  </Grid>
                                </Grid>
                              </ExpansionPanelDetails>
                            </ExpansionPanel>

                            <ExpansionPanel
                              expanded={expanded === "panel-familiars"}
                              onChange={handleExpandedPanel("panel-familiars")}
                            >
                              <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel-familiarsa-content"
                                id="panel-familiarsa-header"
                              >
                                <Typography className={classes.heading}>
                                  Familiares Asignados
                                </Typography>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <DataTable2
                                      data={familyByPerson}
                                      columns={FamilysColumns}
                                      isDelete
                                      handleDelete={handleDeleteRelation}
                                      handleSwitch={handleSwitchRelation}
                                      handleEdit={handleLoadPerson}
                                      loading={relationLoading}
                                      fontSize="12px"
                                    />
                                  </Grid>
                                </Grid>
                              </ExpansionPanelDetails>
                            </ExpansionPanel>
                          </React.Fragment>
                        )}
                        {isPartner === "2" && (
                          <ExpansionPanel
                            expanded={expanded === "panel-familiars"}
                            onChange={handleExpandedPanel("panel-familiars")}
                          >
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel-familiarsa-content"
                              id="panel-familiarsa-header"
                            >
                              <Typography className={classes.heading}>
                                Relacionados
                              </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <DataTable2
                                    data={selectedRelations}
                                    columns={relationsColumns}
                                    fontSize="12px"
                                    handleEdit={handleLoadPerson}
                                  />
                                </Grid>
                              </Grid>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        )}
                      </div>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2} dir={theme.direction}>
                      {!_.isEmpty(selectedShare) && (
                        <div className={classes.root}>
                          <ExpansionPanel
                            expanded={expanded === "panel-invoice-person"}
                            onChange={handleExpandedPanel(
                              "panel-invoice-person"
                            )}
                          >
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel-invoice-person-content"
                              id="panel-invoice-person-header"
                            >
                              <Typography className={classes.heading}>
                                Facturar a nombre de
                              </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              {renderFacturador()}
                            </ExpansionPanelDetails>
                          </ExpansionPanel>

                          <ExpansionPanel
                            expanded={expanded === "panel-titular-persona"}
                            onChange={handleExpandedPanel(
                              "panel-titular-persona"
                            )}
                          >
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel-titular-persona-content"
                              id="panel-titular-persona-header"
                            >
                              <Typography className={classes.heading}>
                                Titular
                              </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              {selectedShare.titular &&
                                getParsePerson(selectedShare.titular, classes)}
                            </ExpansionPanelDetails>
                          </ExpansionPanel>

                          <ExpansionPanel
                            expanded={expanded === "panel-fiador-persona"}
                            onChange={handleExpandedPanel(
                              "panel-fiador-persona"
                            )}
                          >
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel-fiador-persona-content"
                              id="panel-fiador-persona-header"
                            >
                              <Typography className={classes.heading}>
                                Fiador
                              </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              {renderFiador()}
                            </ExpansionPanelDetails>
                          </ExpansionPanel>

                          <ExpansionPanel
                            expanded={expanded === "panel-credit-card"}
                            onChange={handleExpandedPanel("panel-credit-card")}
                          >
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel-credit-card-content"
                              id="panel-credit-card-header"
                            >
                              <Typography className={classes.heading}>
                                Tarjetas de Credito
                              </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              {renderCardPersonData()}
                            </ExpansionPanelDetails>
                          </ExpansionPanel>

                          <ExpansionPanel
                            expanded={expanded === "panel-payment-method"}
                            onChange={handleExpandedPanel(
                              "panel-payment-method"
                            )}
                          >
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel-payment-method-content"
                              id="panel-payment-method-header"
                            >
                              <Typography className={classes.heading}>
                                Forma de Pago
                              </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  {renderPaymentMethod()}
                                </Grid>
                              </Grid>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        </div>
                      )}
                    </TabPanel>
                    <TabPanel value={tabValue} index={3} dir={theme.direction}>
                      {renderNotes()}
                    </TabPanel>
                    <TabPanel value={tabValue} index={4} dir={theme.direction}>
                      {renderRecords()}
                    </TabPanel>
                    <TabPanel value={tabValue} index={5} dir={theme.direction}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Grid container spacing={3}>
                            <Grid
                              item
                              xs={12}
                              className={classes.personLockersTitle}
                            >
                              Mis Lockers
                            </Grid>
                            {personLockersLoading ? (
                              <Loader />
                            ) : (
                              personLockers.map((e: any, i: number) => (
                                <Grid item xs={12} key={i}>
                                  {e.location.description} - {e.description}
                                </Grid>
                              ))
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} style={{ marginTop: "20px" }}>
                        <select
                          name="locker_location_id"
                          onChange={handleSelectLockerLocation}
                          className={classes.select}
                        >
                          <option value="">Seleccione Ubicacion</option>
                          {lockerLocationList.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.description}
                            </option>
                          ))}
                        </select>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            {lockerLoading ? (
                              <Loader />
                            ) : (
                              <TransferList
                                data={lockerList}
                                selectedData={personLockersByLocation}
                                leftTitle="Lockers"
                                onSelectedList={onLockersChange}
                              />
                            )}
                            <input
                              style={{ display: "none" }}
                              name="locker_list"
                              ref={register}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </TabPanel>
                  </SwipeableViews>
                </div>
              </Grid>
            </Grid>
          </Grid>

          {tabValue !== 2 && (
            <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                className={classes.submit}
              >
                {tempPersonId > 0 ? "Actualizar" : "Crear"}
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          )}
        </form>
      </div>
    </Container>
  );
};

export default PersonForm;
