'use client'
import React from 'react';

type button = {
    onClick : ()=>void
    text : string
}

export default function Button ({onClick, text} : button){
    return (
    <button 
    onClick={onClick}
    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
  >
   {text}
  </button>)
}