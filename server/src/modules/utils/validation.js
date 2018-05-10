function validVector(v) {
  return !(isNaN(v.x) || isNaN(v.y) || isNaN(v.z));
}

function sanitise(str) {
  return str.toString().replace(/[^a-zA-Z0-9 .,?'"!@#$%^&*()_\-+=]/gi, '');
}

function validStringLength(str, max) {
  return (str.length > 0 && str.length < max);
}

export { validVector, sanitise, validStringLength };
