import Scene from './classes/scene';
import * as $ from 'jquery'
import Helpers from './classes/helpers';

const world = new Scene();
const helpers = new Helpers();
const { scene, camera, renderer } = world;

let cube, materialShader, composer, god
const colorUniform = { value: new THREE.Color(255,0,0) }
const mouseUniform = { value: new THREE.Vector2(0, 0) }
const resolution = { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }

let MY_VERTEX_SHADER, MY_FRAGMENT_SHADER;

const draw = (timestamp) => {

  /* Add stuff to the draw function here */

  if (materialShader) materialShader.uniforms.time.value = timestamp / 1000;
  if (materialShader) materialShader.uniforms.mouse.value.y = helpers.pos.y;
  if (materialShader) materialShader.uniforms.mouse.value.x = helpers.pos.x;
  // if (materialShader) console.log(materialShader.uniforms.mouse);
  // console.log(timestamp / 1000);

  cube.rotation.x += 0.005
  cube.rotation.y += 0.005
  cube.rotation.z += 0.005

  if (composer) composer.render(timestamp / 1000);


  /* Call draw functions for classes when needed to keep all stuff together but only have 1 RAF */
  world.draw();
  helpers.draw(camera);
  requestAnimationFrame(draw);
  //
}

const setup = () => {
  MY_VERTEX_SHADER = $('#vertex').text();
  MY_FRAGMENT_SHADER = $('#fragment').text();

  const uniforms = {
    uColor: colorUniform,
    mouse: mouseUniform,
    resolution,
    time: {
      value: 0
    }
  }

  const geom = new THREE.BoxGeometry( 1, 1, 1 );
  materialShader = new THREE.ShaderMaterial({
    vertexShader: MY_VERTEX_SHADER,
    fragmentShader: MY_FRAGMENT_SHADER,
    uniforms,
  })
  const material = new THREE.MeshPhongMaterial({ color: 0xffff00 })

  materialShader.extensions.derivatives = true;
  cube = new THREE.Mesh( geom, material );
  // cube = new THREE.Mesh( geom, materialShader );
  cube.name = 'cube';

  scene.add( cube );



}

const init = () => {
  setup();
  draw();
  window.addEventListener('resize', () => world.onWindowResize(), false);
}

init();
