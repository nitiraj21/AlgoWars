'use client'
import React from 'react';

type button = {
    onClick : ()=>void
    text : string
    Class? : string
}

export default function Button ({onClick, text, Class} : button){
    return (
    <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-medium ${Class} transition-colors`}
  >
   {text}
  </button>)
}