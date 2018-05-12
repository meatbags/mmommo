import { Config } from '../../../../shared';

function validVector(v) {
  return !(isNaN(v.x) || isNaN(v.y) || isNaN(v.z));
}

function sanitise(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[^a-z0-9 .,?'"!@#$%^&*()_\-\/\\+=:;]/gi, '');
}

function validStringLength(str) {
  return (str.length > 0 && str.length < Config.global.maxMessageSize);
}

function validRequest(req, max) {
  return (req.type === 'utf8' && req.utf8Data && req.utf8Data.length <= Config.global.maxDataSize);
}

export { validVector, sanitise, validStringLength, validRequest };
