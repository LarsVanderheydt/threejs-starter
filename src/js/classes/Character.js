import '../lib/GLTFLoader';
import $ from "jquery";
import AnimationLoader from './AnimationLoader';

export default class Character extends AnimationLoader {
  constructor(scene) {
    super();
    this.materialShader


    // load body & animation
    this.loader.load('./assets/glb/rigged_anim.glb', async (gltf) => {
        this.armature = gltf.scene.children[0];
        this.mixer = new THREE.AnimationMixer(this.armature);
        this.addAnimation('yell', gltf.animations[0])

        // load sword animation
        await this.loader.load('./assets/glb/draw_sword.glb', (gltf) => this.addAnimation('draw_sword', gltf.animations[0]),
          (xhr) => this.onLoad(xhr),
          (error) => this.onError(error)
        );

        // load dance animation
        await this.loader.load('./assets/glb/dance.glb', (dance) => this.addAnimation('dance', dance.animations[0]),
          (xhr) => this.onLoad(xhr),
          (error) => this.onError(error)
        );

        this.animate();
        this.addMaterials();

        scene.add(this.armature);
      },

      (xhr) => this.onLoad(xhr),
      (error) => this.onError(error));
  }

  draw(timestamp) {
    if (this.mixer) {
      const mixerUpdateDelta = this.clock.getDelta();
      this.mixer.update(mixerUpdateDelta);
    }

    if (this.materialShader) this.materialShader.uniforms.time.value = timestamp / 1000;
    requestAnimationFrame(() => this.draw());
  }

  animate() {
    let isDancing = false;

    window.addEventListener('wheel', ({ deltaY }) => {
      if (deltaY > 0 && isDancing === false) {
        this.toggle('dance');
        isDancing = true;
      }

      if (deltaY < 0 && isDancing === true) {
        this.toggle('yell');
        isDancing = false;
      }
    })

    $('#pause').on('click', e => this.pauze());
  }

  addMaterials() {
    const material = new THREE.MeshPhongMaterial({
      skinning: true,
      // blending: THREE.MultiplyBlending,
      reflectivity: 0.05,
      transparent: true,
      color: 0x00ffff,
      opacity: 1,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.time = {
        value: 0
      };

      shader.fragmentShader = [
        'uniform float time;',
        'varying vec2 vUv;\n',
      ].join('\n') + shader.fragmentShader;


      shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
        [
          'vec2 position = - 1.0 + 2.0 * vUv;',
          'float red = abs( sin( position.x * position.y + time / 5.0 ) );',
          'float green = abs( sin( position.x * position.y + time / 4.0 ) );',
          'float blue = abs( sin( position.x * position.y + time / 3.0 ) );',
          'gl_FragColor = vec4( red, green, blue, 1.0 );'
        ].join('\n')
      );

      shader.vertexShader = [
        'varying vec2 vUv;',
        'uniform float time;\n',
      ].join('\n') + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        [
          '#include <begin_vertex>',
          'vUv = uv;',
        ].join('\n')
      );

      this.materialShader = shader;
    };

    this.armature.traverse((node) => {
      if (node instanceof THREE.Mesh) node.material = material;
    });
  }
}