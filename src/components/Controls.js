import { Box, Drawer, Container } from "@mui/material"
import Metronome from "./Metronome";

const Controls = ({drawerWidth}) => {
  return (
      <Box sx={{ flexGrow: .75, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Drawer
        
          variant="persistent"
          anchor="bottom"
          open={true}
          //onClose={toggleDrawer(anchor, false)}
        >
          <Metronome />
        </Drawer>
      </Box>
  )
}

export default Controls;
