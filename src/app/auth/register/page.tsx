'use client';
import api from '@/app/utils/axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate the form inputs
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    validate();
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await api.post('/user/register', {
          email: form.email,
          password: form.password,
        });
        setForm({
          email: '',
          password: '',
          confirmPassword: '',
        })
        router.push('/auth/login');
      } catch (err: any) {
        console.log(err.response?.data?.error || ' Registration failed.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#4b7bec] w-full h-screen">
      <div className="w-[40rem] h-[35rem] bg-white p-5 shadow-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="pb-4">
            <label htmlFor="email" className="pb-2 block">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Please enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="pb-4">
            <label htmlFor="password" className="pb-2 block">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Please enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="pb-4">
            <label htmlFor="confirmPassword" className="pb-2 block">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Please confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center flex-col gap-3 justify-center">
            <button
              type="submit"
              disabled={Object.keys(errors).length > 0}
              className={`px-6 py-2 rounded-2xl text-white ${Object.keys(errors).length > 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#4b7bec] cursor-pointer'
                }`}
            >
              Register
            </button>
            <p>
              Already have an account?{' '}
              <span
                className="text-[#4b7bec] cursor-pointer"
                onClick={() => router.push('/auth/login')}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
