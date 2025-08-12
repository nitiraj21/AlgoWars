'use client'
import React from 'react';

type button = {
    onClick : ()=>void
    text : string
    Class? : string
    Disabled? : boolean
}

export default function Button ({onClick, text, Class, Disabled} : button){
    return (
    <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-medium cursor-pointer ${Class} transition-colors`}
    disabled = {Disabled}
  >
   {text}
  </button>)
}