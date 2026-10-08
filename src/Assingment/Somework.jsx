// import GUI from "lil-gui";
import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const Somework = () => {
  useEffect(() => {
    // =========================
    // SIZE
    // =========================

    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };


    // =========================
    // SCENE
    // =========================

    const scene = new THREE.Scene();

    scene.background = new THREE.Color("white");

    const timer = new THREE.Timer();

    // const gui = new GUI();

    // =========================
    // CUBE
    // =========================

    const geometry = new THREE.BoxGeometry(1, 1, 1);


    // textire
    const texture = new THREE.TextureLoader();
    const load = texture.load("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpzkX300tpUvLXtPg1py8BcebtrbImQ9JK6zYIA6B1-g&s=10");
    load.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({
      color: "red",
      wireframe : true
      // map:load
    });

    

    const mesh = new THREE.Mesh(geometry, material);

// gui
// gui
//   .add(mesh.position, "x")
//   .min(-3)
//   .max(3)
//   .step(0.1)
//   .name("Position X");

// gui
//   .add(mesh.position, "y")
//   .min(-3)
//   .max(3)
//   .step(0.1)
//   .name("Position Y");

// gui
//   .add(mesh.position, "z")
//   .min(-3)
//   .max(3)
//   .step(0.1)
//   .name("Position Z");

    scene.add(mesh);

    // =========================
    // CAMERA
    // =========================

    const camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      100
    );

    camera.position.z = 3;

    camera.lookAt(0, 0, 0);

    // =========================
    // CANVAS
    // =========================

    const canvas = document.querySelector("#webgl");

    // =========================
    // RENDERER
    // =========================

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });

    renderer.setSize(size.width, size.height);

    // =========================
    // ORBIT CONTROLS
    // =========================

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.enableZoom = true

    // =========================
    // RESIZE
    // =========================

    function resize() {
      size.width = window.innerWidth;
      size.height = window.innerHeight;

      camera.aspect = size.width / size.height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        size.width,
        size.height
      );
    }
    

    window.addEventListener("resize", resize);

    // =========================
    // ANIMATION
    // =========================

    function animate() {
      timer.update();

      const delta = timer.getDelta();

      controls.update();

      // cube movement
      mesh.rotation.x += delta ;
      mesh.rotation.y += delta ;

      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    }

    animate();

    // =========================
    // CLEANUP
    // =========================

    return () => {
      window.removeEventListener("resize", resize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="webgl"></canvas>;
};

export default Somework;