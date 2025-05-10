'use client';
import { login } from './actions';
import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';

export default function SignIn() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm  rounded-2xl shadow-md border-2 bg-white ">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 p-8">
          Klientų Valdymo Sistema
        </h2>

        <form
          className=" p-6 rounded-lg  flex flex-col gap-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
              Elektroninis Paštas
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              placeholder="andrius.petraitis@gmail.com"
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900"
            >
              Slaptažodis
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              required
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-primary px-4 py-2 text-white font-semibold hover:bg-primaryhover focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 "
          >
            Prisijungti
          </button>
        </form>
      </div>
    </div>
  );
}
