import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Package, CheckCircle, XCircle, Truck, Clock, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { formatCurrency, formatTime } from '../utils/formatters'

export default function Dashboard() {
    const { data: stats, isLoading } = useQuery('rider-dashboard',
        async () => {
            const response = await axios.get('/rider/dashboard')
            return response.data
        },
        {
            refetchInterval: 30000, // Refresh every 30 seconds
        }
    )

    const cards = [
        {
            label: 'Active Deliveries',
            value: stats?.stats?.activeDeliveries || 0,
            icon: Truck,
            color: 'bg-blue-500',
            lightColor: 'bg-blue-100',
            textColor: 'text-blue-600'
        },
        {
            label: 'Completed Today',
            value: stats?.stats?.todayDeliveries || 0,
            icon: CheckCircle,
            color: 'bg-green-500',
            lightColor: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            label: 'Total Delivered',
            value: stats?.stats?.completedDeliveries || 0,
            icon: Package,
            color: 'bg-purple-500',
            lightColor: 'bg-purple-100',
            textColor: 'text-purple-600'
        },
        {
            label: 'Undelivered',
            value: stats?.stats?.undelivered || 0,
            icon: XCircle,
            color: 'bg-red-500',
            lightColor: 'bg-red-100',
            textColor: 'text-red-600'
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <LoadingSpinner size="large" />
            </div>
        )
    }

    const recentOrders = stats?.recentOrders || []
    const hasActiveDeliveries = stats?.stats?.activeDeliveries > 0

    return (
        <div className="p-4 space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
                <p className="text-primary-100">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
                {hasActiveDeliveries && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-3"
                    >
                        <p className="text-sm font-medium">
                            You have {stats.stats.activeDeliveries} active {stats.stats.activeDeliveries === 1 ? 'delivery' : 'deliveries'} to complete
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-lg ${card.lightColor}`}>
                                <card.icon className={`${card.textColor}`} size={24} />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">
                                {card.value}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            {hasActiveDeliveries && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-3"
                >
                    <Link
                        to="/orders?status=shipped"
                        className="bg-primary-600 text-white p-4 rounded-xl text-center font-medium shadow-lg hover:bg-primary-700 transition-colors"
                    >
                        View Active Orders
                    </Link>
                    <Link
                        to="/today"
                        className="bg-white text-primary-600 p-4 rounded-xl text-center font-medium shadow-sm border-2 border-primary-600 hover:bg-primary-50 transition-colors"
                    >
                        Today's Route
                    </Link>
                </motion.div>
            )}

            {/* Performance Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Today's Performance</h3>
                    <TrendingUp className="text-green-600" size={20} />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Delivery Success Rate</span>
                        <span className="font-semibold text-gray-900">
                            {stats?.stats?.todayDeliveries > 0
                                ? `${Math.round((stats.stats.todayDeliveries / (stats.stats.todayDeliveries + stats.stats.undelivered)) * 100)}%`
                                : 'N/A'
                            }
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Delivery Time</span>
                        <span className="font-semibold text-gray-900">~45 mins</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Distance</span>
                        <span className="font-semibold text-gray-900">32.5 km</span>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <Link to="/orders" className="text-sm text-primary-600 font-medium">
                        View all →
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No recent orders"
                        description="Your recent deliveries will appear here"
                    />
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/orders/${order._id}`}
                                    className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">
                                                {order.orderNumber}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.customer?.name || order.customerInfo?.name}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === 'delivered'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'undelivered'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center text-gray-500">
                                            <Clock size={14} className="mr-1" />
                                            {formatTime(order.assignedAt || order.createdAt)}
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(order.totalAmount)}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Motivational Footer */}
            {stats?.stats?.todayDeliveries > 5 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl text-center"
                >
                    <p className="font-semibold">Great job today! 🎉</p>
                    <p className="text-sm text-green-100 mt-1">
                        You've completed {stats.stats.todayDeliveries} deliveries
                    </p>
                </motion.div>
            )}
        </div>
    )
}