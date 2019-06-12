import * as THREE from 'three';
import Scene from './classes/scene';
import Helpers from './classes/helpers';

const world = new Scene();
const helpers = new Helpers();
const { scene, camera } = world;

let cube;

const draw = () => {

  /* Add stuff to the draw function here */
  cube.rotation.z += .01;
  cube.rotation.x += .02;
  cube.rotation.y += .01;


  /* Call draw functions for classes when needed to keep all stuff together but only have 1 RAF */
  world.draw();
  helpers.draw(camera);
  requestAnimationFrame(draw);
  //
}

const setup = () => {
  // Test object
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
  cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
}

const init = () => {
  setup();
  draw();
  window.addEventListener('resize', () => world.onWindowResize(), false);
}

init();
