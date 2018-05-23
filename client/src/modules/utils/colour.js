function toColourString(n) {
  var r = n >> 16 & 0xff;
  var g = n >> 8 & 0xff;
  var b = n & 0xff;
  r = ((r < 16) ? '0' : '') + r.toString(16);
  g = ((g < 16) ? '0' : '') + g.toString(16);
  b = ((b < 16) ? '0' : '') + b.toString(16);
  return `#${r}${g}${b}`;
}

function toColourHex(r, g, b) {
  // [0, 1]
  r = (Math.round(r * 0xff) & 0xff) << 16;
  g = (Math.round(g * 0xff) & 0xff) << 8;
  b = (Math.round(b * 0xff) & 0xff);

  return r + g + b;
}

function getRandomColour() {
  const S = Math.random();
  const L = Math.random();
  const H = Math.random();
  var r, b, g;

  if (S == 0){
    r = g = b = L;
  } else {
    const Q = (L < 0.5) ? L * (1 + S) : L + S - L * S;
    const P = 2 * L - Q;
    r = hueToRGB(P, Q, H + 1/3);
    g = hueToRGB(P, Q, H);
    b = hueToRGB(P, Q, H - 1/3);
  }

  return toColourHex(r, g, b);
}

function hueToRGB(p, q, t) {
  // convert hue to RGB
  t += (t < 0) ? 1 : (t > 1) ? -1 : 0;
  if (t < 1/6) {
    return p + (q - p) * 6 * t;
  } else if (t < 0.5) {
    return q;
  } else if (t < 2/3) {
    return p + (q - p) * (2/3 - t) * 6;
  } else {
    return p;
  }
};

export { toColourString, getRandomColour };
