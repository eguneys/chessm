import * as util from './util';
import Situation from './situation';

export default function Move({
  piece,
  orig,
  dest,
  situationBefore,
  after,
  capture,
  promotion,
  castle,
  enpassant
}) {

  this.piece = piece;
  this.orig = orig;
  this.dest = dest;
  
  this.situationBefore = () => situationBefore;
  this.after = () => after;
  this.before = () => situationBefore.board;
  this.situationAfter = () => 
  new Situation(finalizeAfter(), 
                util.flip(piece.color));

  function finalizeAfter() {
    return after;
  };

  

}
