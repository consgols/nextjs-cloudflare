'use client';

import React, { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { register } from '@/app/lib/auth';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/components/logo';

const Register = () => {
  const [state, action] = useActionState(register, undefined);
  return (
    <div className="flex items-center justify-center pt-50">
      <div className="w-100 border border-gray-400 rounded-md p-5 shadow-xl">
        <div className="flex justify-center mb-5">
          <Logo />
        </div>
        <form action={action}>
          <div className="mb-5">
            <Label className="mb-2" htmlFor="email">
              Email
            </Label>
            <Input id="email" type="text" name="email" placeholder="Email" defaultValue={state?.email} />
          </div>
          <div className="mb-5">
            <Label className="mb-2" htmlFor="password">
              Password
            </Label>
            <Input id="password" type="password" name="password" placeholder="Password" />
          </div>
          <div className="mb-5">
            <Label className="mb-2" htmlFor="confirmpassword">
              Confirm Password
            </Label>
            <Input id="confirmPassword" type="password" name="confirmPassword" placeholder="Confirm Password" />
          </div>
          <div className="mb-5">
            {state?.errors?.email && <p className="text-red-600">{state.errors.email}</p>}
            {state?.errors?.password && <p className="text-red-600">{state.errors.password}</p>}
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">Register</Button>
            <Link href="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
