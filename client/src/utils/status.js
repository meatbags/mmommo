/*
 * Status
 * -- status based on number of cells filled
 */

const status = [
  "Nobody", "Somebody", "Finger Painter", "Doodler", "Scribbler", "Egg Painter", "Artist", "L'Artiste", "Art", "Baller",
  "Pixel Pusher", "Bit Wrangler", "Recluse", "Pica$$o", "Server Crasher", "Pretty Fly", "Inseminator", "Pencil Jesus", "Pencil Satan",
  "Pencil Buddha",  "The One Ring", "Pulitzer Prize", "Nobel Prize", "GOAT", "Palme d'Or", "Ballon d'Or", "666", "Go Outside",
  "1337"
];

function getStatus(n) {
  var stat = '';

  for (var i=0, len=status.length; i<len; ++i) {
    const j = i + 1;
    const lower = (i < 10) ? i * 10 : (i < 19) ? (i - 9) * 100 : (i - 18) * 1000;
    const upper = (j < 10) ? j * 10 : (j < 19) ? (j - 9) * 100 : (j - 18) * 1000;

    if (n >= lower && n <= upper || i == status.length - 1) {
      stat = status[i];
      break;
    }
  }

  return stat;
}

export { getStatus };
