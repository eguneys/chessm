export function toValid(value, _invalid) {
  return value ? valid(value) :
    invalid(_invalid);
};

export function valid(value) {
  return new Validation(null, value);
};

export function invalid(invalid) {
  return new Validation(invalid);
};

export function group(fOs, _) {
  let res = valid({});

  fOs.forEach(fO => {
    let res2;
    if ((res2 = fO(_))) {
      res = res.flatMap(acc => 
        res2.map(b => {
          for (let key in b) {
            acc[key] = b[key];
          }
          return acc;
        })
      );
    }
  });

  return res;
};

export function fOptional(property, fCheck) {
  return _ => {
    if (_[property]) {
      return fCheck(_[property])
        .map(_ => ({ [property]: _ }));
    } else return null;
  };
};

function Validation(invalid, valid) {
  this.invalid = invalid;
  this.valid = valid;

  const makeInvalid = (_invalid) => {
    valid = null;
    invalid = _invalid;

    this.invalid = invalid;
    this.valid = valid;
  };

  const makeValid = (_valid) => {
    valid = _valid;
    invalid = null;

    this.valid = valid;
    this.invalid = invalid;
  };

  this.flatMap = (fvalid, finvalid = _ => validation.invalid(_)) => {
    return this.valid ? fvalid(this.valid) : 
      finvalid(this.invalid);
  };

  this.fold = (fvalid, finvalid = _ => _) => {
    return this.valid ? fvalid(this.valid) : 
      finvalid(this.invalid);
  };

  this.rawMap = (fvalid) => {
    if (this.valid) {
      makeValid(fvalid(valid));
    }
    return this;
  };

  this.map = (fvalid) => {
    return this.copy().rawMap(fvalid);
  };

  this.check = (ftest, _invalid) => {
    if (this.valid && ftest(this.valid)) {
      makeInvalid(_invalid);
    }
    return this;
  };

  this.checkOr = (ftest1, ftest2, _invalid) => {
    if (this.valid && !(ftest1(this.valid)
                        || ftest2(this.valid))) {
      makeInvalid(_invalid);
    }
    return this;
  };

  this.getOrElse = (_) => {
    return this.valid ? this.valid : _();
  };

  this.copy = () => {
    return new Validation(invalid, valid);
  };

  this.copyMap = (fvalid) => {
    return this.copy().map(fvalid);
  };
}
