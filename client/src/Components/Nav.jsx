import React from 'react'

const Nav = () => {
  return (
    <nav className='w-full pt-3 px-3 flex items-center justify-between'>
      <div className="flex flex-row gap-2 items-center">
        <img src="/Tejas_logo.png" alt="Tejas Networks Logo" className='h-14'/>
        <h1 className='text-2xl font-bold text-slate-300'>Tejas Networks</h1>
      </div>
      {/* <h2 className='text-slate-500 font-semibold text-2xl'>Event Logging and Alert System</h2> */}
    </nav>
  )
}

export default Nav
