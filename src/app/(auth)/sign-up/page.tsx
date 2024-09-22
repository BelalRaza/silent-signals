'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {useDebounceValue,useDebounceCallback} from "usehooks-ts"
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { useToast } from '../../components/ui/use-toast';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { signUpSchema } from '@/schemas/signUpSchema';
import { signupSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(""); 
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          let message = response.data.message
          setUsernameMessage(message);
          // setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
          console.error('Error checking username:', axiosError); // Log the error for debugging
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);
  

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
<div className="flex justify-center items-center min-h-screen bg-gray-800">
  <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-800">
        Join True Feedback
      </h1>
      <p className="mb-4 text-gray-600">Sign up to start your anonymous adventure</p>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Username</FormLabel>
              <Input
            {...field}
            onChange={(e) => {
              field.onChange(e);
              debounced(e.target.value);
            }}
            className="text-black"
          />

              
              {isCheckingUsername && <Loader2 className="animate-spin" />}
              {!isCheckingUsername && usernameMessage && (
                <p
                  className={`text-sm ${
                    usernameMessage === 'Username is unique'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {usernameMessage}
                </p>
              )}

    {isCheckingUsername &&
<Loader2
className="animate-spin" />} 
<p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
  test {usernameMessage}
</p>

     {/* *********************************     */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Email</FormLabel>
              <Input
                {...field}
                className="border border-gray-300 px-4 py-2 rounded-md focus:ring focus:ring-blue-500 focus:outline-none w-full
                text-black"
                name="email"
           
              />
              <p className="text-muted text-gray-400 text-sm text-black">
                We will send you a verification code
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Password</FormLabel>
              <Input
                type="password"
                {...field}
                className="border border-gray-300 px-4 py-2 rounded-md focus:ring focus:ring-blue-500 focus:outline-none
                 w-full text-black"
                name="password"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
      <p>
        Already a member?{' '}
        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
          Sign in
        </Link>
      </p>
    </div>
  </div>
</div>

  );
}