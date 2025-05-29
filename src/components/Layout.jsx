import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Package, Map, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
    const location = useLocation()
    const { user, logout } = useAuthStore()

    const navigation = [
        { name: 'Dashboard', href: '/', icon: Home },
        { name: 'My Orders', href: '/orders', icon: Package },
        { name: "Today's Route", href: '/today', icon: Map },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-primary-600 text-white">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold">Rider Dashboard</h1>
                        <button onClick={logout}>
                            <LogOut size={20} />
                        </button>
                    </div>
                    <p className="text-sm text-primary-100">{user?.name}</p>
                </div>
            </header>

            <main className="pb-16">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="flex justify-around">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex flex-col items-center py-3 px-4 text-xs ${isActive ? 'text-primary-600' : 'text-gray-500'
                                    }`}
                            >
                                <item.icon size={24} />
                                <span className="mt-1">{item.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
