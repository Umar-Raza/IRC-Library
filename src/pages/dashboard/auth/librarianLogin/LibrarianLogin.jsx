import React from 'react'
import {Link} from 'react-router-dom'
export const LibrarianLogin = () => {
  return (
    <div className=" font-sans">
      <div className="min-h-screen flex flex-col  items-center justify-center py-6 px-4">
        <div className="max-w-[480px] w-full">
          <a href="javascript:void(0)"><img
            src="https://readymadeui.com/readymadeui.svg" alt="logo" className="w-40 mb-8 mx-auto block" />
          </a>

          <div className="p-6 sm:p-8 rounded-2xl bg-base-100  border-accent-content shadow-md">
            <h1 className="text-neutral text-center text-3xl font-semibold ">Log in</h1>
            <form className="mt-12 space-y-6">
              <div>
                <label className="text-neutral text-sm font-medium mb-2 block">User name</label>
                <div className="relative flex items-center">
                  <input name="username" type="text" required className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-neutral" placeholder="Enter user name" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4" viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div>
                <label className="text-neutral text-sm font-medium mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input name="password" type="password" required className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-neutral" placeholder="Enter password" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-neutral rounded" />
                  <label for="remember-me" className="ml-3 block text-sm text-neutral">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="jajvascript:void(0);" className="text-primary hover:underline font-semibold">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div className="mt-12">
                <button type="button" className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-neutral hover:bg-[#457b9d]  focus:outline-none cursor-pointer">
                  Sign in
                </button>
              </div>
              <p className="text-neutral text-sm !mt-6 text-center">Don't have an account? <Link to='/' className="text-primary hover:underline ml-1 whitespace-nowrap font-semibold">Back to Home</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
