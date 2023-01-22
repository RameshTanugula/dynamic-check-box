import * as React from 'react';
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
import ListItemText from '@mui/material/ListItemText';

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  console.log(comp, '####')
  return (
    <Box sx={{ display: 'flex' }}>
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
          {['Categories', 'Questions', 'Mapping', 'Create Question', 'Create Pairs', 'Create Statements', 'Create Question From Pairs', 'Create a Test', 'Upload Files', 'Flash Cards', 'Learning Cards', 'Coupon Code', 'User Request Access', 'Title And Subtitle', 'Create Course'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} onClick={() => setComp(text)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {comp?.toLowerCase() === 'categories' && <Categories />}
        {comp?.toLowerCase() === 'questions' && <Questions />}
        {comp?.toLowerCase() === 'mapping' && <Mapping />}
        {comp?.toLowerCase() === 'create question' && <QuestionCreation />}
        {comp?.toLowerCase() === 'create question from pairs' && <QuestionCreationFromPairs />}
        {comp?.toLowerCase() === 'create pairs' && <CreatePairs />}
        {comp?.toLowerCase() === 'create statements' && <Statements />}
        {comp?.toLowerCase() === 'create a test' && <TestCreation />}
        {comp?.toLowerCase() === 'upload files' && <FileUpload />}

        {comp?.toLowerCase() === 'flash cards' && <FlashCard />}
        {comp?.toLowerCase() === 'learning cards' && <LearningCard />}
        {comp?.toLowerCase() === 'coupon code' && <CoupenCode />}
        {comp?.toLowerCase() === 'user request access' && <UserRequestAccess />}
        {comp?.toLowerCase() === 'title and subtitle' && <TitleAndSubTitle />}
        {comp?.toLowerCase() === 'create course' && <CreateCourse />}

      </Main>
    </Box>
  );
}