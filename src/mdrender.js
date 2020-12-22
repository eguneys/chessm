import { valid, invalid } from './valid';
import * as util from './util';
import * as dom from './dom';
import * as md from './md';
import { renderLineModel } from './rendermodel';
import { renderLine, renderFen, updateBounds, updateSvg } from './render';
import { fTranslateAbs, fAddClass, fHide, fShow, div } from './dom';

function isInViewport(bounds) {
  return bounds.top >= 0 &&
    bounds.left >= 0 &&
    bounds.bottom <= window.innerHeight &&
    bounds.right <= window.innerWidth;
}

function listenEndScroll(onEndScroll) {
  let isScrolling;
  document.addEventListener('scroll', function(event) {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(onEndScroll, 60);
  }, false);
}

function listenResize(element, fResize) {
  const observer = new window.ResizeObserver(fResize);
  observer.observe(element);
  return () => {
    observer.unobserve(element);
  };
}


function CodeRender(play, content) {

  let { variation, line, board } = content;

  let fHover = (ply, el) => {
    play.show(variation, ply, el);
  };

  let fOut = () => {
    play.hide();
  };

  const plyMove = ply => {
    return play.vMove(variation, ply);
  };


  this.wrap = () => {

    let children = [];

    let depth = play.lineDepth(variation);

    let fStyle = fAddClass(`depth${depth}`);

    if (!board) {

      let lineModel = line.map(([mw, mb]) =>
        [mw && renderLineModel(mw, plyMove),
         mb && renderLineModel(mb, plyMove)]
      );    

      children = renderLine(lineModel, fHover, fOut);
    }

    let $el = dom.tag('span.line', children);


    fStyle($el);

    return $el;
  };

  this.render = () => {
    
  };
}

function TextRender(play, content) {
  this.wrap = () => {
    return dom.textNode(content);
  };

  this.render = () => {
  };
}

function ParagraphRender(play, content) {

  let children = [];

  content.forEach(_ => {
    let $_;
    switch (_.type) {
    case md.Code:
      $_ = new CodeRender(play, _.content);
      break;
    case md.Text:
      $_ = new TextRender(play, _.content);
      break;
    }
    children.push($_);
  });

  this.wrap = () => {
    return dom.tag('p', 
                   children
                   .map(_ => _.wrap()));
  };

  this.render = () => {};
}

function HeadingRender(play, content) {
  this.wrap = () => {
    return dom.tag('h2', content);
  };  

  this.render = () => {
  };
}

export function PlyRender(play, $el) {

  let bounds;
  let color = 'white';
  let pieces = {};
  let shapes = util.readShapes();
  let lastMove;
  let error;
  let unlisten;

  this.bounds = () => bounds;

  this.init = (variation, ply) => {

    lastMove = [];

    if (ply === 0) {
      let situation = play.plyZero(variation);

      pieces = situation.board.pieces;
    } else {
      play.vMove(variation, ply).fold(_ => {
        let situation = _.situationAfter();
        pieces = situation.board.pieces;
        lastMove.push(_.orig.key);
        lastMove.push(_.dest.key);
      }, _ => {
        error = _;
      });
    }
  };

  this.syncVisible = () => {
    if (!$el) {
      return;
    }
    bounds = $el.getBoundingClientRect();
    this.isInViewport = isInViewport(bounds);
  };

  let els;

  this.wrap = () => {
    $el = $el || dom.tag('div.ply');
    return $el;
  };

  this.render = () => {

    if (!unlisten) {
    } else {
      unlisten();
      $el.removeChild(els.wrapper);
    }

    bounds = $el.getBoundingClientRect();

    els = renderFen(color, pieces, shapes, bounds, lastMove);

    $el.appendChild(els.wrapper);

    unlisten = listenResize($el, () => {
      updateBounds(util.asWhite(color), els.board);
    });

  };
}

export function MdRender(play, as) {

  let children = [];

  as.forEach(({type, content}) => {
    let $_;
    
    switch(type) {
    case md.Paragraph:
      $_ = new ParagraphRender(play, content);
      break;
    case md.Heading:
      $_ = new HeadingRender(play, content);
      break;
    case md.Ply:
      $_ = new PlyRender(play);

      let [variation, ply] = content.split(' ');
      ply = parseInt(ply);

      $_.init(variation, ply);

      break;
    }
    children.push($_);
  });

  this.visiblePly = () => {
    return children
      .filter(_ => 
        _ instanceof PlyRender &&
          _.isInViewport)[0];
  };

  this.findVisiblePly = () => {
    children.filter(_ =>
      _ instanceof PlyRender)
      .forEach(_ => _.syncVisible());
  };

  this.listen = () => {
    listenEndScroll(this.findVisiblePly);
    this.findVisiblePly();
  };


  this.wrap = () => {
    return dom.tag('div', 
                   children
                   .map(_ => _.wrap()));
  };

  this.render = () => {
    children.forEach(_ => _.render());
  };
}
