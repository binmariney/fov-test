import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as pc from 'playcanvas';
import { useControls } from 'leva';


function Viewer() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const canvasHeight = 600;
  const { canvasWidth } = useControls({
    canvasWidth: { value: 400, min: 400, max: 1200, step: 200 },
  });
  const { horizontalFov } = useControls({
    horizontalFov: true
  });
  const [camera, setCamera] = useState(null);

  function calculateY(x) {
    x /= 2
    const ratio = canvasWidth / canvasHeight;
    let y = 90 - radToDeg(Math.atan(ratio / Math.tan(degToRad(x))));
    y *= 2;
    return y;
  }
  function calculateX(x) {
    x /= 2
    const ratio = canvasHeight/ canvasWidth;
    let y = 90 - radToDeg(Math.atan(ratio / Math.tan(degToRad(x))));
    y *= 2;
    return y;
  }

  const degToRad = (deg) => {
    return deg * Math.PI / 180;
  }
  const radToDeg = (rad) => {
    return rad * 180 / Math.PI;
  }

  useEffect(() => {
    console.log('canvasWidth', canvasWidth, 'canvasHeight', canvasHeight)
    if (canvasRef) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
    }
  }, [canvasWidth]);

  useEffect(() => {
    if (camera) {
      camera.camera.horizontalFov = horizontalFov;
      camera.camera.fov = horizontalFov ? calculateX(camera.camera.fov) : calculateY(camera.camera.fov);
      console.log('camera.camera.fov', camera.camera.fov, 'camera.camera.horizontalFov', camera.camera.horizontalFov)
    }

  }, [horizontalFov]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const app = new pc.Application(canvas, {
      mouse: new pc.Mouse(canvas),
      touch: new pc.TouchDevice(canvas),
      keyboard: new pc.Keyboard(window),
      graphicsDeviceOptions: {
        preferWebGl2: true,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
        frustrumCulling: false,
      }
    });
    app.scene.ambientLight.set(1, 1, 1)
    app.scene.ambientLightIntensity = 1;
    app.start();

    // app.setCanvasFillMode(pc.FILLMODE_KEEP_ASPECT);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    const camera = new pc.Entity('camera');
    camera.addComponent('camera', {
      fov: 80,
      clearColor: new pc.Color(0.2, 0.2, 0.25),
      nearClip: 0.01,
      farClip: 100,
      horizontalFov: true
    });
    app.root.addChild(camera);
    setCamera(camera);

    const light = new pc.Entity('light');
    light.addComponent('light', {
      type: 'directional',
      color: new pc.Color(1, 1, 1),
      castShadows: true,
      numCascades: 1,
      penumbraSize: 0.1,
      shadowType: pc.SHADOW_PCF3, // default shadow type
      intensity: 1,
      shadowBias: 0.5,
      shadowDistance: 50,
      normalOffsetBias: 0.1,
      shadowResolution: 8192,
    });
    app.root.addChild(light);
    light.setLocalPosition(0, 2, 0);
    light.lookAt(0, 0, 0);

    const plane = new pc.Entity('plane');
    plane.addComponent('model', {
      type: 'plane',
    });
    app.root.addChild(plane);
    plane.setLocalPosition(0, 0, -3);
    plane.setLocalScale(18, 1, 9);
    plane.setLocalEulerAngles(90, 0, 0);
    plane.model.material = new pc.StandardMaterial();
    plane.model.material.diffuse = new pc.Color(1, 0.5, 0.5);
    plane.model.material.update();

    const plane2 = new pc.Entity('plane');
    plane2.addComponent('model', {
      type: 'plane',
    });
    app.root.addChild(plane2);
    plane2.setLocalPosition(0, 0, -3);
    plane2.setLocalScale(18, 1, 18);
    plane2.setLocalEulerAngles(90, 0, 0);
    plane2.model.material = new pc.StandardMaterial();
    plane2.model.material.diffuse = new pc.Color(0.5, 1, 0.5);
    plane2.model.material.update();

    camera.setPosition(0, 0, 8);
    camera.lookAt(0, 0, 0);

    const plane3 = new pc.Entity('plane');
    plane3.addComponent('model', {
      type: 'plane',
    });
    app.root.addChild(plane3);
    plane3.setLocalPosition(0, 0, -3);
    plane3.setLocalScale(18, 1, 27);
    plane3.setLocalEulerAngles(90, 0, 0);
    plane3.model.material = new pc.StandardMaterial();
    plane3.model.material.diffuse = new pc.Color(0.5, 0.5, 1);
    plane3.model.material.update();

    camera.setPosition(0, 0, 8);
    camera.lookAt(0, 0, 0);


    const cube = new pc.Entity('cube');
    cube.addComponent('model', {
      type: 'box',
    });
    app.root.addChild(cube);
    cube.setLocalPosition(0, 0, 0);
    cube.setLocalScale(8, 4, 4);
    cube.model.material = new pc.StandardMaterial();
    cube.model.material.diffuse = new pc.Color(0.3, 0.9, 0.8);
    // cube.setLocalEulerAngles(30, 30, 30);

    appRef.current = app;
  }, []);


  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Viewer;
