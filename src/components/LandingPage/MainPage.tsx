import React from 'react'
import Container from './Container'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import Mockup from './Mockup'
import SupportedLanguages from './Languages'
import Testimonials from './Testimonials'
import HowItWorks from './HowItWorks'
import Table from './Table'
import CTA from './CTA'
import Footer from './Footer'


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
        <Table/>
        <CTA/>
        <Testimonials/>
        <Footer/>
    </Container>

    </div>
  )
}
