import { useQuery } from 'react-query'
import { MapPin, Navigation } from 'lucide-react'
import axios from 'axios'

export default function TodayRoute() {
    const { data } = useQuery('today-route',
        async () => {
            const response = await axios.get('/rider/today-route')
            return response.data
        }
    )

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Today's Route</h2>

            <div className="bg-primary-100 p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold text-primary-800">
                    {data?.totalOrders || 0} deliveries for today
                </p>
            </div>

            <div className="space-y-3">
                {data?.orders?.map((order, index) => (
                    <div key={order._id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mr-3">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium">{order.customerInfo.name}</p>
                                    <p className="text-sm text-gray-600">{order.orderNumber}</p>
                                </div>
                            </div>
                            <button className="text-primary-600">
                                <Navigation size={20} />
                            </button>
                        </div>
                        <div className="ml-11">
                            <p className="text-sm text-gray-600 flex items-start">
                                <MapPin size={14} className="mr-1 mt-0.5" />
                                {order.shippingAddress.street}, {order.shippingAddress.city}
                            </p>
                            <p className="text-sm font-medium mt-1">
                                {order.items.length} items • ${order.totalAmount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}