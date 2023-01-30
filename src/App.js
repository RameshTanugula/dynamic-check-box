import * as React from 'react';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';


import Mapping from './components/mapping';
import TestCreation from './components/testCreation';
import FileUpload from './components/fileUpload';
import FlashCard from './components/flashCard';
import LearningCard from './components/learningCard';
import QuestionCreation from './components/questionCreation';
import Categories from './components/categories';
import CreatePairs from './components/pairsCreation';
import QuestionCreationFromPairs from './components/questionCreationwithPairs';
import Statements from './components/statements';
import CoupenCode from './components/CouponCode';
import UserRequestAccess from './components/UserRequestAccess';
import TitleAndSubTitle from './components/TitleAndSubTitle';
// import QuestionCreationFromStatements from './components/questionCreationFromStatements'
import Questions from './components/questions';
import CreateCourse from './components/CreateCourse';
import TestOMR from './components/testOMR'
import LoginAndRegister from './components/LoginAndRegister';
import * as securedLocalStorage from "./components/SecureLocalaStorage";
import jwt_decode from "jwt-decode";
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [comp, setComp] = React.useState("Home");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState();

  const [anchorEl, setAnchorEl] = React.useState(false);
  const [menuList, setMenuList] = React.useState([]);

  // const handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event) => {
    setAnchorEl(true);
  };

  const handleClose = () => {
    setAnchorEl(false);
  };

  function logout() {
    localStorage.clear();
    window.location = "";
    setIsLoggedIn(false);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function loginData() {
    if (securedLocalStorage.get("token") !== "") {
      const userdata = jwt_decode(securedLocalStorage.get("token"));
      console.log(userdata)
      securedLocalStorage.set("roles", userdata?.userRoles);
      securedLocalStorage.set("currentrole", userdata?.userRoleName);
      setUserData(userdata);
      setMenuList(userdata.menuList);
      setIsLoggedIn(true);
      setAnchorEl(false);
    }
    else {
      setIsLoggedIn(false);
    }

  }
  React.useEffect(() => {
    setAnchorEl(false);
    loginData();
  }, [])

  return (
    <div>
      {!isLoggedIn &&
        <LoginAndRegister loginData={loginData} />
      }

      {isLoggedIn &&
        <Box sx={{ display: 'flex' }}>
          <BrowserRouter>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  E Author - Admin - {comp}
                </Typography>
                <div style={{ position: "absolute", right: "5px" }}>
                  <Button style={{ color: "white" }} onClick={handleMenu}><AccountCircleIcon />{userData.userName}<ArrowDropDownIcon /> </Button>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={anchorEl}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={logout}><LogoutIcon />LogOut</MenuItem>
                  </Menu>
                </div>
              </Toolbar>
            </AppBar>
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                {menuList?.map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      {/* <ListItemText primary={text} onClick={() => setComp(text)} /> */}
                      <Link to={text.toLowerCase()}>
                        <span onClick={() => setComp(text)}>{text}</span>
                      </Link>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
            <Main open={open}>
              <DrawerHeader />

              {/* {comp?.toLowerCase() === 'categories' && <Categories />}
          {comp?.toLowerCase() === 'questions' && <Questions />}
          {comp?.toLowerCase() === 'mapping' && <Mapping />}
          {comp?.toLowerCase() === 'create question' && <QuestionCreation />}
          {comp?.toLowerCase() === 'create question from pairs' && <QuestionCreationFromPairs />}
          {comp?.toLowerCase() === 'create pairs' && <CreatePairs />}
          {comp?.toLowerCase() === 'create statements' && <Statements />}
          {comp?.toLowerCase() === 'create a test' && <TestCreation />}
          {comp?.toLowerCase() === 'upload files' && <FileUpload />}
          {comp?.toLowerCase() === 'testomr' && <TestOMR />}

          {comp?.toLowerCase() === 'flash cards' && <FlashCard />}
          {comp?.toLowerCase() === 'learning cards' && <LearningCard />}
          {comp?.toLowerCase() === 'coupon code' && <CoupenCode />}
          {comp?.toLowerCase() === 'user request access' && <UserRequestAccess />}
          {comp?.toLowerCase() === 'title and subtitle' && <TitleAndSubTitle />}
          {comp?.toLowerCase() === 'create course' && <CreateCourse />} */}
              <Routes>

                <Route exact path="/categories" element={<Categories />} />
                <Route exact path="/review page" element={<Questions />} />
                <Route exact path="/mapping" element={<Mapping />} />
                <Route exact path="/create questions" element={<QuestionCreation />} />

                <Route exact path="/create questions from pairs" element={<QuestionCreationFromPairs />} />
                <Route exact path="/create pairs" element={<CreatePairs />} />
                <Route exact path="/create statements" element={<Statements />} />
                <Route exact path="/create a test" element={<TestCreation />} />
                <Route exact path="/upload files" element={<FileUpload />} />
                <Route exact path="/testOMR" element={<TestOMR />} />
                <Route exact path="/flash cards" element={<FlashCard />} />
                <Route exact path="/learning cards" element={<LearningCard />} />
                <Route exact path="/Coupon Code" element={<CoupenCode />} />
                <Route exact path="/user request access" element={<UserRequestAccess />} />
                <Route exact path="/titles and sub titles" element={<TitleAndSubTitle />} />
                <Route exact path="/create course" element={<CreateCourse />} />
              </Routes>

            </Main>
          </BrowserRouter>
        </Box >
      }
    </div>
  );
}