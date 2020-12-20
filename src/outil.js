export function objCopy(obj) {
  let o2 = {};

  for (let key in obj) {
    o2[key] = obj[key];
  }
  return o2;
}

export function partition(list, f) {
  let a = [], b = [];

  list.forEach(_ => f(_) ? a.push(_) : b.push(_));

  return [a, b];
}

export function objMap(obj, f) {
  let res = {};

  Object.keys(obj).forEach(key => {
    let u = f(key, obj[key]);
    let _ = Object.keys(u)[0];
    res[_] = u[_];
  });

  return res;
}

export function objForeach(obj, f) {
  Object.keys(obj).forEach(key => f(key, obj[key]));
}

export function objFilter(obj, f) {
  let res = {};

  for (let key in obj) {
    if (f(key, obj[key])) {
      res[key] = obj[key];
    }
  }
  return res;
}

export function groupToMap(list, f) {
  let res = {};

  list.forEach(item => {
    let u = f(item);
    let _ = Object.keys(u)[0];
    if (!res[_]) {
      res[_] = [];
    }

    res[_].push(u[_]);
  });
  return res;
}
