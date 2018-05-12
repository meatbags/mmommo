import { nameWindow } from '../../dom';

class NamePicker {
  constructor(client) {
    // create name form and hook to client
    this.client = client;
    this.form = nameWindow("Choose a display name & colour", e => { this.onForm(e); });
    this.input = this.form.querySelector('input');
    document.body.appendChild(this.form);
  }

  closeWindow() {
    if (document.body.contains(this.form)) {
      document.body.removeChild(this.form);
    }
  }

  error(msg) {
    this.form.querySelector('.form-window__notice').innerHTML = msg;
  }

  force(name) {
    this.client.setName(name);
    this.client.packet.sendSetName(name);
    this.closeWindow();
  }

  onForm(e) {
    e.preventDefault();

    if (this.input.value.length) {
      this.client.packet.sendSetName(this.input.value)
      this.client.setName(this.input.value);
      this.closeWindow();
    } else {
      this.error('<br />Input is empty.');
    }
  }
}

export { NamePicker };
