import { useEffect, useRef } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

const Mainwork = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    // =========================================
    // SIZE
    // =========================================

    const size = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    // =========================================
    // SCENE
    // =========================================

    const scene = new THREE.Scene();

    // IMPORTANT:
    // No scene.background here.
    // Canvas will be transparent.
    // Your website background will be visible.
    
    // =========================================
    // RENDERER
    // =========================================

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(size.width, size.height);

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(0x000000, 0);

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1;

    // =========================================
    // CAMERA
    // =========================================

    const camera = new THREE.PerspectiveCamera(
      45,
      size.width / size.height,
      0.1,
      100
    );

    camera.position.set(0, 1.5, 6);

    camera.lookAt(0, 0, 0);

    scene.add(camera);

    // =========================================
    // LIGHT
    // =========================================

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      2
    );

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      3
    );

    directionalLight.position.set(2, 3, 4);

    scene.add(directionalLight);

    // =========================================
    // ORBIT CONTROLS
    // =========================================

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.enableZoom = false

    controls.dampingFactor = 0.05;

    // =========================================
    // GLTF LOADER
    // =========================================

    const gltfLoader = new GLTFLoader();

    // =========================================
    // DRACO LOADER
    // =========================================

    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
    );

    gltfLoader.setDRACOLoader(dracoLoader);

    // =========================================
    // KTX2 LOADER
    // =========================================

    const ktx2Loader = new KTX2Loader();

    ktx2Loader.setTranscoderPath(
      "https://cdn.jsdelivr.net/npm/three@0.181.1/examples/jsm/libs/basis/"
    );

    ktx2Loader.detectSupport(renderer);

    gltfLoader.setKTX2Loader(ktx2Loader);

    // =========================================
    // MODEL
    // =========================================

    let model = null;

    let mixer = null;

    // =========================================
    // LOAD BIKE
    // =========================================

    gltfLoader.load(
      "./Bike.glb",

      // SUCCESS
      (gltf) => {
        console.log("✅ Bike loaded");
        console.log("GLTF:", gltf);

        model = gltf.scene;

        scene.add(model);

        // =====================================
        // CENTER MODEL
        // =====================================

        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(
          new THREE.Vector3()
        );

        model.position.sub(center);

        // =====================================
        // MODEL SCALE
        // =====================================

        model.scale.set(1.5, 1.5, 1);
        // =====================================
        // MODEL SIZE
        // =====================================

        const modelSize = box.getSize(
          new THREE.Vector3()
        );

        console.log("Bike size:", modelSize);

        // =====================================
        // MESH INFORMATION
        // =====================================

        model.traverse((child) => {
          if (child.isMesh) {
            console.log("Mesh:", child.name);
            console.log("Material:", child.material);
          }
        });

        // =====================================
        // ANIMATION
        // =====================================

        if (gltf.animations.length > 0) {
          console.log(
            "Animations:",
            gltf.animations
          );

          mixer = new THREE.AnimationMixer(model);

          const action = mixer.clipAction(
            gltf.animations[0]
          );

          action.play();
        } else {
          console.log("No animation found");
        }
      },

      // =====================================
      // PROGRESS
      // =====================================

      (progress) => {
        if (progress.total > 0) {
          const percent =
            (progress.loaded / progress.total) * 100;

          console.log(
            `Bike loading: ${percent.toFixed(0)}%`
          );
        } else {
          console.log("Bike loading...");
        }
      },

      // =====================================
      // ERROR
      // =====================================

      (error) => {
        console.error(
          "❌ Bike GLB Error:",
          error
        );
      }
    );

    // =========================================
    // CLOCK
    // =========================================

    const clock = new THREE.Clock();

    let animationFrameId;

    // =========================================
    // ANIMATION LOOP
    // =========================================

    const animate = () => {
      animationFrameId =
        requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // GLTF animation
      if (mixer) {
        mixer.update(delta);
      }

      // Orbit controls
      controls.update();

      // Render
      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // =========================================
    // RESIZE
    // =========================================

    const resize = () => {
      if (!container) return;

      size.width = container.clientWidth;

      size.height = container.clientHeight;

      // Camera
      camera.aspect =
        size.width / size.height;

      camera.updateProjectionMatrix();

      // Renderer
      renderer.setSize(
        size.width,
        size.height
      );

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio,
          2
        )
      );
    };

    window.addEventListener(
      "resize",
      resize
    );

    // =========================================
    // CLEANUP
    // =========================================

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );

      cancelAnimationFrame(
        animationFrameId
      );

      controls.dispose();

      dracoLoader.dispose();

      ktx2Loader.dispose();

      if (model) {
        model.traverse((child) => {
          if (child.isMesh) {
            // Geometry
            if (child.geometry) {
              child.geometry.dispose();
            }

            // Material
            if (child.material) {
              if (
                Array.isArray(
                  child.material
                )
              ) {
                child.material.forEach(
                  (material) => {
                    material.dispose();
                  }
                );
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }

      renderer.dispose();
    };
  }, []);

  return (
    <section className="w-full ">

      {/* =====================================
          THREE.JS CONTAINER
      ====================================== */}

       
<div className="h-screen w-full relative z-999">
  <h1>hey hunain fuck u</h1>
<div
        ref={containerRef}
        className="
          absolute
          w-full
          h-screen
        "
      >

        {/* THREE.JS CANVAS */}

        <canvas
          ref={canvasRef}
          className="
            w-full
            h-full
          "
        />

      </div>

</div>

  


       <div className="h-screen  w-full bg-blue-500">
       </div>

    </section>
  );
};

export default Mainwork;