/**
  @author meatbags / https://github.com/meatbags
  **/

THREE.NoiseShader = {
  uniforms: {
    'tDiffuse': {value: null},
    'time': {value: 0.0}
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float time;
    uniform sampler2D tDiffuse;

    float rand(vec2 seed) {
      return fract(sin(dot(seed.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec4 tex = texture2D(tDiffuse, vUv);
      float scale = 1.0 - tex.r;
      float r = tex.r + rand(vUv + time) * 0.04 * scale;
      float g = tex.g + rand(vUv + time + 1.) * 0.04 * scale;
      float b = tex.b + rand(vUv + time + 2.) * 0.06 * scale;
      gl_FragColor = vec4(r, g, b, tex.a);
    }
  `
};

// render pass
THREE.NoisePass = function() {
  THREE.Pass.call(this);

  this.shader = THREE.NoiseShader;
  this.material = new THREE.ShaderMaterial(this.shader);
  this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  this.scene = new THREE.Scene();
  this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.material);
  this.quad.frustumCulled = false;
  this.time = 0;
  this.scene.add(this.quad);
};

THREE.NoisePass.prototype = Object.assign(Object.create(THREE.Pass.prototype), {
  constructor: THREE.NoisePass,
  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
    // limit time
    this.time = (this.time + delta) % 10.0;
    this.shader.uniforms['time'].value = this.time;

    // set texture
    this.shader.uniforms['tDiffuse'].value = readBuffer.texture;

    // render
    if (this.renderToScreen) {
      renderer.render(this.scene, this.camera);
    } else {
      renderer.render(this.scene, this.camera, writeBuffer, this.clear);
    }
  }
});
