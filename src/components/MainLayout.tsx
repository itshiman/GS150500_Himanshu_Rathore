import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import {
    Box,
    CssBaseline,
    AppBar as MuiAppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer as MuiDrawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import AuthButton from './AuthButton';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    })
);

const MainLayout: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const location = useLocation();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // Define navigation items
    const navItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Stores', icon: <StoreIcon />, path: '/stores' },
        { text: 'SKUs', icon: <InventoryIcon />, path: '/skus' },
        { text: 'Planning', icon: <CalendarTodayIcon />, path: '/planning' },
        { text: 'Chart', icon: <BarChartIcon />, path: '/chart' },
    ];

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
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* Company Logo - Replace with your logo image if available */}
                    <Typography variant="h6" noWrap component="div">
                        GSynergy
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <AuthButton />
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={location.pathname === item.path}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {/* Render the routed page content */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
