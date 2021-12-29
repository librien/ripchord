import {Box, Drawer, SwipeableDrawer, Toolbar, List, ListItem, Divider, ListItemText} from "@mui/material";

const drawer = (
  <div>
    <Toolbar />
    <Divider />
    <List>
      {['Chords', 'Scales', 'Modes', 'Chord Progressions'].map((text, index) => (
        <ListItem button key={text}>
          {/*<ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>*/}
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
    <Divider />
  </div>
);

const LeftNav = ({drawerWidth, mobileOpen, handleDrawerToggle, container}) => {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <SwipeableDrawer 
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </SwipeableDrawer >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}
export default LeftNav;