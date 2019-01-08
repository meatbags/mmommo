/**
 ** Renderer
 ** WebGL renderer and post-processing.
 **/

import { Config } from '../../../shared';
import { Renderer2D } from './renderer_2d';
import '../../lib/glsl';

class Renderer {
  constructor(scene, client) {
    this.scene = scene.scene;
    this.camera = scene.camera;

    // webgl renderer
    this.width = window.innerWidth - Config.global.hudSize;
    this.height = window.innerHeight;
    this.size = new THREE.Vector2(this.width, this.height);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xaaaaaa, 1);
    this.postProcessing();

    // add to doc
    this.renderer.domElement.id = 'canvas';
    document.body.appendChild(this.renderer.domElement);

    // 2d renderer (overlays)
    this.renderer2d = new Renderer2D(scene, this.camera, client);
  }

  resize() {
    // resize screen and pp render passes
    this.width = window.innerWidth - Config.global.hudSize;
    this.height = window.innerHeight;
    this.size.x = this.width;
    this.size.y = this.height;
    this.FXAAPass.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
    this.bloomPass.setSize(this.width, this.height);
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);

    // resize overlay
    this.renderer2d.resize();
  }

  postProcessing() {
    // post processing passes
    const strength = 0.28;
    const radius = 0.16;
    const threshold = 0.97;
    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.FXAAPass = new THREE.ShaderPass(THREE.FXAAShader);
		this.FXAAPass.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
    this.bloomPass = new THREE.UnrealBloomPass(this.size, strength, radius, threshold);
    //this.posterPass = new THREE.PosterPass(this.size);
    //this.noisePass = new THREE.NoisePass();
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.setSize(this.width, this.height);
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.FXAAPass);
    //this.composer.addPass(this.posterPass);
    this.composer.addPass(this.bloomPass);
    //this.composer.addPass(this.noisePass);
    this.bloomPass.renderToScreen = true;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
  }

  render(delta) {
    this.composer.render(delta);

    // overlay
    this.renderer2d.render(delta);
  }
}

export { Renderer };
