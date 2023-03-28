import React, { useRef, useEffect } from "react";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import {
  Engine,
  Scene,
  MeshBuilder,
  ArcRotateCamera,
  HemisphericLight,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";
import tiger from '../assets/reactlogo.jpg'

const Cuboid = (props) => {
  var canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

    // const image = props.image?props.image:mapimg

    var createScene = function () {
      var scene = new Scene(engine);
      scene.clearColor = new Color3(0.2, 0.2, 0.2);

      var camera = new ArcRotateCamera(
        "arc",
        -Math.PI / 4,
        Math.PI / 4,
        5,
        Vector3.Up(),
        scene
      );
      camera.attachControl(canvas, false);

      //lighting
      var light = new HemisphericLight("hemiLight", Vector3.Up(), scene);
      light.intensity = 1;
      light.diffuse = new Color3(1, 1, 1);
	    light.specular = new Color3(1, 1, 1);
      light.groundColor = new Color3(1, 1, 1);

      //material
      var mat = new StandardMaterial("map", scene);
      mat.diffuseTexture = new Texture(props.image?props.image:tiger, scene);
      mat.diffuseTexture.hasAlpha = true;
      mat.backFaceCulling = false;
      mat.position = Vector3.Zero();

      //box
      var box = MeshBuilder.CreateBox("box", {size:'2'}, scene);
      box.material = mat;
      box.position = new Vector3(0, 1, 0);

      return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function () {
      scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener("resize", function () {
      engine.resize();
    });
    
  }, [props.image]);

  return (
    <div>
      <canvas ref={canvasRef} className="cuboid-container" />
    </div>
  );
};
export default Cuboid;
