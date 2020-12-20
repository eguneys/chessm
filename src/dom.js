export function tag(nameklass, children = [], fStyle) {

  let [name, ...klass] = nameklass.split('.');

  let el = document.createElement(name);

  klass.forEach(_ => {
    el.classList.add(_);
  });

  if (children.forEach) {
    children.forEach(_ => {
      el.appendChild(_);
    });
  } else {
    el.append(children);
  }

  if (fStyle) {
    if (fStyle.forEach) {
      fStyle.forEach(_ => _(el));
    } else {
      fStyle(el);
    }
  }

  return el;
}

export const div = (klass, children, fStyle) => tag('div' + klass, children, fStyle);

export const textNode = (content) => {
  return document.createTextNode(content);
};

export const updateChildren = (el, fupdate) => {
  el = el.firstChild;

  while (el) {
    fupdate(el);
    el = el.nextSibling;
  }
};

export const fTranslateAbs = (pos) => {
  return el => {
    el.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
  };
};

export const fAddClass = (klass) => {
  return el => {
    klass.split('.').forEach(_ => {
      el.classList.add(_);
    });
  };
};

export const fAttribute = attributes => {
  return el => {
    Object.keys(attributes).forEach(_ => {
      if (attributes[_]) {
        el.setAttribute(_, attributes[_]);
      }
    });
    return el;
  };
};

export const fListen = (event, f) => {
  return el => {
    el.addEventListener(event, () => {
      f(el);
    });
  };
};

export const fHide = el => {
  if (!el.classList.contains('hidden')) {
    el.classList.add('hidden');
  }
};

export const fShow = el => {
  if (el.classList.contains('hidden')) {
    el.classList.remove('hidden');
  }
};
