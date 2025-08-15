"use client"
import React, { useEffect } from 'react'
import Container from './Container'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import { Spotlight } from '../ui/spotlight-new'
import Mockup from './Mockup'
import SupportedLanguages from './Languages'
import { motion } from 'framer-motion'


export default function MainPage() {

  return (
    <div >
    <Container>
        <Navbar/>
        <HeroSection/>
        <Mockup/>
        <div>

        <SupportedLanguages/>
        </div>
        
    </Container>

    </div>
  )
}
