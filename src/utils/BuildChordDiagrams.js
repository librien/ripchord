import { findGuitarChord } from 'chord-fingering';

/**
 * Retrieves chordString 
 * @param {*} chordString expects string like `Cmaj7`
 * @param {*} strings expects a number `6`
 * @returns chord object formatted for vexchord
 */
export const buildFromChordFingeringToVexChord = (chordString, strings) => {
  let chord = findGuitarChord(chordString);
  console.log(chord);
  chord.fingerings.forEach(fingering => {
    if (fingering.difficulty) {

      fingering.fretPosition = 1;

      const minFret = Math.min(...fingering.positions.filter(string => string.fret > 0).map(string => string.fret));
      const maxFret = Math.max(...fingering.positions.map(string => string.fret));
      if (maxFret > fingering.fretPosition + 4) {
        fingering.fretPosition = minFret;
      }
      
      fingering.notes = [];
      // Get note for each string
      strings.forEach((string, i) => {
        let notes = [];
        
        let relativePosition = fingering.positions.find(position => position.stringIndex === i);
        if (relativePosition) {
          if (relativePosition.fret === 0) {
            notes.push(string, 0);
          }
          else if (fingering.fretPosition > 1) {
            notes.push(string, relativePosition.fret - minFret+1, relativePosition.note);
          }
          else {
            notes.push(string, relativePosition.fret);
          }
        }
        else {
          notes.push(string, 'x')
        }
        
        fingering.notes.push(notes);
      });
      
      if (fingering.barre) {
        
        const revStrings = [6, 5, 4, 3, 2, 1];
        
        fingering.barres = [];
        fingering.barres.push({
          fromString: revStrings[Math.min(...fingering.barre.stringIndices)], 
          toString: revStrings[Math.max(...fingering.barre.stringIndices)], 
          fret: fingering.fretPosition > 1 ? fingering.barre.fret - minFret+1 : fingering.barre.fret
        });
      }
    }
  });
  return chord;
}


export const buildFromChordFingeringToReactChord = (chordString, strings) => {
  let chord = findGuitarChord(chordString);
  console.log(chord);
  chord.fingerings.forEach(fingering => {
    const minFret = Math.min(...fingering.positions.filter(string => string.fret > 0).map(string => string.fret));
    //console.log(minFret);
    const maxFret = Math.max(...fingering.positions.map(string => string.fret));
    fingering.baseFret = minFret;
    fingering.frets = [];
    fingering.fingers = [];
    fingering.barres = fingering.barre ? [fingering.barre.fret - (fingering.baseFret > 1 ? fingering.baseFret - 1 : 0)] : undefined;
    for (let i = 0; i < strings.length; i++) {
      const position = fingering.positions.find(note => note.stringIndex === i);
      fingering.frets.push(position ? (position.fret > 0 ? position.fret - (fingering.baseFret > 1 ? fingering.baseFret - 1 : 0) : 0) : -1);
      //fingering.fingers.push(position ? position.fret : null);
    }
  });
  return chord;
}