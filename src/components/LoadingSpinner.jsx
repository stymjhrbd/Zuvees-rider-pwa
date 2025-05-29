import { motion } from 'framer-motion'

export default function LoadingSpinner({
    size = 'default',
    className = '',
    color = 'primary',
    fullScreen = false,
    text = ''
}) {
    const sizeClasses = {
        small: 'w-4 h-4 border-2',
        default: 'w-8 h-8 border-3',
        large: 'w-12 h-12 border-4'
    }

    const colorClasses = {
        primary: 'border-primary-200 border-t-primary-600',
        white: 'border-white/20 border-t-white',
        gray: 'border-gray-200 border-t-gray-600'
    }

    const spinner = (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
            />
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 text-sm text-gray-600"
                >
                    {text}
                </motion.p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        )
    }

    return spinner
}

// Export specific variants for common use cases
export const PageLoader = ({ text = 'Loading...' }) => (
    <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="large" text={text} />
    </div>
)

export const ButtonLoader = ({ color = 'white' }) => (
    <LoadingSpinner size="small" color={color} />
)

export const FullScreenLoader = ({ text = 'Please wait...' }) => (
    <LoadingSpinner fullScreen size="large" text={text} />
)