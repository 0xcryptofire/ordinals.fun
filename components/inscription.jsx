/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { FaCloudUploadAlt, FaRegPlayCircle } from 'react-icons/fa'
import { AudioContext } from '@/context/audio'
import { useContext } from 'react'

export default function Inscription(props) {
  const audioContext = useContext(AudioContext)

  if (props.ipfs_cid) {
    return (
      <div
        onClick={() => props.modal(props.index)}
        className='bg-orange-400 drop-shadow-lg w-100 h-[35px] shadow-black rounded text-sm flex justify-center items-center font-semibold cursor-pointer hover:drop-shadow-2xl transition-all ease-out'
      >
        {props.blockNumber}
        <FaRegPlayCircle
          onClick={(e) => props.cancelBlock(props.index)}
          className='text-orange-700 absolute top-0 right-0 z-20 text-xl bg-white p-1 rounded-full'
        />
      </div>
    )
  } else {
    return (
      <div
        onClick={() => props.uploadAudio(props.index)}
        className='bg-orange-400 drop-shadow-lg w-100 h-[35px] shadow-black group rounded text-sm flex justify-center items-center font-semibold cursor-pointer hover:drop-shadow-2xl transition-all ease-out'
      >
        {props.blockNumber}
        <FaCloudUploadAlt className='hidden group-hover:inline-block transition ease-in-out text-2xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20 w-100 h-100 mr-[10px] p-2' />
        <div className='hidden group-hover:inline-block transition ease-in-out text-2xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-5 w-6 h-6 bg-orange-800 blur-sm rounded-full' />
        <div className='p-2 bg-gray-900 drop-shadow-md text-[8px] rounded-md absolute left-[50%] translate-x-[-50%] top-[-45px] w-[80px] hidden group-hover:inline-block'>
          Upload Audio
          <div className='relative h-full w-full'>
            <span className='bg-gray-900 h-[15px] w-[15px] absolute left-1/2 -translate-x-1/2 bottom-[-12px] rotate-45'></span>
          </div>
        </div>
      </div>
    )
  }
}
