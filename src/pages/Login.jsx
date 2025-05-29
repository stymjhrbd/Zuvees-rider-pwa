import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Bike, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

export default function Login() {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const [error, setError] = useState('')

    const handleSuccess = async (credentialResponse) => {
        setError('')
        const result = await login(credentialResponse.credential)
        if (result.success) {
            navigate('/')
        } else {
            setError(result.error || 'Login failed. Make sure you have a rider account.')
        }
    }

    const handleError = () => {
        setError('Google login failed. Please try again.')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-sm w-full"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 text-white rounded-full mb-4"
                    >
                        <Bike size={40} />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900">Rider App</h1>
                    <p className="mt-2 text-gray-600">Sign in to start delivering</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start space-x-2"
                        >
                            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{error}</span>
                        </motion.div>
                    )}

                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        theme="outline"
                        size="large"
                        width="100%"
                        text="continue_with"
                        shape="rectangular"
                    />

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Only approved rider accounts can access this app
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Need help? Contact your dispatcher
                    </p>
                </div>
            </motion.div>
        </div>
    )
}