import { brush } from './brush';
import * as util from './util';
import * as dom from './dom';
import * as SVG from './svg';

let { ranks,
      files,
      key2pos,
      fPosToTranslateAbs } = util;

let { svg, renderMarker, renderShape } = SVG;

let { div, tag, fAttribute, fTranslateAbs, fListen, updateChildren } = dom;

export function renderLine(line, fHover, fOut) {
  let onHover = ply => {
    return _ => {
      ['touchstart', 'mouseover'].forEach(event =>
        fListen(event, el => fHover(ply, el))(_)
      );
      ['touchend', 'mouseout'].forEach(event =>
        fListen(event, fOut)(_));
    };
  };

  return line.flatMap(([mwhite, mblack]) => {
    let onHoverWhite = mwhite && onHover(mwhite.ply),
        onHoverBlack = mblack && onHover(mblack.ply);

    let fAttributeWhite = mwhite && fAttribute({ title: mwhite.err, 'data-err': mwhite.err });
    let fAttributeBlack = mblack && fAttribute({ title: mblack.err, 'data-err': mblack.err });

    return mwhite && mblack ?
      [
        tag('strong.moven', mwhite.plyStrWhite),
        tag('span.movem', mwhite.san + ' ', [fAttributeWhite,
                                             onHoverWhite]),
        tag('span.movem', mblack.san + ' ', [fAttributeBlack,
                                             onHoverBlack]),
      ]
      : mwhite ? [
        tag('strong.moven', mwhite.plyStrWhite),
        tag('span.movem', mwhite.san + ' ', [fAttributeWhite,
                                             onHoverWhite])
      ] : [
        tag('strong.moven', mblack.plyStrBlack),
        tag('span.movem', mblack.san + ' ', [fAttributeBlack,
                                             onHoverBlack]),
      ];
  });

}

export function renderFen(color, pieces, shapes, bounds, lastMove) {

  let asWhite = util.asWhite(color);
  let fPosToTranslate = fPosToTranslateAbs(bounds);

  let board = tag('md-board', [
    ...lastMove.map(key => {
      let pos = key2pos(key);
      let move = tag(`square.last-move`, [],
                     fTranslateAbs(fPosToTranslate(pos, asWhite)));
      move.mdKey = key;
      return move;
    }),
    ...Object.keys(pieces).map(key => {
      let pos = key2pos(key);
      let _ = pieces[key];
      let piece = tag(`piece.${_.color}.${_.role}`, [],
                      fTranslateAbs(fPosToTranslate(pos, asWhite)));

      piece.mdKey = key;
      
      return piece;
    })
  ]);

  let _svg = svg('svg', [
    svg('defs', [
      renderMarker(brush)
    ]),
    ...shapes.map(_ => renderShape(_, color, bounds))
  ]);

  let wrapper = tag('md-wrap', [
    board,
    _svg,
    tag('coords.ranks.' + color, ranks.map(_ =>
      tag('coord', _)
    )),
    tag('coords.files.' + color, files.map(_ =>
      tag('coord', _)
    )),
  ]);

  return {
    wrapper,
    board,
    svg: _svg
  };
}

export function updateSvg(els, shapes, color) {

  let { board, svg } = els;
  let bounds = board.getBoundingClientRect();

  let el = svg.firstChild;
  let toRemove = [];

  el = el.nextSibling;
  while (el) {
    toRemove.push(el);
    el = el.nextSibling;
  };

  for (const el of toRemove) svg.removeChild(el);

  
  shapes.forEach(_ => {
    svg.appendChild(renderShape(_, color, bounds));
  });
}

export function updateBounds(asWhite, elBoard) {
  let bounds = elBoard.getBoundingClientRect();
  let fPosToTranslate = fPosToTranslateAbs(bounds);
  updateChildren(elBoard, _ => {
    fTranslateAbs(fPosToTranslate(key2pos(_.mdKey), asWhite))(_);
  });

}
