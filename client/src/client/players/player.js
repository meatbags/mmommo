/*
 * Player
 * -- handle mouse & keyboard input
 * -- move player & interact with grid
 */

import { Config } from './config';
import { Config as GlobalConfig } from '../../../../shared';
import { clamp } from '../../utils/maths';

class Player {
  constructor() {
    // player input
    this.size = GlobalConfig.global.grid.size;
    this.step = GlobalConfig.global.grid.step;
    this.bound = this.size * this.step;
    this.halfBound = this.bound / 2;

    // spawn position
    const range = GlobalConfig.global.grid.playerSpawnRange;
    this.position = new THREE.Vector3();
    this.position.x = Math.floor(Math.random() * range - range / 2) * this.step - this.step / 2;
    this.position.z = Math.floor(Math.random() * range - range / 2) * this.step - this.step / 2;

    // game props
    this.motion = new THREE.Vector3();
    this.previous = {};
    this.name = '';
    this.disabled = false;
    this.accel = 0;
    this.colour = 0x00ff00;
    this.acceleration = Config.acceleration;
    this.speed = Config.speed;
    this.cell = {x: 0, y: 0};
    this.diagonalReduction = 1 / (Math.sqrt(2));
    this.autoMove = false;
    this.waypoints = [];
    this.status = '';

    // handle mkb input
    this.keys = {};
    document.onkeydown = (e) => {
      if (document.body == document.activeElement) {
        this.keys[e.code] = true;
        this.autoMove = false;
      }
    };
    document.onkeyup = (e) => {
      this.keys[e.code] = false;
      this.autoMove = false;
    };
  }

  init(canvas, camera) {
    // hook mouse to canvas
    this.canvas = canvas;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
    this.cursor = {
      screen: new THREE.Vector2(),
      position: new THREE.Vector3(),
      cell: new THREE.Vector3()
    };

    // mouse events
    this.registerWaypoint = (x, z) => {
      const last = this.waypoints.length - 1;
      x += this.step / 2;
      z += this.step / 2;

      if (!(x == this.position.x && z == this.position.z) && (last == -1 || !(this.waypoints[last].x == x && this.waypoints[last].z == z))) {
        this.waypoints.push(new THREE.Vector3(x, 0, z));

        // limit to 10 waypoints
        //if (last > 8) {
        //  this.waypoints.splice(0, 1);
        //}
      }
    };
    this.canvas.onmousemove = (e) => {
      this.cursor.screen.x = e.clientX / this.canvas.width * 2 - 1;
      this.cursor.screen.y = -(e.clientY / this.canvas.height * 2 - 1);
      this.raycaster.setFromCamera(this.cursor.screen, this.camera);
      this.raycaster.ray.intersectPlane(this.plane, this.cursor.position);
      this.cursor.cell.x = Math.floor(this.cursor.position.x / this.step) * this.step;
      this.cursor.cell.z = Math.floor(this.cursor.position.z / this.step) * this.step;

      // case click & drag
      if (e.which) {
        this.autoMove = true;
        this.registerWaypoint(this.cursor.cell.x, this.cursor.cell.z);
      }
    };
    this.canvas.onmousedown = () => {
      this.autoMove = true;
      this.waypoints = [];
      this.registerWaypoint(this.cursor.cell.x, this.cursor.cell.z);
    };
  }

  getGridCell() {
    // get current containing cell
    this.cell.x = Math.floor((this.position.x / this.step) + this.size / 2);
    this.cell.y = Math.floor((this.position.z / this.step) + this.size / 2);
    return {x: this.cell.x, y: this.cell.y};
  }

  inNewGridCell() {
    // check if moved to new cell
    if (this.previous.cell) {
      const cell = this.getGridCell();
      if (!(cell.x == this.previous.cell.x && cell.y == this.previous.cell.y)) {
        this.previous.cell = cell;
        return true;
      } else {
        return false;
      }
    } else {
      this.previous.cell = this.getGridCell();
      return true;
    }
  }

  changed() {
    // check if moved
    if (this.previous.position) {
      if (!this.motion.equals(this.previous.motion) || (this.motion.x == 0 && this.motion.y == 0 && this.motion.z == 0 && !this.position.equals(this.previous.position))) {
        this.previous.motion.copy(this.motion);
        this.previous.position.copy(this.position);
        return true;
      } else {
        return false;
      }
    } else {
      this.previous.position = new THREE.Vector3();
      this.previous.motion = new THREE.Vector3();
      return true;
    }
  }

  move(delta) {
    if (this.autoMove && this.waypoints.length) {
      // move on click
      const wp = this.waypoints[0];
      const d = new THREE.Vector3(wp.x - this.position.x, 0, wp.z - this.position.z);
      const dist = d.length();
      const vec = d.clone();
      vec.normalize();
      vec.multiplyScalar(this.speed);

      // move to next auto waypoint
      if (dist < vec.length() * delta) {
        this.waypoints.splice(0, 1);

        if (this.waypoints.length == 0) {
          this.autoMove = false;
          this.position.x = wp.x;
          this.position.z = wp.z;
          this.motion.x = 0;
          this.motion.z = 0;
        } else {
          this.motion = vec;
        }
      } else {
        this.motion = vec;
      }
    } else {
      // move on keyboard
      this.motion.x = -(this.keys['KeyA'] || this.keys['ArrowLeft'] ? this.speed : 0) + (this.keys['KeyD'] || this.keys['ArrowRight'] ? this.speed : 0);
      this.motion.z = -(this.keys['KeyW'] || this.keys['ArrowUp'] ? this.speed : 0) + (this.keys['KeyS'] || this.keys['ArrowDown'] ? this.speed : 0);

      // reduce speed on diagonals
      if (this.motion.x != 0 && this.motion.z != 0) {
        this.motion.x *= this.diagonalReduction;
        this.motion.z *= this.diagonalReduction;
      }
    }

    // accelerate, move, wrap
    if (!(this.motion.x == 0 && this.motion.z == 0)) {
      this.accel += (1 - this.accel) * this.acceleration;
    } else {
      this.accel = 0;
    }

    this.position.x += this.motion.x * delta * this.accel;
    this.position.z += this.motion.z * delta * this.accel;
    this.position.x = (this.position.x > this.halfBound) ? this.halfBound : ((this.position.x < -this.halfBound) ? -this.halfBound : this.position.x);
    this.position.z = (this.position.z > this.halfBound) ? this.halfBound : ((this.position.z < -this.halfBound) ? -this.halfBound : this.position.z);
  }

  enableInput() {
    this.disabled = false;
  }

  disableInput() {
    this.disabled = true;
    for (var prop in this.keys) {
      if (this.keys.hasOwnProperty(prop)) {
        this.keys[prop] = false;
      }
    }
  }

  update(delta) {
    this.move(delta);
  }
}

export { Player };
