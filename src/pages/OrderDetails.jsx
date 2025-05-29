import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { Phone, MapPin, Package, Navigation, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function OrderDetailEnhanced() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [showUndeliveredModal, setShowUndeliveredModal] = useState(false)
    const [undeliveredReason, setUndeliveredReason] = useState('')

    const { data: order, refetch } = useQuery(['rider-order', id],
        async () => {
            const response = await axios.get(`/rider/orders/${id}`)
            return response.data
        }
    )

    const updateStatusMutation = useMutation(
        async ({ status, undeliveredReason }) => {
            const response = await axios.put(`/rider/orders/${id}/status`, { status, undeliveredReason })
            return response.data
        },
        {
            onSuccess: () => {
                toast.success('Order status updated')
                refetch()
                navigate('/orders')
            }
        }
    )

    const commonReasons = [
        'Customer not available',
        'Wrong address',
        'Customer refused delivery',
        'Cannot access building',
        'Payment issue',
        'Other'
    ]

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="p-4 pb-20">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                    }`}>
                    {order.status}
                </span>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <p className="font-medium text-lg">{order.customerInfo.name}</p>
                <div className="mt-3 space-y-2">
                    <a
                        href={`tel:${order.customerInfo.phone}`}
                        className="flex items-center justify-between bg-green-50 text-green-700 p-3 rounded-lg"
                    >
                        <span className="flex items-center">
                            <Phone size={20} className="mr-2" />
                            {order.customerInfo.phone}
                        </span>
                        <span className="text-sm">Tap to call</span>
                    </a>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h3 className="font-semibold mb-3">Delivery Address</h3>
                <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                        <MapPin size={20} className="mr-2 mt-1 text-gray-500 flex-shrink-0" />
                        <div>
                            <p className="font-medium">{order.shippingAddress.street}</p>
                            <p className="text-gray-600">
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                        </div>
                    </div>
                    <button className="ml-4 p-2 bg-primary-100 text-primary-600 rounded-lg">
                        <Navigation size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h3 className="font-semibold mb-3">Order Items ({order.items.length})</h3>
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item._id} className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                            <div className="bg-gray-100 p-2 rounded">
                                <Package size={20} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-gray-600">
                                    {item.variant.color} • {item.variant.size}
                                </p>
                                <p className="text-sm font-medium mt-1">
                                    Qty: {item.quantity} • ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total Amount</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {order.status === 'shipped' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3">
                    <button
                        onClick={() => updateStatusMutation.mutate({ status: 'delivered' })}
                        className="w-full btn btn-primary btn-md py-3 text-lg font-semibold"
                        disabled={updateStatusMutation.isLoading}
                    >
                        Mark as Delivered
                    </button>
                    <button
                        onClick={() => setShowUndeliveredModal(true)}
                        className="w-full btn btn-secondary btn-md py-3"
                        disabled={updateStatusMutation.isLoading}
                    >
                        Unable to Deliver
                    </button>
                </div>
            )}

            {/* Undelivered Modal */}
            <AnimatePresence>
                {showUndeliveredModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
                        onClick={() => setShowUndeliveredModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30 }}
                            className="bg-white rounded-t-2xl w-full max-w-lg p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Reason for Non-Delivery</h3>
                                <button onClick={() => setShowUndeliveredModal(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-2 mb-4">
                                {commonReasons.map((reason) => (
                                    <button
                                        key={reason}
                                        onClick={() => setUndeliveredReason(reason)}
                                        className={`w-full text-left p-3 rounded-lg border transition-colors ${undeliveredReason === reason
                                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>

                            {undeliveredReason === 'Other' && (
                                <textarea
                                    placeholder="Please specify the reason..."
                                    className="w-full p-3 border rounded-lg mb-4"
                                    rows="3"
                                    onChange={(e) => setUndeliveredReason(e.target.value)}
                                />
                            )}

                            <button
                                onClick={() => {
                                    if (undeliveredReason) {
                                        updateStatusMutation.mutate({
                                            status: 'undelivered',
                                            undeliveredReason
                                        })
                                        setShowUndeliveredModal(false)
                                    } else {
                                        toast.error('Please select a reason')
                                    }
                                }}
                                className="w-full btn btn-primary btn-md"
                                disabled={!undeliveredReason || updateStatusMutation.isLoading}
                            >
                                Submit
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}