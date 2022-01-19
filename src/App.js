import { Html, useGLTFLoader } from "drei";
import React, { Suspense, useRef } from "react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Canvas, useFrame } from "react-three-fiber";
import "./App.scss";
//Components
import Header from "./components/header";
import { Section } from "./components/section";
import state from "./components/state";

const Model = ({ modelPath }) => {
  const gltf = useGLTFLoader(modelPath, true);
  return <primitive object={gltf.scene} dispose={null} />;
};

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <spotLight intensity={1} position={[1000, 0, 0]} />
    </>
  );
};

const HTMLContent = ({
  children,
  modelPath,
  groupPositionY,
  domContent,
  bgColor,
}) => {
  const [refItem, inView] = useInView({ threshold: 0 });
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.01));

  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView]);

  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, groupPositionY, 0]}>
        <mesh ref={ref} position={[0, -35, 0]}>
          <Lights />
          <Model modelPath={modelPath} />
        </mesh>
        <Html fullscreen portal={domContent}>
          <div className="container" ref={refItem}>
            {children}
          </div>
        </Html>
      </group>
    </Section>
  );
};

export default function App() {
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => {
    void onScroll({ target: scrollArea.current });
  }, []);

  return (
    <>
      <Header />
      <Canvas colorManagement camera={{ position: [0, 0, 120], fov: 70 }}>
        <Suspense fallback={null}>
          <HTMLContent
            modelPath="/armchairYellow.gltf"
            groupPositionY={250}
            domContent={domContent}
            bgColor={"#88ff00"}
          >
            <h1 className="title">Yellow</h1>
          </HTMLContent>
          <HTMLContent
            modelPath="/armchairGreen.gltf"
            groupPositionY={0}
            domContent={domContent}
            bgColor={"#47e269"}
          >
            <h1 className="title">Green</h1>
          </HTMLContent>
          <HTMLContent
            modelPath="/armchairGray.gltf"
            groupPositionY={-250}
            domContent={domContent}
            bgColor={"#7a7a7a"}
          >
            <h1 className="title">Gray</h1>
          </HTMLContent>
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ position: "sticky", top: 0 }} ref={domContent}></div>
        <div style={{ height: `${state.sections * 100}vh` }}></div>
      </div>
    </>
  );
}
