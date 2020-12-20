import { key2pos } from './util';

export function svg(name, children = []) {
  let el = document.createElementNS('http://www.w3.org/2000/svg', name);

  if (children.forEach) {
    children.forEach(_ => el.appendChild(_));
  }

  return el;
}

export function renderShape(shape, color, bounds) {
  
  // TODO orient
  let orig = orient(key2pos(shape.orig), color);

  let el;

  if (shape.dest) {
    let dest = orient(key2pos(shape.dest), color);

    el = renderArrow(shape.brush,
                     orig,
                     dest,
                     bounds);
  } else {
    el = renderCircle(shape.brush, orig, bounds);
  }

  return el;
}

function renderArrow(brush, orig, dest, bounds) {

  const m = arrowMargin(bounds),
        a = pos2px(orig, bounds),
        b = pos2px(dest, bounds),
        dx = b[0] - a[0],
        dy = b[1] - a[1],
        angle = Math.atan2(dy, dx),
        xo = Math.cos(angle) * m,
        yo = Math.sin(angle) * m;

  return setAttributes(svg('line'), {
    stroke: brush.color,
    'stroke-width': lineWidth(brush, bounds),
    'stroke-linecap': 'round',
    'marker-end': 'url(#arrowhead-' + brush.key + ')',
    opacity: brush.opacity,
    x1: a[0],
    y1: a[1],
    x2: b[0] - xo,
    y2: b[1] - yo
  });
}

function renderCircle(brush, pos, bounds) {
  
  const o = pos2px(pos, bounds),
        width = circleWidth(bounds),
        radius = (bounds.width + bounds.height) / 32;

  return setAttributes(svg('circle'), {
    stroke: brush.color,
    'stroke-width': width,
    fill: 'none',
    opacity: brush.opacity,
    cx: o[0],
    cy: o[1],
    r: radius - width / 2    
  });  
}

function lineWidth(brush, bounds) {
  return (brush.lineWidth || 10) / 512 * bounds.width;
}

function arrowMargin(bounds) {
  return 10 / 512 * bounds.width;
}

function circleWidth(bounds) {
  return 4 * (bounds.width / 512);
}

function pos2px(pos, bounds) {
  return [(pos[0] + 0.5) * bounds.width / 8,
          (7.5 - pos[1]) * bounds.height / 8];
}

function orient(pos, color) {
  return color === 'white' ? pos : [7 - pos[0], 7 - pos[1]];
}


export function renderMarker(brush) {
  
  const marker = setAttributes(svg('marker'), {
    id: 'arrowhead-' + brush.key,
    orient: 'auto',
    markerWidth: 4,
    markerHeight: 8,
    refX: 2.05,
    refY: 2.01
  });

  marker.appendChild(setAttributes(svg('path'), {
    d: 'M0,0 V4 L3,2 Z',
    fill: brush.color
  }));

  marker.setAttribute('mdKey', brush.key);

  return marker;
}

function setAttributes(el, attrs) {
  for (const key in attrs) el.setAttribute(key, attrs[key]);
  return el;
}
