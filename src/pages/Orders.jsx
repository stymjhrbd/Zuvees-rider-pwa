import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Orders() {
    const [filter, setFilter] = useState('shipped')

    const { data } = useQuery(['rider-orders', filter],
        async () => {
            const response = await axios.get(`/rider/orders?status=${filter}`)
            return response.data
        }
    )

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">My Orders</h2>

            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setFilter('shipped')}
                    className={`px-3 py-1 rounded ${filter === 'shipped' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
                >
                    Active
                </button>
                <button
                    onClick={() => setFilter('delivered')}
                    className={`px-3 py-1 rounded ${filter === 'delivered' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
                >
                    Completed
                </button>
            </div>

            <div className="space-y-3">
                {data?.orders?.map((order) => (
                    <Link
                        key={order._id}
                        to={`/orders/${order._id}`}
                        className="block bg-white p-4 rounded-lg shadow"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium">{order.orderNumber}</p>
                                <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'undelivered' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            {order.shippingAddress.street}, {order.shippingAddress.city}
                        </p>
                        <p className="text-sm font-medium mt-2">{order.items.length} items • ${order.totalAmount.toFixed(2)}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
