export default class Scene {
  constructor() {
    /* Create scene */
    this.scene = new THREE.Scene();


    /* Create camera */
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 3;
    this.camera.position.y = 1;
    this.camera.name = 'camera';


    /* Create renderer */
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.background = new THREE.Color( 0x000000 );
    this.renderer.setClearColor( 0x000000, 0 ); // the default



    /* Show threejs in html */
    document.querySelector('.wrapper').appendChild(this.renderer.domElement);
    window.scene = this.scene;
    window.THREE = THREE;
    this.lights();
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
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
    shadowLight.position.set(10, 0, 10);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -500;
    shadowLight.shadow.camera.right = 500;
    shadowLight.shadow.camera.top = 500;
    shadowLight.shadow.camera.bottom = -500;
    shadowLight.shadow.camera.near = -.5;
    shadowLight.shadow.camera.far = 5000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    hemisphereLight.position.x = -3;
    shadowLight.name = 'shadowLight';
    hemisphereLight.name = 'hemisphereLight';
    ambientLight.name = 'ambientLight';
    ambientLight.position.x = -20;

    this.scene.add(shadowLight);
    this.scene.add(hemisphereLight);
    this.scene.add(ambientLight);
  }
}