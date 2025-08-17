"use client"
import React, { useEffect } from 'react'
import Container from './Container'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import { Spotlight } from '../ui/spotlight-new'
import Mockup from './Mockup'
import SupportedLanguages from './Languages'
import { motion } from 'framer-motion'
import Testimonials from './Testimonials'
import HowItWorks from './HowItWorks'


export default function MainPage() {

  return (
    <div >
    <Container>
        <Navbar/>
        <HeroSection/>
        <Mockup/>
        <HowItWorks/>
        <div>
        <SupportedLanguages/>
        </div>
        <Testimonials/>
        
    </Container>

    </div>
  )
}
