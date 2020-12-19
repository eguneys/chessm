import { parseMdFull } from '../md';

function ok(msg, a) {
  if (a) {
    console.log('✓', msg);
  } else {
    console.log('❌', msg);
  }
}

export default function() {

  let regularText = parseMdFull(`
Regular Text
`);

  console.log(regularText);

  let headerText = parseMdFull(`
# Header
Text
# Header 2
`);

  console.log(headerText);


  let fullText = parseMdFull(`
Define a position
    <main fen> 
Show a position by ply (ply 0 is initial position)
    =main 0
Define a Line
    <main 1. e4 e5 2. d4> 
Define a variation
    <main2 main 2... Nf6> 
Continue variation
    <main2 3. Nf3> 
Regular text
    Text
Regular header
# Header
`);

  console.log(fullText);

}
