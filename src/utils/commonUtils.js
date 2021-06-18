export const formatNumber = (n, roundedDigits, fixed = false) => {
  const roundedResult = Math.round(n * 10 ** roundedDigits) / 10 ** roundedDigits;
  if (fixed) {
    return roundedResult.toFixed(roundedDigits);
  }
  return roundedResult.toString();
};

export const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key];
    (rv[v] = rv[v] || []).push(x);
    return rv;
  }, {});
};

export const isEmpty = (obj) => Object.keys(obj).length === 0;

// Check if an object is empty or only contains keys with value 'DEFAULT'
export const isEmptyDefault = (obj) => {
  let keys = Object.keys(obj);
  if (keys.length === 0) {
    return true;
  }

  for (let key of keys) {
    if (obj[key] && obj[key] !== 'DEFAULT') {
      return false;
    }
  }
  return true;
};
