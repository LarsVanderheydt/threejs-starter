import Scene from './classes/Scene';
import Helpers from './classes/Helpers';
import Character from './classes/Character';

const world = new Scene();
const helpers = new Helpers();
const { scene, camera } = world;

let character, materialShader;
let smokeParticles = [];
let clock = new THREE.Clock();
let delta;
let light;

const draw = (timestamp) => {
  /* Add stuff to the draw function here */
  if (character.armature) character.draw(timestamp);
  if (materialShader) materialShader.uniforms.time.value = timestamp / 1000;

  delta = clock.getDelta();
  evolveSmoke();
  // light.position.x = helpers.pos.x
  // light.position.y = helpers.pos.y

  /* Call draw functions for classes when needed to keep all stuff together but only have 1 RAF */
  world.draw();
  helpers.draw(camera);
  requestAnimationFrame(draw);
  //
}

const setup = () => {
  character = new Character(scene);


  let smokeTexture = THREE.ImageUtils.loadTexture('../assets/texture/Smoke-Element.png');
  let smokeMaterial = new THREE.MeshLambertMaterial({color: 0x00dddd, map: smokeTexture, transparent: true});
  let smokeGeo = new THREE.PlaneGeometry(300,300);
  const group = new THREE.Group();

  for (let p = 0; p < 150; p++) {
    const particle = new THREE.Mesh(smokeGeo,smokeMaterial);
    particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
    particle.rotation.z = Math.random() * 360;

    group.add(particle);
    smokeParticles.push(particle);
  }

  light = new THREE.PointLight( 0xff0000, 2, 100, 2 );

  light.position.set( 0, 0, 0 );
  scene.add( light );

  // scene.add(group);
}


const evolveSmoke = () => {
  let sp = smokeParticles.length;
  while(sp--) {
    smokeParticles[sp].rotation.z += (delta * 0.2);
  }
}

const init = () => {
  setup();
  draw();
  window.addEventListener('resize', () => world.onWindowResize(), false);
}

init();
