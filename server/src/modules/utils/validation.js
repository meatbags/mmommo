import { Config } from '../../../../shared';

function colour(colour) {
  return (int(colour) && colour >= 0 && colour <= 0xffffff);
}

function int(n) {
  return (typeof(n) === 'number' && n % 1 == 0);
}

function request(req, max) {
  return (req.type === 'utf8' && req.utf8Data && req.utf8Data.length <= Config.global.maxDataSize);
}

function sanitise(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[^a-z0-9 .,?'"!@#$%^&*()_\-\/\\+=:;]/gi, '');
}

function stringLength(str) {
  return (str.length > 0 && str.length < Config.global.maxMessageSize);
}

function vector(v) {
  return (typeof(v.x) === 'number' && typeof(v.y) === 'number' && typeof(v.z) === 'number');
}

export { colour, int, request, sanitise, stringLength, vector };
