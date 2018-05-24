function toColourString(n) {
  // convert hex to browser-friendly hex string
  var r = n >> 16 & 0xff;
  var g = n >> 8 & 0xff;
  var b = n & 0xff;
  r = ((r < 16) ? '0' : '') + r.toString(16);
  g = ((g < 16) ? '0' : '') + g.toString(16);
  b = ((b < 16) ? '0' : '') + b.toString(16);
  return `#${r}${g}${b}`;
}

function toColourHex(r, g, b) {
  // rgb = [0, 1]
  r = (Math.round(r * 0xff) & 0xff) << 16;
  g = (Math.round(g * 0xff) & 0xff) << 8;
  b = (Math.round(b * 0xff) & 0xff);

  return r + g + b;
}

const THIRD = 1/3;
const SIXTH = 1/6;
const TWO_THIRDS = 2/3;

function hueToRGB(p, q, t) {
  // helper func for getRandomColour
  t += (t < 0) ? 1 : (t > 1) ? -1 : 0;
  if (t < SIXTH) {
    return p + (q - p) * 6 * t;
  } else if (t < 0.5) {
    return q;
  } else if (t < TWO_THIRDS) {
    return p + (q - p) * (TWO_THIRDS - t) * 6;
  } else {
    return p;
  }
};

function getRandomColour() {
  // get random colour hex
  var r, b, g;
  const S = Math.random();
  const L = Math.random();
  const H = Math.random();

  if (S !== 0){
    const Q = (L < 0.5) ? L * (1 + S) : L + S - L * S;
    const P = 2 * L - Q;
    r = hueToRGB(P, Q, H + THIRD);
    g = hueToRGB(P, Q, H);
    b = hueToRGB(P, Q, H - THIRD);
  } else {
    r = g = b = L;
  }
  
  return toColourHex(r, g, b);
}

export { toColourString, getRandomColour, toColourHex };
