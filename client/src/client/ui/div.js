/*
 * Div
 * -- create a DOM div with props
 */

function div(props) {
  const d = document.createElement('div');

  for (var prop in props) {
    if (props.hasOwnProperty(prop)) {
      d[prop] = props[prop];
    }
  }

  return d;
}

export { div };
