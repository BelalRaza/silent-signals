'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signupSchema, usernameValidation } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  useEffect(() => {
    setUsernameMessage('');
    setUsernameAvailable(false);
    if (!usernameValidation.safeParse(username).success) {
      setIsCheckingUsername(false);
      return;
    }

    const controller = new AbortController();
    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get<ApiResponse>('/api/check-username-unique', {
          params: { username }, signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setUsernameMessage(response.data.message);
          setUsernameAvailable(response.data.success);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Could not check this username. Please try again.'
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsCheckingUsername(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data, { timeout: 45000 });
      if (!response.data.success) {
        setSubmitError(response.data.message || 'We could not create your account. Please try again.');
        return;
      }
      toast({ title: 'Check your email', description: response.data.message });
      router.push(`/verify/${encodeURIComponent(data.username)}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setSubmitError(
        axiosError.response?.data.message ??
        'We could not complete sign-up. Check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 px-4 py-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-black">
            Join Silent Signal
          </h1>
          <p className="mb-4 text-black">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-busy={isSubmitting}>
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Username</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black"
                      autoComplete="username"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        setUsername(event.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <p className="flex items-center gap-2 text-sm text-gray-600" role="status">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Checking username…
                    </p>
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`text-sm ${usernameAvailable ? 'text-green-700' : 'text-red-600'}`} role="status">
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input className="text-black" type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <p className="text-black text-sm font-medium">We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Password</FormLabel>
                  <FormControl>
                    <Input className="text-black" type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError && (
              <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending verification code…
                </>
              ) : 'Sign Up'}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4 text-black">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
