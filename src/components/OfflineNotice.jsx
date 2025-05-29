import { WifiOff, Wifi } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useEffect, useState } from 'react'

export default function OfflineNotice() {
    const isOnline = useOnlineStatus()
    const [showReconnected, setShowReconnected] = useState(false)

    useEffect(() => {
        if (isOnline && !showReconnected) {
            // Show reconnection message briefly
            setShowReconnected(true)
            const timer = setTimeout(() => {
                setShowReconnected(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isOnline])

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-3 flex items-center justify-center z-50 shadow-lg"
                >
                    <WifiOff size={20} className="mr-2 animate-pulse" />
                    <span className="text-sm font-medium">
                        You're offline. Some features may be limited.
                    </span>
                </motion.div>
            )}

            {showReconnected && isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="fixed top-0 left-0 right-0 bg-green-600 text-white px-4 py-3 flex items-center justify-center z-50 shadow-lg"
                >
                    <Wifi size={20} className="mr-2" />
                    <span className="text-sm font-medium">
                        Back online! All features restored.
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Alternative version with more details
export function DetailedOfflineNotice() {
    const isOnline = useOnlineStatus()
    const [isMinimized, setIsMinimized] = useState(false)

    if (isOnline) return null

    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 text-white z-50 shadow-lg transition-all ${isMinimized ? 'py-2' : 'py-4'
                }`}
        >
            <div className="container mx-auto px-4">
                {!isMinimized ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-800/30 p-2 rounded-lg">
                                <WifiOff size={24} className="animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-semibold">No Internet Connection</h3>
                                <p className="text-sm text-red-100">
                                    You can still view cached orders, but updates won't sync until you're back online.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="text-red-200 hover:text-white transition-colors"
                        >
                            Minimize
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <WifiOff size={16} />
                            <span className="text-sm">Offline Mode</span>
                        </div>
                        <button
                            onClick={() => setIsMinimized(false)}
                            className="text-red-200 hover:text-white text-sm transition-colors"
                        >
                            Show Details
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}