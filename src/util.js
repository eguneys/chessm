import { Role }  from './pos';
import { brush } from './brush';

export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const allKeys = Array.prototype.concat(...files.map(c => ranks.map(r => c + r)));

export const pos2key = pos => allKeys[8 * pos[0] + pos[1]];

export const key2pos = k => [k.charCodeAt(0) - 97, k.charCodeAt(1) - 49];

export const black = 'black',
      white = 'white';

export function asWhite(color) {
  return color === white;
}

export function flip(color) {
  return color === white ? black : white;
}

let colors = {
  'w': white,
  'b': black
};

let roles = {
  'k': 'king',
  'q': 'queen',
  'r': 'rook',
  'b': 'bishop',
  'n': 'knight',
  'p': 'pawn'
};

export function readShapes(shapes) {
  if (!shapes) {
    return [];
  }
  let sShapes = shapes.split(' ');
  return sShapes.map(_ => {
    let [s1,s2] = _.split('-');

    return {
      orig: (_ => _)(s1),
      dest: (_ => _)(s2),
      brush
    };
  });
}

export function isFen(fen) {
  return fen.includes('/');
}

export function readFen(fen) {
  let [sPieces, sTurn, sCastles, sExtra] = fen.split(' ');

  let color = colors[sTurn];

  let pieces = {};

  sPieces.split('/').forEach((sRow, row) => {
    row = 7 - row;

    let col = 0;
    for (let char of sRow) {
      let role,
          color;
      if ((role = roles[char])) {
        color = black;
      } else if ((role = roles[char.toLowerCase()])) {
        color = white;
      }
      if (color) {
        pieces[pos2key([col, row])] = {
          role,
          color
        };
        col++;
      } else {
        col += parseInt(char);
      }
    }
  });

  return {
    pieces,
    color,
  };
}

export function readMoves(moves) {

  const blackMoveRegex = /^(\d*)\.\.\.$/;
  const whiteMoveRegex = /^(\d*)\.$/;

  let oneMove,
      ply,
      _moves = [];

  moves.split(' ').forEach(next => {

    let match;

    if ((match = next.match(blackMoveRegex))) {
      ply = parseInt(match[0]) * 2;
      oneMove = [null];
    } else if ((match = next.match(whiteMoveRegex))) {
      ply = parseInt(match[0]) * 2 - 1;
      oneMove = [];
    } else if ((match = moveMatch(next))) {
      oneMove.push({
        ply,
        ...match
      });
      ply++;

      if (oneMove.length === 2) {
        _moves.push(oneMove);
        oneMove = [];
      }
    }
  });

  if (oneMove.length === 1) {
    _moves.push(oneMove);
  }
  
  return {
    moves: _moves
  };
}

export function readPly(sPly) {
  return parseInt(sPly);
}

export function writeFen({ pieces }) {

  let sPieces = '';

  for (let row = 7; row >= 0; row--) {
    let spaces = 0;
    for (let col = 0; col <= 7; col++) {
      let key = pos2key([col, row]);
      let piece;
      if ((piece = pieces[key])) {
        if (spaces > 0) {
          sPieces += spaces;
          spaces = 0;
        }
        let role = Role.allByRole[piece.role];
        sPieces += piece.color === white ? role.forsyth.toUpperCase() : role.forsyth.toLowerCase();
      } else {
        spaces++;
      }
    }
    if (spaces > 0) {
      sPieces += spaces;
    }
    sPieces += '/';
  }

  return sPieces;
}

const posToTranslateBase = (pos, asWhite, xFactor, yFactor) => [
  (asWhite ? pos[0] : 7 - pos[0]) * xFactor,
  (asWhite ? 7 - pos[1] : pos[1]) * yFactor
];

export const fPosToTranslateAbs = bounds => {
  const xFactor = bounds.width / 8,
        yFactor = bounds.height / 8;

  return (pos, asWhite) =>
  posToTranslateBase(pos, asWhite, xFactor, yFactor);
};
