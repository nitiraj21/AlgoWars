"use client"
import React from 'react'
import Container from './Container'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import { Spotlight } from '../ui/spotlight-new'
export default function MainPage() {
  return (
    <div >
    <Container>
        <Navbar/>
        <HeroSection/>
    </Container>

    </div>
  )
}
