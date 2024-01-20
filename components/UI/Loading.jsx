import Image from 'next/image'
import React from 'react'

export default function Loading() {
  return (
    <div className='fixed top-0 left-0 bg-black/70 flex justify-center items-center w-full h-full'>
        <div className='p-4 rounded-lg'>
            <Image alt='' src='/loading.png' width={250} height={350} className="my-auto mx-auto animate-pulse"/>
            <p className='mt-3 text-center font-semibold'>Loading...</p>
        </div>
    </div>
  )
}
