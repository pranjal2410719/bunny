import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const Bunny = () => {
  const group = useRef()

  const { scene, animations } = useGLTF('/model/bunny.glb')
  const { actions, mixer } = useAnimations(animations, group)

  const { camera, gl } = useThree()

  /* ------------------ Renderer & Camera ------------------ */
  useEffect(() => {
    camera.position.set(0, 0.25, 1)
    camera.lookAt(0, 0.2, 0)

    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.1
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.physicallyCorrectLights = true
  }, [camera, gl])

  /* ------------------ GLTF Animation ------------------ */
  useEffect(() => {
    if (!actions) return

    const action =
      actions['Armature|Take 001|BaseLayer'] ||
      Object.values(actions)[0]

    if (!action) return

    action
      .reset()
      .fadeIn(0.4)
      .setLoop(THREE.LoopRepeat, Infinity)
      .play()

    return () => {
      action.fadeOut(0.3)
      mixer.stopAllAction()
    }
  }, [actions, mixer])

  /* ------------------ Scene Tweaks ------------------ */
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
        obj.material.envMapIntensity = 1
      }
    })
  }, [scene])

  /* ------------------ GSAP ScrollTrigger ------------------ */
  useGSAP(
    () => {
      if (!group.current) return

      gsap.timeline({
        scrollTrigger: {
          trigger: '#section-1',
          endTrigger: '#section-4',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          // markers: true,
        },
      })
      .to(group.current.rotation, {
        y: group.current.rotation.y + Math.PI * 2,
        ease: 'none',
      })
    },
    { scope: group }
  )

  return (
    <>
      <group
        ref={group}
        position={[0, 0, -0.15]}
        rotation={[0, Math.PI * 0.9, 0]}
        scale={0.5}
      >
        <primitive object={scene} />
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.4} />

      <directionalLight
        position={[4, 6, 5]}
        intensity={2.5}
        castShadow
      />

      <directionalLight
        position={[-3, 2, -4]}
        intensity={0.8}
      />

      {/* Controls */}
      <OrbitControls
        target={[0, 0.2, 0]}
        enableDamping
        dampingFactor={0.08}
        minDistance={0.6}
        maxDistance={2}
      />
    </>
  )
}

export default Bunny

useGLTF.preload('/model/bunny.glb')
