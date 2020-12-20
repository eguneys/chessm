function FileKlass(index) {
  this.index = index;
  this.char = String.fromCharCode(97 + index);
};

function RankKlass(index) {
  this.index = index;
  this.char = String.fromCharCode(49 + index);
};

export const File = {
  A: new FileKlass(0),
  B: new FileKlass(1),
  C: new FileKlass(2),
  D: new FileKlass(3),
  E: new FileKlass(4),
  F: new FileKlass(5),
  G: new FileKlass(6),
  H: new FileKlass(7),
  of: pos => new FileKlass(pos.index & 0x7)
};



export const Rank = {
  of: pos => new RankKlass(pos.index >> 3)
};

function PosKlass(index) {

  this.index = index;

  let file = File.of(this);
  let rank = Rank.of(this);

  this.file = file;
  this.rank = rank;
  this.key = file.char + rank.char;

  this.hore = (stop, dir) => {
    let p = dir(this);
    if (!p) {
      return [];
    }

    return [p, ...stop(p) ? [] : p.hore(stop, dir)];
  };
  this.righte = stop => this.hore(stop, _ => _.right());
  this.lefte = stop => this.hore(stop, _ => _.left());

  this.down = () => Pos.at(file.index, rank.index - 1);
  this.left = () => Pos.at(file.index - 1, rank.index);
  this.downLeft = () => Pos.at(file.index - 1, rank.index - 1);
  this.downRight = () => Pos.at(file.index + 1, rank.index - 1);
  this.up = () => Pos.at(file.index, rank.index + 1);
  this.right = () => Pos.at(file.index + 1, rank.index);
  this.upLeft = () => Pos.at(file.index - 1, rank.index + 1);
  this.upRight = () => Pos.at(file.index + 1, rank.index + 1);
};

export const Pos = {
  apply: index => new PosKlass(index),
  atfr: (file, rank) => new PosKlass(file.index + 8 * rank.index),
  at: (x, y) => {
    if (0 <= x && x < 8 && 0 <= y && y < 8) return new PosKlass(x + 8 * y);
    else return null;
  }
};

const allIndexes = [];
for (let i = 0; i < 64; i++) {
  allIndexes.push(i);
}

Pos.all = allIndexes.map(_ => new PosKlass(_)),
Pos.allKeys = {};

Pos.all.forEach(pos => Pos.allKeys[pos.key] = pos);
Pos.fromKey = _ => Pos.allKeys[_];

Pos.A1 = new PosKlass(0);
Pos.B1 = new PosKlass(1);
Pos.C1 = new PosKlass(2);

export const Pawn = {
  forsyth: 'P',
  roleString: 'pawn'
};

export const Knight = {
  forsyth: 'N',
  roleString: 'knight',
  dirs: [
    _ => Pos.at(_.file.index - 1, _.rank.index + 2),
    _ => Pos.at(_.file.index - 1, _.rank.index - 2),
    _ => Pos.at(_.file.index + 1, _.rank.index + 2),
    _ => Pos.at(_.file.index + 1, _.rank.index - 2),
    _ => Pos.at(_.file.index - 2, _.rank.index + 1),
    _ => Pos.at(_.file.index - 2, _.rank.index - 1),
    _ => Pos.at(_.file.index + 2, _.rank.index + 1),
    _ => Pos.at(_.file.index + 2, _.rank.index - 1),
  ]
};

export const Bishop = {
  forsyth: 'B',
  roleString: 'bishop',
  dirs: [_ => _.upLeft(), _ => _.upRight(), _ => _.downLeft(), _ => _.downRight()]
};

export const Rook = {
  color(color) {
    return {
      role: 'rook',
      color
    };
  },
  forsyth: 'R',
  roleString: 'rook',
  dirs: [_ => _.up(), _ => _.down(), _ => _.left(), _ => _.right()]
};

export const Queen = {
  forsyth: 'Q',
  roleString: 'queen',
  dirs: [Rook.dirs, Bishop.dirs].flat()
};

export const King = {
  color(color) {
    return {
      role: 'king',
      color
    };
  },
  forsyth: 'K',
  roleString: 'king',
  dirs: Queen.dirs
};


export const Role = {
  all: [King, Queen, Bishop, Rook, Pawn, Knight]
};

Role.allByRole = {};
Role.all.forEach(role => Role.allByRole[role.roleString] = role);
Role.allByForsyth = {};
Role.all.forEach(role => Role.allByForsyth[role.forsyth] = role);

Role.forsyth = _ => Role.allByForsyth[_];
