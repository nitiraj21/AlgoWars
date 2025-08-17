'use client'
import React from 'react';

type button = {
    onClick? : ()=>void
    text : string
    Class? : string
    Disabled? : boolean
}

export default function Button ({onClick, text, Class, Disabled} : button){
    return (
    <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium cursor-pointer text-shadow-md ${Class} transition-colors`}
    disabled = {Disabled}
  >
   {text}
  </button>)
}