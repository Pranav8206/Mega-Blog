import React from 'react'

function Logo({width = '100px'}) {
  return (
    <div className='text-xl font-bold text-black '>
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 185 60"
      width={width}
      role="img"
      aria-labelledby="logoTitle logoDesc"
      
    >

      <rect x="8" y="12" width="10" height="10" rx="2" fill="#3B82F6" opacity="0.95" />
      <rect x="8" y="28" width="10" height="10" rx="2" fill="#93C5FD" opacity="0.85" />

      <text
        x="32"
        y="44"
        fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        fontWeight="700"
        fontSize="30"
        fill="#111827"
      >
        Mega
      </text>

      <text
        x="120"
        y="44"
        fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        fontWeight="500"
        fontSize="30"
        fill="#3B82F6"
      >
        Blog
      </text>
    </svg>
    </div>
  )
}

export default Logo