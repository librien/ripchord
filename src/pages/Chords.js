import Chord from '../components/Chord/Chord';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ChordDiagram from '../components/ChordDiagram.js'
import ChordSelection from '../components/ChordSelection.js'
import { buildFromChordFingeringToVexChord, buildFromChordFingeringToReactChord } from '../utils/BuildChordDiagrams'

const Chords = () => {

  const [chord, setChord] = useState([]);
  const [numStrings, setNumStrings] = useState();
  const [strings, setStrings] = useState();
  const [selectedChord, setSelectedChord] = useState();
  const [chordError, setChordError] = useState();
  

  useEffect(() => {
    setNumStrings(6);
    setSelectedChord('C');
  }, []);

  useEffect(() => {
    if (numStrings > 0) {
      let strings = [];
      for (let i = 1; i < numStrings+1; i++) {
        strings.push(i);
      }
      strings = strings.reverse();
      setStrings(strings); // Set array of strings
    }
  }, [numStrings]);
  
  useEffect(() => {
    if (strings?.length && selectedChord) {
      try {
        //setChord(buildFromChordFingeringToVexChord(selectedChord, strings));
        setChord(buildFromChordFingeringToReactChord(selectedChord, strings))
      }
      catch (error) {
        if (error.message === "Cannot read properties of null (reading 'fingerings')") {
          setChordError(`Unable to find chord ${selectedChord}`);
        }
        setChord();
        setSelectedChord();
      }
    }
  }, [strings, selectedChord]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container fixed>
        <ChordSelection setSelectedChord={setSelectedChord} chordError={chordError} setChordError={setChordError}/>
        {chord?.symbol && 
          <Typography gutterBottom variant="h3" component="div">
            {chord.symbol}
          </Typography>
        }
      </Container>
      { chord?.fingerings &&
        <Grid container spacing={2}>
          {chord.fingerings?.map(fingering => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={fingering.positionString}>
                <Card sx={{ minWidth: 275, maxWidth: 275, margin: 5 }}>
                  <CardContent>
                    {/*<Chord {...fingering} fretPosition={fingering.fretPosition} barres={fingering.barres} label={chord.symbol} />
                    {fingering.positionString}<br/>
            {fingering.difficulty}<br/>*/}
                    {fingering.frets && 
                      <ChordDiagram chord={fingering} instrument={{strings:6}}></ChordDiagram>
                    }
                    {fingering.positionString}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      }   
    </Box>
  )
}

export default Chords;