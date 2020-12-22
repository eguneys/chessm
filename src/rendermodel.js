export function renderLineModel(vLine, plyMove) {
  return new RenderLineModel(vLine, plyMove);
}

function RenderLineModel(vLine, plyMove) {

  vLine.fold(({ ply, move }) => {
    this.ply = ply;
    this.san = move.san;
    this.plyStrWhite = (ply + 1) / 2 + '. ';
    this.plyStrBlack = ply / 2 + '... ';


    plyMove(ply).fold(_ => _,
                 err => {
                   this.err = err;
                 });

  }, ({ err, san }) => {
    this.ply = 'E';
    this.plyStrWhite = 'E. ';
    this.plyStrBlack = 'E. ';

    this.err = err;
    this.san = san;
  });
  
}
