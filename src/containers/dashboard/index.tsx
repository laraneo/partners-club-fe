import React, { useEffect, useState, FunctionComponent, useCallback } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { useHistory, useLocation } from "react-router-dom";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import SettingsIcon from '@material-ui/icons/Settings';
import _ from 'lodash';

import { logout, checkLogin } from "../../actions/loginActions";
import { getAll as getStatusPersonAll } from "../../actions/statusPersonActions";
import { getAll as getMaritalStatusAll } from "../../actions/maritalStatusActions";
import { getAll as getGenderAll } from "../../actions/genderActions";
import { getAll as getCountries } from "../../actions/countryActions";
import { getAll as getRelationTypes } from "../../actions/relationTypeActions";
import { getAll as getPaymentMethods } from "../../actions/paymentMethodActions";
import { getList as getTransactionTypes } from "../../actions/transactionTypeActions";
import { getList as getCurrencies } from "../../actions/currencyActions";
import { getAll as getSports } from "../../actions/sportActions";
import { getList as getLockerLocationList } from "../../actions/lockerLocationsActions";
import { getList as getMenuList } from "../../actions/menuActions";
import { getList as getParameterList } from "../../actions/parameterActions";
import { getAll as getProfessions } from "../../actions/professionActions";
import icons from "../../helpers/collectionIcons";
import Helper from '../../helpers/utilities';
import { Grid } from "@material-ui/core";

import Logo from '../../components/Logo'
import Loader from "../../components/common/Loader";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%"
    },
    menuContainer: {
      fontSize: '10px',
    },
    profileButton: {
      background: 'white'
    }
  })
);

interface ResponsiveDrawerProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  children?: any;
  container?: Element;
}

interface SubMenuProps {
  menu: Array<string | number>;
  item: any;
}

const SubMenu: FunctionComponent<SubMenuProps> = ({ menu, item }) => {
  const [menuItem, setMenuItem] = useState(null);
  const history = useHistory();
  const findChildrens: any = menu.filter((e: any) => e.parent == item.id);
  let Icon = SettingsIcon;
  if (item.icons) {
    let currenMenutIcon = icons.find((e: any) => e.slug === item.icons.slug);
    if (currenMenutIcon) {
      Icon = currenMenutIcon.name;
    }
  }

  const handleRoute = (path: string) => {
    history.push(path);
  };

  const handleSubMenu = (currentItem: any) => {
    if (menuItem === currentItem) {
      setMenuItem(null);
    } else {
      setMenuItem(currentItem);
    }
  }

  const handleSubMenuOrRoute = useCallback(() => {
    findChildrens.length > 0 ? handleSubMenu(item.id) : handleRoute(item.route ? item.route : '/dashboard/main')
  },
    [item, findChildrens],
  );

  return (
    <React.Fragment key={item.id}>
      <ListItem button onClick={handleSubMenuOrRoute}>
        <ListItemIcon >
          <Icon />
        </ListItemIcon>
        <ListItemText primary={item.name} />
        {findChildrens.length > 0 && (
          item.id === menuItem ? <IconExpandLess /> : <IconExpandMore />
        )
        }
      </ListItem>
      {findChildrens.length > 0 && (
        <Collapse in={item.id === menuItem || false} timeout="auto" unmountOnExit>
          <List dense>
            {findChildrens.map((e: any, i: number) => <SubMenu key={i} menu={menu} item={e} />)}
          </List>
        </Collapse>
      )

      }
    </React.Fragment>
  )
}


export default function Dashboard(props: ResponsiveDrawerProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { container, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [subMenuItem, setSubMenuItem] = React.useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state: any) => state.loginReducer);

  const { listData: menuList } = useSelector((state: any) => state.menuReducer);

  const {
    parameterReducer: { listData: parameterList },
    menuReducer: { loading: menuLoading }
  } = useSelector((state: any) => state);

  const handleMenu1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl(null);
  };


  function setSubMenu(currentItem: any) {
    if (subMenuItem == currentItem) {
      setSubMenuItem(null);
    } else {
      setSubMenuItem(currentItem);
    }
  }

  function build(menu: any) {
    return menu.map((item: any, i: number) => {
      if (item.parent === "0") {
        const findChildrens: any = menu.filter((e: any) => e.parent == item.id);
        let Icon = SettingsIcon;
        if (item.icons) {
          let currenMenutIcon = icons.find((e: any) => e.slug === item.icons.slug);
          if (currenMenutIcon) {
            Icon = currenMenutIcon.name;
          }
        }
        return (
          <React.Fragment key={i}>
            <ListItem button onClick={() => findChildrens.length > 0 ? setSubMenu(item.id) : handeClick(item.route ? item.route : '/dashboard/main')}>
              <ListItemIcon >
                <Icon />
              </ListItemIcon>
              <ListItemText primary={item.name} />
              {findChildrens.length > 0 && (
                item.id === subMenuItem ? <IconExpandLess /> : <IconExpandMore />
              )
              }
            </ListItem>
            {findChildrens.length > 0 && (
              <Collapse in={item.id === subMenuItem ? true : false} timeout="auto" unmountOnExit>
                <List dense>
                  {findChildrens.map((e: any, i: number) => <SubMenu key={i} menu={menu} item={e} />)}
                </List>
              </Collapse>
            )

            }
          </React.Fragment>
        )
      }
    })
  }

  function buildMenu(menu: any) {
    return build(menu);
  }

  useEffect(() => {
    history.listen((location, action) => {
      if (!_.isEmpty(menuList) && menuList.items.length > 0) {
        const route = location.pathname === '/dashboard' ? '/dashboard/main' : location.pathname;
        const isValid = menuList.items.find((e: any) => e.route === route);
        if (!isValid) {
          window.location.href = "/#/dashboard/main";
        }
      }
    });
  }, [menuList, history])


  useEffect(() => {

    const checkLoginPromise = new Promise(function (resolve, reject) {
      resolve(dispatch(checkLogin()));
    });

    checkLoginPromise.then(() => {
      dispatch(getMenuList(location.pathname));
      dispatch(getStatusPersonAll());
      dispatch(getMaritalStatusAll());
      dispatch(getGenderAll());
      dispatch(getCountries());
      dispatch(getRelationTypes());
      dispatch(getPaymentMethods());
      dispatch(getTransactionTypes());
      dispatch(getCurrencies());
      dispatch(getSports());
      dispatch(getLockerLocationList());
      dispatch(getParameterList());
      dispatch(getProfessions());
    })
  }, [dispatch])

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      history.push('/dashboard/main');
    }
  }, [history, location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handeClick = (path: string) => {
    history.push(path);
    setAnchorEl(null);
  };

  const handleLogout = () => dispatch(logout());
  
  const drawer = () => {
    if (menuLoading) {
      return (
        <div style={{ textAlign: 'center', marginTop: 20 }} >
          <Loader />
        </div>
      )
    }
    return (
      <div>
        <Logo />
        <Divider />
        <List dense >
          {!_.isEmpty(menuList) && buildMenu(menuList.items)}
        </List>
      </div>
    );
  }
  const client = Helper.getParameter(parameterList, 'CLIENT_NAME')
  const nameRole: any = !_.isEmpty(user) ? _.first(user.roles) : '';
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.header}>
            <Typography variant="h6" noWrap>
              <Grid container spacing={1}>
                <Grid item xs={12}>Suite Gestion Clubes</Grid>
              </Grid>
              <Grid item xs={12} style={{ fontSize: 14, fontStyle: 'italic' }}>{client.value}</Grid>
            </Typography>
            <Typography variant="h6" noWrap style={{ lineHeight: 3 }}>
              <div>
                <Button
                  startIcon={<AccountCircleIcon />}
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleMenu1}
                  className={classes.profileButton}
                >
                  Usuario: {!loading && user.username}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose1}
                >
                  <MenuItem>Usuario: {!loading && user.username}</MenuItem>
                  <MenuItem>Role: {!loading && !_.isEmpty(nameRole) && nameRole.name}</MenuItem>
                  <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
                </Menu>
              </div>
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer()}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer()}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children && children}
      </main>
    </div>
  );
}
