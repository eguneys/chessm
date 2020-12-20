# Requirements

- [ ] Define a game from fen
- [ ] Show a game position
- [ ] Show lines and variations
  - [ ] Continue from black's move
- [ ] Show text
- [ ] Show header


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

# Definitions

1 Paragraph
    1 Code
        base variation line
        base line
    2 Text
2 Heading
3 Ply

Ply 0 main
line main
line main2 based main
line main2a based main2
Ply 1 main

Plys
    from ply
    variation name, ply
    ask history
      situationFor(variation, ply)

    <board>
        <coords></coords>
        <piece></piece>
        <square cls="last-move"></square>
    </board>

Lines
    from line
    variation name, line
    ask history
      moveFor(variation, ply)

    <strong class='moven'>1.</strong> 
    <span class='movem'>Nf3</span> 
    <span class='movem'>Nf6</span>

History
    from game and line
    games
    lines


Game
    Base,
    Line
