import * as THREE from "three";
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import t from "../img/text.png";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.container = options.dom;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    const frustumSize = 1;
    const aspect = 1;
    this.camera = new THREE.OrthographicCamera(
      frustumSize / -2,
      frustumSize / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000
    );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.isPlaying = true;
    this.addObjects();
    this.time = 0;
    this.resize();
    this.render();
    this.setupResize();
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.setupResize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.imageAspect = 853 / 1280;
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let tt = new THREE.TextureLoader().load(t);
    tt.magFilter = THREE.NearestFilter;
    tt.minFilter = THREE.NearestFilter;

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives: enable",
      },
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        time: { type: "f", value: 0 },
        texture1: { type: "t", value: tt },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      side: THREE.DoubleSide,
    });
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;

    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container"),
});
