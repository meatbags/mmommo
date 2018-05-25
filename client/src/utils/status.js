/*
 * Status
 * -- "status" based on number of cells filled
 */

const status = [
  "Nobody", "Somebody", "Finger Painter", "Doodler", "Scribbler", "Egg Painter", "Bit Wrangler", "Pixel Pusher", "Connoisseur", "Baller",
  "L'Artiste", "Patron of The Pixels", "Recluse", "Pica$$o", "Server Crasher", "Pretty Fly", "Inseminator", "Pencil Jesus", "Pencil Satan",
  "Pencil Buddha",  "The One Ring", "Pulitzer Prize In Pixels", "Nobel Prize In Pixels", "GOAT", "Palme d'Or", "Ballon d'Or", "No Life", "Go Outside",
  "1337 H4X0R"
];

function getStatus(n) {
  var stat = '';

  for (var i=0, len=status.length; i<len; ++i) {
    const j = i + 1;
    const lower = (i < 10) ? i * 10 : ((i < 19) ? (i - 9) * 100 : (i - 18) * 1000);
    const upper = (j < 10) ? j * 10 : ((j < 19) ? (j - 9) * 100 : (j - 18) * 1000);

    if (n >= lower && n < upper || i == status.length - 1) {
      stat = status[i];
      break;
    }
  }

  return stat;
}

export { getStatus };
