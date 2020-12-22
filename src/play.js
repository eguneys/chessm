import { valid, invalid } from './valid';
import { objMap, objForeach } from './outil';
import * as md from './md';
import { isFen } from './util';
import Board from './board';
import Situation from './situation';
import { parseLine } from './parser';
import { MdRender, PlyRender }  from './mdrender';
import * as dom from './dom';

function Game(games) {

  let initialBoard,
      line,
      base;

  this.init = (_initialBoard, _line, _base) => {
    initialBoard = _initialBoard;
    line = _line;
    base = _base;

    this.initialPlyAsSituation = initialBoard ? Situation.apply(initialBoard) : null;
    this.line = line;
    this.base = base;

    this.basePly = line[0] ? line[0].ply - 1 : 0;

    this.moves = [];

    this.plies = [];

    this.elies = [];

    this.playedOut = false;
  };

  this.ply = (ply) => this.plies[ply];
  this.move = (ply) => this.moves[ply];
  this.ely = (ply) => this.elies[ply];

  // assumes base games has been played
  this.play = () => {

    if (this.playedOut) {
      return;
    }

    if (this.initialPlyAsSituation) {
      this.plies[this.basePly] = this.initialPlyAsSituation;
    }

    if (line.length > 0) {
      if (!this.initialPlyAsSituation) {
        this.initialPlyAsSituation = games.ply(this.base, this.basePly);
        this.plies[this.basePly] = this.initialPlyAsSituation;
      }

      line.forEach(({ ply, move }) => {
        let beforePly = this.ply(ply - 1);
        if (beforePly) {
          move.move(beforePly).fold(_ => {
            this.plies[ply] = _.situationAfter();
            this.moves[ply] = _;
          }, _ => {
            this.elies[ply] = _;
          });
        } else {
          this.elies[ply] = "No Situation found";
        }
      });
    }

    this.playedOut = true;
  };

}

function GameBuilder() {
  let initialBoard,
      base;
  let line = [];

  this.define = (_initialBoard, _base) => {
    initialBoard = _initialBoard;
    base = _base;
  };

  this.addLine = (_line) => {
    line.push(_line);
  };

  this.build = (games) => {
    line = line.flatMap(_ => 
      _.flat()
        .flatMap(_ => _ ? _.copyMap(_ => [_])
                 .getOrElse(_ => []): 
                 [])
    ).sort((a, b) => a - b);

    let game = new Game(games);

    game.init(initialBoard, line, base);

    return game;
  };
}

function Games(play) {

  let codes;
  let games = {};

  this.playUptoBase = (game) => {
    if (game.base) {
      this.playUptoBase(games[game.base]);
    }

    game.play();
  };

  this.lineDepth = (game, depth = 0) => {
    if (games[game].base) {
      return 1 + this.lineDepth(games[game].base);
    } else {
      return depth;
    }
  };

  this.ply = (game, ply) => games[game].ply(ply);
  this.move = (game, ply) => games[game].move(ply);
  this.err = (game, ply) => games[game].ely(ply);

  this.init = as => {
    codes = extractCodes(as);

    codes.forEach(_ => {
      let {variation, base, line, board } = _;

      if (board) {
        let b = new GameBuilder();

        b.define(board);

        games[variation] = b;
        return;
      }

      if (games[variation]) {
        let b = games[variation];

        b.addLine(line);
        return;
      }

      let b = new GameBuilder();
      games[variation] = b;

      b.define(null, base);
      b.addLine(line);

    });

    games = objMap(games, (_, b) => 
      ({ [_]: b.build(this) }));

    objForeach(games, (_, g) =>
      this.playUptoBase(g)
    );
  };
  
}

export default function Play(_md) {

  let $_;

  let games = new Games(this);
  this.games = games;

  let as = md.parseMdFull(_md);
  readLines(as);

  games.init(as);

  this.lineDepth = games.lineDepth;

  this.vMove = (variation, ply) => {
    let err = games.err(variation, ply),
        move = games.move(variation, ply);

    if (err) {
      return invalid(err);
    } else {
      return valid(move);
    }
  };

  this.plyZero = (variation) => {
    return games.ply(variation, 0);
  };

  let mdrender = new MdRender(this, as);

  mdrender.listen();

  let visiblePly = this.visiblePly = mdrender.visiblePly;

  let $hoverEl = dom.div('.hover-ply', [], dom.fHide);
  let hoverPly = new PlyRender(this, $hoverEl);

  this.hide = () => {
    dom.fHide($hoverEl);
  };

  this.show = (variation, ply, $el) => {

    let vp = visiblePly();
    let posToTranslate = [window.pageXOffset, window.pageYOffset];

    if (vp) {
      posToTranslate[0] += vp.bounds().left;
      posToTranslate[1] += vp.bounds().top;      
    } else {
      let { clientWidth } = $_;

      let offBounds = $el.getBoundingClientRect();
      let helBounds = $hoverEl.getBoundingClientRect();

      if (offBounds.left < clientWidth / 2) {
        posToTranslate[0] += clientWidth - helBounds.width - 4;
      }
    }

    dom.fTranslateAbs(posToTranslate)($hoverEl);


    hoverPly.init(variation, ply);
    hoverPly.render();
    dom.fShow($hoverEl);
  };


  this.wrap = () => {
    $_ = mdrender.wrap();

    $_.appendChild($hoverEl);
    
    return $_;
  };

  this.render = () => {
    mdrender.render();
  };

}

function extractCodes(as) {
  return as.filter(_ => _.type === md.Paragraph)
    .flatMap(_ => _.content)
    .filter(_ => _.type === md.Code)
    .map(_ => _.content);
}

function readLines(as) {

  as.forEach(_ => {
    switch(_.type) {
    case md.Paragraph:
      _.content.forEach(_ => {
        switch (_.type) {
        case md.Code:

          if (isFen(_.content.line)) {
            _.content.board = Board.fromFen(_.content.line);
          } else {
            _.content.line = parseLine(_.content.line);
          }
          break;
        case md.Text:
          break;
        }
        return _;
      });
      break;
    case md.Heading:
      break;
    case md.Ply:
      break;
    }
    return _;
  });
  
}
