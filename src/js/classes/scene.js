import { GodRaysEffect, BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

export default class Scene {
  constructor() {
    /* Create scene */
    this.scene = new THREE.Scene();


    /* Create camera */
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5;
    this.camera.name = 'camera';


    /* Create renderer */
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.background = new THREE.Color( 0x020202 );



    let circleGeo = new THREE.CircleGeometry(10,100);
    let circleMat = new THREE.MeshBasicMaterial({
      color: 0xffccaa,
      transparent: true,
      alpha: true
    });

    let circle = new THREE.Mesh(circleGeo, circleMat);
    circle.name = 'circle';
    circle.position.set(0 ,100 ,-500);
    this.scene.add(circle);

    /* Create composer */

    const effectPass = new EffectPass(this.camera, new GodRaysEffect(this.camera, circle, {
      resolutionScale: 1,
      density: 1,
      decay: 0.93,
      weight: 1,
      samples: 20,
    }));
    effectPass.renderToScreen = true;


    this.composer = new EffectComposer(this.renderer);

    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(effectPass);


    this.scene.add( circle );






    /* Show threejs in html */
    document.querySelector('.wrapper').appendChild(this.renderer.domElement);
    window.scene = this.scene;
    window.THREE = THREE;
    this.lights();
  }

  draw(timestamp) {
    this.renderer.render(this.scene, this.camera);
    this.composer.render(.1);
  }

  onWindowResize() {
    /* Handle window resize */
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  lights() {
    /* Add lightning to the scene */
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4);
    const ambientLight = new THREE.AmbientLight(0xffffff, .5);
    const shadowLight = new THREE.DirectionalLight(0xffffff, .5);
    shadowLight.position.set(10, 0, -10);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -500;
    shadowLight.shadow.camera.right = 500;
    shadowLight.shadow.camera.top = 500;
    shadowLight.shadow.camera.bottom = -500;
    shadowLight.shadow.camera.near = -.5;
    shadowLight.shadow.camera.far = 5000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    shadowLight.name = 'shadowLight';

    hemisphereLight.position.x = -3;
    hemisphereLight.name = 'hemisphereLight';

    ambientLight.position.x = -20;
    ambientLight.name = 'ambientLight';


    this.scene.add(shadowLight);
    this.scene.add(hemisphereLight);
    this.scene.add(ambientLight);
  }
}