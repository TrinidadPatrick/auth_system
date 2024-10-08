"use client"
import React, { useRef, useState } from 'react'
import { Button } from '../ui/button'
import LoginWithGithubButton from '../LoginWithGithubButton'
import { useForm } from 'react-hook-form'
import { LoginSchema } from '@/Schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { LoginWithCredentials } from '@/actions/authActions'
import { FaRegEyeSlash, FaEye } from 'react-icons/fa'
import { FormError } from '../FormError'
import LoginWithGoogleButton from '../LoginWithGoogleButton'
import { FormHeader } from '../FormHeader'
import Link from 'next/link'
import Loader from '../Loader'

const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const handleSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setIsLoading(true)
        try {
            const response = await LoginWithCredentials(data)
            window.location.reload()
            if(response?.status)
            {
                setErrorMessage(response.error)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
        
    }

    const togglePasswordVisibility = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setShowPassword(!showPassword)
    }
  

    return (
    <div className='px-10 flex flex-col justify-center w-screen semiSm:w-[400px] h-full '>
        <FormHeader title='Sign In' paragraph='Please enter your email and password' />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-3'>
                <FormField 
                name='email'
                control={form.control}
                render={({ field }) => <FormItem>
                    <FormLabel className='text-xs'>Email</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Enter email" type="email" />
                        </FormControl>
                    <FormMessage />
                </FormItem>}
                />
                <FormField 
                name='password'
                control={form.control}
                render={({ field }) => <FormItem>
                    <FormLabel className='text-xs'>Password</FormLabel>
                        <FormControl >
                            <div className='relative'>
                                <Button onClick={(e)=>togglePasswordVisibility(e)} className='p-0 absolute right-1 bg-transparent hover:bg-transparent shadow-none'>
                                    {
                                        showPassword ? <FaEye color="black" /> : <FaRegEyeSlash color="black" />
                                    }
                                </Button>
                                <Input {...field} placeholder="Enter password" type={showPassword ? "text" : "password"} />
                            </div>
                            
                        </FormControl>
                    <FormMessage />
                    
                </FormItem>}
                />
                {/* Error message for invalid credentials */}
                <FormError errorMessage={errorMessage} />
                <Link href="/reset-password" className='text-xs text-gray-500 font-medium'>Forgot password</Link>
                </div>
                {/* Submit button */}
                <Button type="submit" className={`w-full ${isLoading ? 'bg-gray-500' : 'bg-gray-800'} rounded`}>
                    <Loader isLoading={isLoading} text='Sign in' />
                </Button>
            </form>
        </Form>
        <div className='flex justify-center mt-2'>
            <p className='text-xs'>Dont have an account? <Link href="/signup" className='text-xs text-gray-500 font-medium'>Sign up</Link></p>
        </div>
        <div className='flex gap-3 items-center mt-2'>
            <div className='w-full h-[1.5px] bg-gray-300'></div>
            <p className='text-center text-sm'>or</p>
            <div className='w-full h-[1.5px] bg-gray-300'></div>
        </div>
        <div className='mt-3 flex flex-col justify-between gap-2'>
          <LoginWithGithubButton />
          <LoginWithGoogleButton />
        </div>
        
    </div>
  )
}

export default LoginForm