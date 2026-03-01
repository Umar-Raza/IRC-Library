import React from 'react'

export const About = () => {
  return (
    <div className='max-w-4xl mx-auto px-4'>
      <h1 className='text-center mt-5 text-2xl text-neutral font-bold underline'>About</h1>
      <div className='mt-8 text-lg text-base-content leading-relaxed'>
        <p className='mb-4'>
          Welcome to the IRC-Library, your comprehensive resource for documentation,
          guides, and community-driven content.
        </p>
        <p className='mb-4'>
          Our mission is to provide a centralized platform where developers and enthusiasts
          can explore a vast collection of information, contributing to a shared knowledge base
          that empowers everyone in the community.
        </p>
        <p>
          Built with modern technologies like React and Vite, this library is designed
          for speed, accessibility, and ease of use.
        </p>
      </div>
    </div>
  )
}
