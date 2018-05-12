import { Config } from '../../../../shared';

function validVector(v) {
  return !(isNaN(v.x) || isNaN(v.y) || isNaN(v.z));
}

function sanitise(str) {
  return str.toString().replace(/[^a-zA-Z0-9 .,?'"!@#$%^&*()_\-+=:;]/gi, '');
}

function validStringLength(str) {
  return (str.length > 0 && str.length < Config.maxMessageSize);
}

function validRequest(req, max) {
  return (req.type === 'utf8' && req.utf8Data && req.utf8Data.length <= Config.maxDataSize);
}

export { validVector, sanitise, validStringLength, validRequest };
