export default class Helper {
  constructor() {
    /* Mouse vector setup */
    this.vec = new THREE.Vector3();
    this.pos = new THREE.Vector3();
    this.mousePos = {
      x: 0,
      y: 0
    }

    this.eventHandlers()
  }

  eventHandlers() {
    document.addEventListener(`mousemove`, event => {
      this.mousePos = {
        x: event.clientX,
        y: event.clientY
      };
    }, false);
  }

  draw(camera) {
    /* Map mouse position to world vector */
    this.vec.set(
      (this.mousePos.x / window.innerWidth) * 2 - 1,
      -(this.mousePos.y / window.innerHeight) * 2 + 1,
      0.5
    );

    this.vec.unproject(camera);
    this.vec.sub(camera.position).normalize();
    const distance = -camera.position.z / this.vec.z;
    this.pos.copy(camera.position).add(this.vec.multiplyScalar(distance));
  }

  /**
   * v = value
   * vmin = value minimum value
   * vmax = value maximum value
   * tmin = min value to map to
   * tmax = max value to map to
   */
  normalize(v, vmin, vmax, tmin, tmax) {
    const nv = Math.max(Math.min(v, vmax), vmin);
    const dv = vmax - vmin;
    const pc = (nv - vmin) / dv;
    const dt = tmax - tmin;
    const tv = tmin + (pc * dt);
    return tv;
  }
}
