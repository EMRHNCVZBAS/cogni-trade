'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    subscribeNews: true
  })
  const [passwordError, setPasswordError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    console.log(`Input changed: ${name}, value: ${type === 'checkbox' ? checked : value}`)
    
    setFormData(prevState => {
      const newState = {
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }
      console.log('New form state:', newState)
      return newState
    })

    // Clear password error when user types
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('')
    }
  }

  const validatePasswords = () => {
    console.log('Validating passwords:', formData.password, formData.confirmPassword)
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    setError('')
    setPasswordError('')

    // Validate passwords
    if (!validatePasswords()) {
      return
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms of Service')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          subscribeNews: formData.subscribeNews
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Registration error details:', data)
        throw new Error(data.error || 'An error occurred during registration')
      }

      // Eğer redirect parametresi varsa, o sayfaya yönlendir
      if (redirectPath) {
        router.push(`/auth/login?registered=true&redirect=${redirectPath}`)
      } else {
        router.push('/auth/login?registered=true')
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-dark-lighter/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-black placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-black placeholder-gray-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-black placeholder-gray-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-black placeholder-gray-500"
                placeholder="Confirm your password"
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-dark-DEFAULT border-gray-700 rounded focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-gray-300">
                    I agree to the <Link href="/terms" className="text-primary hover:text-primary-hover">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:text-primary-hover">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="subscribeNews"
                    name="subscribeNews"
                    type="checkbox"
                    checked={formData.subscribeNews}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-dark-DEFAULT border-gray-700 rounded focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="subscribeNews" className="text-gray-300">
                    I want to receive CogniTrade news and updates via email
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link href={redirectPath ? `/auth/login?redirect=${redirectPath}` : "/auth/login"} className="text-primary hover:text-primary-hover">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 