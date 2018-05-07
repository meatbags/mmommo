function div(target, props) {
  const d = document.createElement('div');

  for (var prop in props) {
    if (props.hasOwnProperty(prop)) {
      d[prop] = props[prop];
    }
  }

  target.appendChild(d);
}

export { div };
