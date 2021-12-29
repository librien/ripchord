import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
const ChordSelection = (props) => {
  const [root, setRoot] = React.useState('');
  const [chordInput, setChordInput] = React.useState();
  const handleChange = (event) => {
    setChordInput(event.target.value);
  };
  
  const handleChordSubmit = () => {
    props.setSelectedChord(chordInput);
  }
  
  const notes = ['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#']
  const qualities = ['maj', 'min', 'dom', '°', '⦰'];
  const tension = [];
  const bass = [];

  return (
    <Box xs={12}>
      <Stack direction="row" spacing={2}>
        <FormControl>
          {/*<InputLabel id="demo-simple-select-label">Root</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={root}
            label="Age"
            onChange={handleChange}
          >
            {notes.map(note => (
              <MenuItem value={note}>{note}</MenuItem>
            ))}
            </Select>*/}
          <TextField id="standard-basic" label="Chord" variant="standard" defaultValue="Cmaj7" onChange={handleChange}/>
        </FormControl>
        <Button variant="contained" onClick={handleChordSubmit}>Go</Button>
      </Stack>
      <Collapse in={!!props.chordError}>
        <Alert severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                props.setChordError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          <AlertTitle>Error</AlertTitle>
          {props.chordError && props.chordError}
        </Alert>
      </Collapse>
    </Box>
    
  );
}
export default ChordSelection;