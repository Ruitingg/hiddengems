import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'

const NotificationsPage = () => {
    const navigate = useNavigate()
    const { notifications, loading, muted, markAsRead, markAllAsRead, toggleMute } = useNotifications()

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#0e6b7a] text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#FAFEFE] px-6 pt-6 pb-6 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#0e6b7a] mb-4 text-sm transition"
                >
                    ← Back
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#2d3748]"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Notifications
                    </h1>
                    <button
                        onClick={toggleMute}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                            muted
                                ? 'bg-gray-100 text-gray-500 border-gray-200'
                                : 'bg-white text-[#0e6b7a] border-[#0e6b7a]'
                        }`}
                    >
                        {muted ? '🔕 Muted' : '🔔 On'}
                    </button>
                </div>
            </div>

            <div className="px-6 py-6 max-w-lg mx-auto">
                {notifications.length > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#0e6b7a] font-medium underline mb-4"
                    >
                        Mark all as read
                    </button>
                )}

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <p className="text-3xl mb-3">🔔</p>
                        <p className="text-gray-400 text-sm text-center">
                            No notifications yet.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {notifications.map((notif) => (
                            <button
                                key={notif.id}
                                onClick={() => !notif.read && markAsRead(notif.id)}
                                className={`text-left px-4 py-3 rounded-2xl border transition ${
                                    notif.read
                                        ? 'bg-white border-gray-100'
                                        : 'bg-[#FAFEFE] border-[#0e6b7a]/20'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-[#2d3748] font-medium'}`}>
                                        {notif.message}
                                    </p>
                                    {!notif.read && (
                                        <span className="w-2 h-2 rounded-full bg-[#0e6b7a] flex-shrink-0 mt-1.5" />
                                    )}
                                </div>
                                <p className="text-xs text-gray-300 mt-1">
                                    {new Date(notif.created_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationsPage