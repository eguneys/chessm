import { File } from './pos';

export const KingSide = {
  name: 'king',
  castledKingFile: File.G,
  castledRookFile: File.F,
  tripToRook: (kingPos, board) => 
  kingPos.righte(_ => board.pieces[_.key])
};

export const QueenSide = {
  name: 'queen',
  castledKingFile: File.C,
  castledRookFile: File.D,
  tripToRook: (kingPos, board) =>
  kingPos.lefte(_ => board.pieces[_.key])
};

