import { formWindow } from '../../dom';

class NamePicker {
  constructor(client) {
    // create name form and hook to client
    this.client = client;
    this.form = formWindow("Choose a display name", e => { this.onForm(e); });
    this.input = this.form.querySelector('input');
    this.input.onblur = () => { this.client.enableInput(); };
    this.input.onfocus = () => { this.client.disableInput(); };
    document.body.appendChild(this.form);
  }

  error(msg) {
    this.form.querySelector('.form-window__notice').innerHTML = msg;
  }

  onForm(e) {
    e.preventDefault();

    if (this.input.value.length) {
      if (this.client.packet.sendSetName(this.input.value)) {
        this.client.state.name = this.input.value;
        document.body.removeChild(this.form);
      } else {
        this.error('<br />Awaiting connection.');
      }
    } else {
      this.error('<br />Input is empty.');
    }
  }
}

export { NamePicker };