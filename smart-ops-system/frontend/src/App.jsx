import { useState } from 'react'
import './index.css'  

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="rounded-lg bg-white p-8 shadow-2xl">  
        <h1 className="text-3xl font-bold text-blue-600 underline">
          Tailwind is Working! 🚀
        </h1>
        <p className="mt-4 text-blue-500">
          This text is now blue.
        </p>
      </div>
    </div>
  )
}

export default App
