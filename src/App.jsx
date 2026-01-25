import React from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import Bunny from './components/Bunny.jsx'
import { Environment } from '@react-three/drei'


const App = () => {
  return (
    <>
      <main>
        <Canvas style={{
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0
        }}>
          <Environment files="/background_default.exr" background environmentIntensity={2} />
          <Bunny />
        </Canvas>
        <section className='section-1'></section>
        <section className='section-2'></section>
        <section className='section-3'></section>
        <section className='section-4'></section>
      </main>
    </>
  )
}

export default App