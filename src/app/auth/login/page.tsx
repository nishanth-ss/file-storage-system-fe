'use client';
import { storeToken } from '@/app/utils/auth';
import api from '@/app/utils/axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!user.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!user.password) {
      newErrors.password = 'Password is required';
    } else if (user.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    validate(); // Re-validate on user input change
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.email && user.password) {
      try {
        const res = await api.post('/user/login', {
          email: user.email,
          password: user.password,
        });
        const token = res.data.token;

        if (token) {
          storeToken(token);
          setUser({ email: '', password: '' });
          router.push('/home');
        } else {
          alert('Login failed: No token received.');
        }
      } catch (err: any) {
        console.log(err.response?.data?.error || 'Login failed.');
      }
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#4b7bec] w-full h-screen">
      <div className="w-[40rem] h-[30rem] bg-white p-5 shadow-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="pb-4">
            <label htmlFor="email" className="pb-2 block">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Please enter your email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="pb-4">
            <label htmlFor="password" className="pb-2 block">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Please enter your password"
              value={user.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="flex items-center flex-col gap-3 justify-center">
            <button
              type="submit"
              disabled={Object.keys(errors).length > 0}
              className={`px-6 py-2 rounded-2xl text-white cursor-pointer ${Object.keys(errors).length > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4b7bec]'
                }`}
            >
              Login
            </button>
            <p>
              Don&apos;t have an account?{' '}
              <span
                className="text-[#4b7bec] cursor-pointer"
                onClick={() => router.push('/auth/register')}
              >
                Register
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
