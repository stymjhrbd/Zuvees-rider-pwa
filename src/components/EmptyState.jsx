import { motion } from 'framer-motion'
import { Package } from 'lucide-react'

export default function EmptyState({
    icon: Icon = Package,
    title = "No data found",
    description = "There's nothing to display right now.",
    action,
    className = ''
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col items-center justify-center min-h-[40vh] px-4 py-8 ${className}`}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                }}
                className="bg-gray-100 rounded-full p-6 mb-4"
            >
                <Icon size={48} className="text-gray-400" />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-gray-900 mb-2 text-center"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-center max-w-sm mb-6"
            >
                {description}
            </motion.p>

            {action && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {action}
                </motion.div>
            )}
        </motion.div>
    )
}