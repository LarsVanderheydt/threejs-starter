import '../lib/GLTFLoader';

export default class AnimationLoader {
  constructor() {
    this.THREE = THREE;
    this.loader = new this.THREE.GLTFLoader();
    this.clock = new THREE.Clock();
    this.animations = []
    this.mixer;
    this.currentAnimation;
    this.pauzed = false;
  }

  onLoad(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
  }

  onError(error) {
    console.log(error);
    console.log('An error happened');
  }

  setWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }

  addAnimation(name, anim) {
    this.animations[name] = this.mixer.clipAction(anim);
    this.animations[name].setEffectiveWeight(0);
    this.animations[name].play();
  }

  fadeIn(name) {
    this.setWeight(this.animations[name], 1)
    this.animations[name].fadeIn(1)
    this.currentAnimation = name;
  }

  crossFade(name) {
    this.animations[name].time = 0
    this.animations[this.currentAnimation].crossFadeTo(this.animations[name], 2, true);
    this.currentAnimation = name;
  }

  toggle(name) {
    this.animations[name].loop = THREE.LoopRepeat;
    this.setWeight(this.animations[name], 1);

    if (!this.currentAnimation) {
      this.fadeIn(name);
      return;
    }

    if (this.currentAnimation !== name) this.crossFade(name);
  }

  pauze() {
    this.animations[this.currentAnimation].paused = !this.animations[this.currentAnimation].paused
  }
}