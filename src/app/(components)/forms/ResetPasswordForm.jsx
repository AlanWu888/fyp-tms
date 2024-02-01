import Link from "next/link"
import React from "react"

export default function ResetPasswordForm() {

/*
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>

                <input onChange={e => setEmail(e.target.value)} type='text' placeholder='Email'/>
                <input onChange={e => setPassword(e.target.value)}type='password' placeholder='Password'/>
*/

    return(
        <div className='grid place-items-center h-screen bg-indigo-900'>
            <div className='shadow-lg p-5 rounded-lg bg-white'>
                <h1 className='text-xl font-bold my-4'>Reset your password</h1>
                <hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-700'/>
                <form className='flex flex-col gap-3'>
                    <p className="text-sm">Enter the email associated with your account:</p>
                    <input className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40" type='text' placeholder='Email'/>
                    <p className="text-sm">You should get an email with instructions on how to reset your password</p>
                    <button className='font-bold cursor-pointer px-6 py-2 bg-blue-400 rounded-lg text-white'>Reset</button>

                    <div className='text-sm mt-3 text-right'>
                    Return to login screen? <Link  href={'/'}>
                        <span className='underline'>Click Here</span>    
                    </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}