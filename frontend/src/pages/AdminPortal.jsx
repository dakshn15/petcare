import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import Table from '../components/UI/Table';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import * as dashboardApi from '../api/dashboardApi';
import * as serviceApi from '../api/serviceApi';
import * as bookingApi from '../api/bookingApi';
import * as adoptionApi from '../api/adoptionApi';
import * as reviewApi from '../api/reviewApi';
import * as contactApi from '../api/contactApi';
import * as petApi from '../api/petApi';
import * as userApi from '../api/userApi';
import PageLoader from '../components/UI/PageLoader';

export default function AdminPortal() {
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Active Admin View Tab & Mobile Toggle
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { id: 'users', label: 'User Management', icon: 'fas fa-users' },
    { id: 'services', label: 'Services', icon: 'fas fa-cut' },
    { id: 'bookings', label: 'Bookings', icon: 'fas fa-calendar-check' },
    { id: 'adoptions', label: 'Adoptions', icon: 'fas fa-heart' },
    { id: 'pets', label: 'Pet Inventory', icon: 'fas fa-paw' },
    { id: 'packages', label: 'Pricing Packages', icon: 'fas fa-tags' },
    { id: 'reviews', label: 'Reviews Moderation', icon: 'fas fa-star' },
    { id: 'messages', label: 'Contact Messages', icon: 'fas fa-envelope' },
    { id: 'settings', label: 'Site Settings', icon: 'fas fa-cog' },
  ];

  // Authorization Check
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login?redirect=admin');
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading || !user || !isAdmin) {
    return <PageLoader message="Checking authorization…" />;
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Top Navigation Bar (lg:hidden) */}
      <div className="lg:hidden bg-dark text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0 z-30">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition"
          aria-label="Toggle Navigation Menu"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>

        <span className="text-xs font-bold px-3.5 py-1.5 bg-primary/20 text-primary rounded-full capitalize">
          {navItems.find(i => i.id === activeTab)?.label || activeTab}
        </span>
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <aside
            className="w-72 bg-dark text-white h-full flex flex-col shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary text-xl">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div>
                  <h2 className="font-bold font-quicksand text-base leading-none">Petcare Admin</h2>
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Control Panel</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-sidebar-scrollbar min-h-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition duration-200 ${activeTab === item.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <i className={`${item.icon} text-base`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-800 shrink-0">
              <button
                onClick={async () => {
                  setIsMobileSidebarOpen(false);
                  await logout();
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition"
              >
                <i className="fas fa-sign-out-alt"></i> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Permanent Sidebar (hidden on mobile, flex on lg) */}
      <aside className="hidden lg:flex w-64 bg-dark text-white flex-col shadow-xl shrink-0 h-full">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary text-xl">
              <i className="fas fa-user-shield"></i>
            </div>
            <div>
              <h2 className="font-bold font-quicksand text-base leading-none">Petcare Admin</h2>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Control Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-sidebar-scrollbar min-h-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition duration-200 ${activeTab === item.id
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <i className={`${item.icon} text-base`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition"
          >
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 px-4 py-7 sm:px-6 lg:p-8 overflow-y-auto h-full min-w-0">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'users' && <UsersView />}
        {activeTab === 'services' && <ServicesView />}
        {activeTab === 'packages' && <PackagesView />}
        {activeTab === 'bookings' && <BookingsView />}
        {activeTab === 'adoptions' && <AdoptionsView />}
        {activeTab === 'pets' && <PetsView />}
        {activeTab === 'reviews' && <ReviewsView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEWS
// ─────────────────────────────────────────────────────────────────────────────

function DashboardView() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentAdoptions, setRecentAdoptions] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, chartRes, bookingsRes, adoptionsRes, usersRes] = await Promise.all([
          dashboardApi.getDashboardStats(),
          dashboardApi.getDashboardChart(),
          dashboardApi.getDashboardRecentBookings(),
          dashboardApi.getDashboardRecentAdoptions(),
          dashboardApi.getDashboardRecentUsers()
        ]);
        if (statsRes?.success) setStats(statsRes.data);
        if (chartRes?.success) setChartData(chartRes.data || []);
        if (bookingsRes?.success) setRecentBookings(bookingsRes.data || []);
        if (adoptionsRes?.success) setRecentAdoptions(adoptionsRes.data || []);
        if (usersRes?.success) setRecentUsers(usersRes.data || []);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500 font-medium">Loading Dashboard...</div>;
  }

  // Calculate dynamic SVG chart properties
  const maxVal = Math.max(...chartData.map((d) => d.value), 5);

  const statusBadge = (status) => {
    const colors = {
      'Pending': 'bg-amber-100 text-amber-700',
      'Confirmed': 'bg-blue-100 text-blue-700',
      'Completed': 'bg-emerald-100 text-emerald-700',
      'Cancelled': 'bg-red-100 text-red-700',
      'Under Review': 'bg-amber-100 text-amber-700',
      'Approved': 'bg-emerald-100 text-emerald-700',
      'Rejected': 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn text-sm">
      {/* Header */}
      <div>
        <h1 className="sm:text-3xl text-2xl mb-2">Welcome back, Admin</h1>
        <p className="text-gray-500 text-sm">Here is a summary of all activity across Petcare.</p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: 'fas fa-dollar-sign', color: 'bg-emerald-500 text-white', sub: 'From completed bookings' },
          { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: 'fas fa-calendar-alt', color: 'bg-blue-500 text-white', sub: `${stats?.pendingBookings || 0} pending` },
          { title: 'Total Users', value: stats?.totalUsers || 0, icon: 'fas fa-users', color: 'bg-violet-500 text-white', sub: 'Registered customers' },
          { title: 'Pets Available', value: stats?.totalPets || 0, icon: 'fas fa-paw', color: 'bg-pink-500 text-white', sub: 'For adoption' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white sm:p-5 p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="min-w-0 flex-1 me-2">
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase block mb-1 truncate">{kpi.title}</span>
              <strong className="text-2xl font-bold text-dark block truncate">{kpi.value}</strong>
              <span className="text-[10px] text-gray-400 block truncate">{kpi.sub}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${kpi.color} shadow-sm shrink-0`}>
              <i className={kpi.icon}></i>
            </div>
          </div>
        ))}
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Active Services', value: stats?.totalServices || 0, icon: 'fas fa-cut', color: 'bg-cyan-500 text-white', sub: 'Service offerings' },
          { title: 'Adoption Requests', value: stats?.totalAdoptions || 0, icon: 'fas fa-heart', color: 'bg-rose-500 text-white', sub: `${stats?.pendingAdoptions || 0} under review` },
          { title: 'Pending Reviews', value: stats?.pendingReviews || 0, icon: 'fas fa-star', color: 'bg-amber-500 text-white', sub: `${stats?.totalReviews || 0} total reviews` },
          { title: 'Unread Messages', value: stats?.unreadMessages || 0, icon: 'fas fa-envelope', color: 'bg-indigo-500 text-white', sub: 'From contact form' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white sm:p-5 p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="min-w-0 flex-1 me-2">
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase block mb-1 truncate">{kpi.title}</span>
              <strong className="text-2xl font-bold text-dark block truncate">{kpi.value}</strong>
              <span className="text-[10px] text-gray-400 block truncate">{kpi.sub}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${kpi.color} shadow-sm shrink-0`}>
              <i className={kpi.icon}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart Column */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold font-quicksand text-dark text-lg mb-4 sm:mb-6">Booking Statistics (Last 12 Months)</h3>
          <div className="overflow-x-auto sm:overflow-x-visible pb-2 pt-7">
            <div className="flex-1 flex items-end justify-between h-56 gap-1.5 sm:gap-2 px-2 min-w-[460px] sm:min-w-0 w-full border-b border-l border-gray-100">
              {chartData.map((bar, idx) => {
                const heightPercent = (bar.value / maxVal) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <span className="absolute -top-8 bg-dark text-white text-[11px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 font-bold whitespace-nowrap shadow-lg">
                      {bar.value} Bookings
                    </span>
                    <div
                      style={{ height: `${heightPercent || 4}%` }}
                      className="w-full max-w-[32px] bg-primary/20 group-hover:bg-primary rounded-t-md transition duration-300"
                    ></div>
                    <span className="text-[10px] text-gray-400 font-bold mt-2 whitespace-nowrap">
                      {bar.label.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Donut Chart — Booking Status Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="font-bold font-quicksand text-dark text-lg mb-4 self-start">Booking Status</h3>
          {(() => {
            const pending = stats?.pendingBookings || 0;
            const total = stats?.totalBookings || 0;
            const completed = stats?.completedBookingsCount || 0;
            const confirmed = stats?.confirmedBookings || 0;
            const cancelled = stats?.cancelledBookings || 0;

            const segments = [
              { label: 'Pending', value: pending, color: '#f59e0b' },
              { label: 'Confirmed', value: confirmed, color: '#3b82f6' },
              { label: 'Completed', value: completed, color: '#10b981' },
              { label: 'Cancelled', value: cancelled, color: '#ef4444' },
            ];
            const segTotal = segments.reduce((s, seg) => s + seg.value, 0) || 1;
            const radius = 70;
            const strokeWidth = 22;
            const circumference = 2 * Math.PI * radius;
            let cumulativeOffset = 0;

            return (
              <>
                <div className="relative my-4">
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r={radius} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
                    {segments.map((seg, i) => {
                      const segPercent = seg.value / segTotal;
                      const dashLength = segPercent * circumference;
                      const dashGap = circumference - dashLength;
                      const offset = -cumulativeOffset * circumference + circumference * 0.25;
                      cumulativeOffset += segPercent;
                      if (seg.value === 0) return null;
                      return (
                        <circle
                          key={i}
                          cx="90" cy="90" r={radius}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth={strokeWidth}
                          strokeDasharray={`${dashLength} ${dashGap}`}
                          strokeDashoffset={offset}
                          strokeLinecap="butt"
                          className="transition-all duration-500"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-dark">{total}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">Total Bookings</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 w-full">
                  {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }}></span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-600 font-medium">{seg.label}</span>
                        <span className="text-[10px] text-gray-400 ml-1">({seg.value})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-bold font-quicksand text-dark text-lg">Recent Bookings</h3>
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Latest 5 Bookings</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[550px]">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                <th className="p-4 text-start">Booking ID</th>
                <th className="p-4 text-start">Customer</th>
                <th className="p-4 text-start">Service</th>
                <th className="p-4 text-start">Pet</th>
                <th className="p-4 text-start">Date</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 text-sm">No bookings yet.</td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-dark font-bold">{b.bookingId}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-dark text-xs">{b.user?.name || 'N/A'}</div>
                      <div className="text-[10px] text-gray-400">{b.user?.email || ''}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-medium">{b.serviceLabel || b.service?.name || 'N/A'}</div>
                      {b.service?.price && <div className="text-[10px] text-gray-400">${b.service.price}</div>}
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-medium capitalize">{b.petName}</div>
                      <div className="text-[10px] text-gray-400 capitalize">{b.petType}{b.petSize ? ` • ${b.petSize}` : ''}</div>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      <div>{b.date}</div>
                      <div className="text-[10px] text-gray-400 capitalize">{b.time || 'Flexible'}</div>
                    </td>
                    <td className="p-4 text-center">
                      {statusBadge(b.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Adoptions & Recent Users Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Adoption Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
            <h3 className="font-bold font-quicksand text-dark text-lg">Recent Adoption Requests</h3>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Latest 5</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[550px]">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                  <th className="p-3 text-start">ID</th>
                  <th className="p-3 text-start">Applicant</th>
                  <th className="p-3 text-start">Pet Type</th>
                  <th className="p-3 text-start">Date</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-700">
                {recentAdoptions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">No adoption requests yet.</td>
                  </tr>
                ) : (
                  recentAdoptions.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50 transition">
                      <td className="p-3">
                        <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-dark font-bold">{a.applicationId}</span>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-dark text-xs">{a.user?.name || 'N/A'}</div>
                        <div className="text-[10px] text-gray-400">{a.user?.email || ''}</div>
                      </td>
                      <td className="p-3 text-xs capitalize">{a.petType}{a.breed ? ` • ${a.breed}` : ''}</td>
                      <td className="p-3 text-[10px] text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 text-center">
                        {statusBadge(a.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
            <h3 className="font-bold font-quicksand text-dark text-lg">Recently Registered Users</h3>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Latest 5</span>
          </div>
          <div className="divide-y">
            {recentUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No users registered yet.</div>
            ) : (
              recentUsers.map((u) => (
                <div key={u._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {(u.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-dark text-sm">{u.name}</div>
                    <div className="text-[10px] text-gray-400">{u.email}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-1">{new Date(u.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesView() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const addToast = useToast();

  const emptyForm = {
    name: '',
    value: '',
    price: '',
    icon: 'fas fa-paw',
    description: '',
    tag: 'Grooming',
    duration: '45',
    isActive: true,
    included: [],
    process: [],
    addons: []
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceApi.getAllServicesAdmin({ page, limit: 10 });
      if (res?.success) {
        setServices(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  const openAddModal = () => {
    setCurrentService(null);
    setFormData({ ...emptyForm, included: [], process: [], addons: [] });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      value: service.value,
      price: service.price,
      icon: service.icon || 'fas fa-paw',
      description: service.description,
      tag: service.tag || 'Grooming',
      duration: service.duration || '45',
      isActive: service.isActive !== false,
      included: (service.included || []).map(i => ({ name: i.name, desc: i.desc, icon: i.icon || 'fas fa-check' })),
      process: (service.process || []).map(p => ({ step: p.step, name: p.name, desc: p.desc })),
      addons: (service.addons || []).map(a => ({ addonId: a.addonId, name: a.name, price: a.price, desc: a.desc, icon: a.icon || 'fas fa-plus' }))
    });
    setShowModal(true);
  };

  const addIncluded = () => setFormData({ ...formData, included: [...formData.included, { name: '', desc: '', icon: 'fas fa-check' }] });
  const removeIncluded = (idx) => setFormData({ ...formData, included: formData.included.filter((_, i) => i !== idx) });
  const updateIncluded = (idx, field, val) => {
    const items = [...formData.included];
    items[idx] = { ...items[idx], [field]: val };
    setFormData({ ...formData, included: items });
  };

  const addProcess = () => setFormData({ ...formData, process: [...formData.process, { step: formData.process.length + 1, name: '', desc: '' }] });
  const removeProcess = (idx) => {
    const items = formData.process.filter((_, i) => i !== idx).map((p, i) => ({ ...p, step: i + 1 }));
    setFormData({ ...formData, process: items });
  };
  const updateProcess = (idx, field, val) => {
    const items = [...formData.process];
    items[idx] = { ...items[idx], [field]: val };
    setFormData({ ...formData, process: items });
  };

  const addAddon = () => setFormData({ ...formData, addons: [...formData.addons, { addonId: '', name: '', price: 0, desc: '', icon: 'fas fa-plus' }] });
  const removeAddon = (idx) => setFormData({ ...formData, addons: formData.addons.filter((_, i) => i !== idx) });
  const updateAddon = (idx, field, val) => {
    const items = [...formData.addons];
    items[idx] = { ...items[idx], [field]: val };
    if (field === 'name') items[idx].addonId = val.toLowerCase().replace(/\s+/g, '-');
    setFormData({ ...formData, addons: items });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const generatedSlug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const payload = {
      name: formData.name,
      value: generatedSlug,
      price: parseFloat(formData.price),
      icon: formData.icon,
      description: formData.description,
      tag: formData.tag,
      duration: formData.duration,
      isActive: formData.isActive,
      included: formData.included.filter(i => i.name.trim()),
      process: formData.process.filter(p => p.name.trim()),
      addons: formData.addons.filter(a => a.name.trim()).map(a => ({ ...a, price: parseFloat(a.price) || 0 }))
    };

    try {
      if (currentService) {
        await serviceApi.updateService(currentService._id, payload);
        addToast('Service updated successfully!', 'success');
      } else {
        await serviceApi.createService(payload);
        addToast('Service created successfully!', 'success');
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      addToast(err.message || 'Error saving service.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceApi.deleteService(id);
      addToast('Service deleted successfully!', 'success');
      fetchServices();
    } catch (err) {
      addToast(err.message || 'Error deleting service.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="sm:text-2xl text-xl mb-2">Services Management</h2>
          <p className="text-gray-500 text-sm">Add, modify or delete the grooming services.</p>
        </div>
        <button onClick={openAddModal} className="btn text-sm">
          <i className="fas fa-plus"></i> Add Service
        </button>
      </div>

      <Table
        headers={[
          { label: 'Name' },
          { label: 'Tag' },
          { label: 'Duration' },
          { label: 'Price' },
          { label: 'Status', className: 'text-center' },
          { label: 'Actions', className: 'text-center' }
        ]}
        loading={loading}
        data={services}
        emptyMessage="No services found."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        renderRow={(service) => (
          <tr key={service._id} className="hover:bg-gray-50 transition">
            <td className="p-4 font-semibold text-dark whitespace-nowrap">
              <div className="flex items-center gap-2">
                <i className={`${service.icon || 'fas fa-paw'} text-primary`}></i>
                <span>{service.name}</span>
              </div>
            </td>
            <td className="p-4 whitespace-nowrap">
              <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase whitespace-nowrap inline-block">{service.tag}</span>
            </td>
            <td className="p-4 whitespace-nowrap">{service.duration} mins</td>
            <td className="p-4 font-bold text-secondary whitespace-nowrap">${service.price}</td>
            <td className="p-4 text-center whitespace-nowrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${service.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {service.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="p-4 text-center whitespace-nowrap">
              <div className="flex justify-center gap-2">
                <button onClick={() => openEditModal(service)} className="bg-secondary hover:bg-dark text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm">Edit</button>
                <button onClick={() => handleDelete(service._id)} className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm">Delete</button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Add/Edit Service Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentService ? 'Edit Service' : 'Create New Service'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="p-6 space-y-5 flex-1 text-sm">
            {/* Basic Info Section */}
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Basic Information</h5>
              <div className="pt-2">
                <label className="block font-semibold mb-1 text-gray-700">Service Name *</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Full Service Bath"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Price ($) *</label>
                  <input
                    type="number" required min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="form-input"
                    placeholder="30-60"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Tag</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="form-input"
                    placeholder="Grooming"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Icon Class</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="form-input font-mono text-xs"
                    placeholder="fas fa-paw"
                  />
                </div>
              </div>
              <div className="pt-2">
                <label className="block font-semibold mb-1 text-gray-700">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  rows="3"
                  placeholder="Describe what this service includes..."
                ></textarea>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="service-active-toggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-primary focus:ring-primary w-4 h-4 border-gray-300"
                />
                <label htmlFor="service-active-toggle" className="font-semibold text-gray-700 select-none cursor-pointer">
                  Service is Active
                </label>
              </div>
            </div>

            {/* What's Included Section */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">What's Included</h5>
                <button type="button" onClick={addIncluded} className="text-primary hover:text-dark text-xs font-bold transition flex items-center gap-1">
                  <i className="fas fa-plus text-[10px]"></i> Add Item
                </button>
              </div>
              {formData.included.length === 0 && (
                <p className="text-gray-400 text-xs italic">No included items yet. Click "Add Item" to add one.</p>
              )}
              {formData.included.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateIncluded(idx, 'name', e.target.value)}
                      className="form-input text-xs"
                      placeholder="Feature name"
                    />
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => updateIncluded(idx, 'desc', e.target.value)}
                      className="form-input text-xs"
                      placeholder="Brief description"
                    />
                  </div>
                  <button type="button" onClick={() => removeIncluded(idx)} className="text-red-400 hover:text-red-600 mt-2 transition" title="Remove">
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Process Steps Section */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Process Steps</h5>
                <button type="button" onClick={addProcess} className="text-primary hover:text-dark text-xs font-bold transition flex items-center gap-1">
                  <i className="fas fa-plus text-[10px]"></i> Add Step
                </button>
              </div>
              {formData.process.length === 0 && (
                <p className="text-gray-400 text-xs italic">No process steps yet. Click "Add Step" to add one.</p>
              )}
              {formData.process.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    {step.step}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateProcess(idx, 'name', e.target.value)}
                      className="form-input text-xs"
                      placeholder="Step name"
                    />
                    <input
                      type="text"
                      value={step.desc}
                      onChange={(e) => updateProcess(idx, 'desc', e.target.value)}
                      className="form-input text-xs"
                      placeholder="Step description"
                    />
                  </div>
                  <button type="button" onClick={() => removeProcess(idx)} className="text-red-400 hover:text-red-600 mt-2 transition" title="Remove">
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Add-ons Section */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Add-ons</h5>
                <button type="button" onClick={addAddon} className="text-primary hover:text-dark text-xs font-bold transition flex items-center gap-1">
                  <i className="fas fa-plus text-[10px]"></i> Add Add-on
                </button>
              </div>
              {formData.addons.length === 0 && (
                <p className="text-gray-400 text-xs italic">No add-ons yet. Click "Add Add-on" to add one.</p>
              )}
              {formData.addons.map((addon, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={addon.name}
                      onChange={(e) => updateAddon(idx, 'name', e.target.value)}
                      className="form-input text-xs"
                      placeholder="Add-on name"
                    />
                    <input
                      type="number"
                      value={addon.price}
                      onChange={(e) => updateAddon(idx, 'price', e.target.value)}
                      className="form-input text-xs"
                      placeholder="Price"
                      min="0"
                    />
                    <input
                      type="text"
                      value={addon.desc}
                      onChange={(e) => updateAddon(idx, 'desc', e.target.value)}
                      className="form-input text-xs"
                      placeholder="Description"
                    />
                  </div>
                  <button type="button" onClick={() => removeAddon(idx)} className="text-red-400 hover:text-red-600 mt-2 transition" title="Remove">
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 pt-4 border-t bg-gray-50 flex gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-55 transition text-xs shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-dark transition text-xs shadow-sm"
            >
              {currentService ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function BookingsView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getAllBookings({
        status: statusFilter,
        search: search.trim(),
        page,
        limit: 10
      });
      if (res?.success) {
        setBookings(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleApprove = async (id) => {
    try {
      await bookingApi.approveBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      await bookingApi.completeBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingApi.cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-sm">
      <div>
        <h2 className="sm:text-2xl text-xl mb-2">Bookings Management</h2>
        <p className="text-gray-500 text-sm">Approve, complete, or cancel customers' bookings.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex gap-2">
          {['', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${statusFilter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ID, pet..."
            className="form-input !text-xs !py-1.5 !px-3"
          />
          <button type="submit" className="px-4 py-1.5 bg-dark text-white rounded-full text-xs font-bold hover:bg-gray-800 transition">Search</button>
        </form>
      </div>

      <Table
        headers={[
          { label: 'ID' },
          { label: 'Customer' },
          { label: 'Pet' },
          { label: 'Service' },
          { label: 'Date/Time' },
          { label: 'Status' },
          { label: 'Actions', className: 'text-center' }
        ]}
        loading={loading}
        data={bookings}
        emptyMessage="No bookings found."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        renderRow={(booking) => (
          <tr key={booking._id} className="hover:bg-gray-50">
            <td className="p-4 font-bold text-dark uppercase">{booking.bookingId}</td>
            <td className="p-4">
              <div className="font-semibold">{booking.user?.name || 'Guest'}</div>
              <div className="text-[10px] text-gray-400">{booking.user?.email || 'N/A'}</div>
            </td>
            <td className="p-4 capitalize">{booking.petName} ({booking.petType})</td>
            <td className="p-4 text-gray-600">{booking.serviceLabel}</td>
            <td className="p-4 text-xs font-medium">
              <div>{booking.date}</div>
              <div className="text-gray-400 capitalize">{booking.time}</div>
            </td>
            <td className="p-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                  booking.status === 'Cancelled' ? 'bg-gray-100 text-gray-700' : 'bg-amber-100 text-amber-700'
                }`}>{booking.status}</span>
            </td>
            <td className="p-4 text-center">
              <div className="flex justify-center gap-1.5">
                {booking.status === 'Pending' && (
                  <button onClick={() => handleApprove(booking._id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-bold transition">Approve</button>
                )}
                {booking.status === 'Confirmed' && (
                  <button onClick={() => handleComplete(booking._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold transition">Complete</button>
                )}
                {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                  <button onClick={() => handleCancel(booking._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold transition">Cancel</button>
                )}
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
}

function AdoptionsView() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await adoptionApi.getAllApplications({
        status: statusFilter,
        page,
        limit: 10
      });
      if (res?.success) {
        setApps(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [statusFilter, page]);

  const handleApprove = async (id) => {
    try {
      await adoptionApi.approveApplication(id);
      fetchApps();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this application?')) return;
    try {
      await adoptionApi.rejectApplication(id);
      fetchApps();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-sm">
      <div>
        <h2 className="sm:text-2xl text-xl mb-2">Adoption Applications</h2>
        <p className="text-gray-500 text-sm">Moderate and manage pet adoption requests.</p>
      </div>

      <div className="flex gap-2 bg-white p-4 rounded-2xl border shadow-sm">
        {['', 'Under Review', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${statusFilter === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      <Table
        headers={[
          { label: 'App ID' },
          { label: 'Applicant' },
          { label: 'Pet Requested' },
          { label: 'Reason' },
          { label: 'Status' },
          { label: 'Actions', className: 'text-center' }
        ]}
        loading={loading}
        data={apps}
        emptyMessage="No applications found."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        renderRow={(app) => (
          <tr key={app._id} className="hover:bg-gray-55 transition">
            <td className="p-4 font-bold text-dark uppercase">{app.applicationId}</td>
            <td className="p-4">
              <div className="font-semibold">{app.user?.name || 'N/A'}</div>
              <div className="text-[10px] text-gray-400">{app.user?.phone}</div>
              <div className="text-[10px] text-gray-400">{app.user?.email}</div>
            </td>
            <td className="p-4 capitalize">
              <div className="font-semibold text-primary">{app.petType}</div>
              <div className="text-[10px] text-gray-500">{app.breed || 'Any breed'} • {app.size || 'Medium'}</div>
            </td>
            <td className="p-4 text-xs max-w-xs truncate italic">"{app.reason}"</td>
            <td className="p-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{app.status}</span>
            </td>
            <td className="p-4 text-center">
              {app.status === 'Under Review' ? (
                <div className="flex justify-center gap-1.5">
                  <button onClick={() => handleApprove(app._id)} className="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded text-xs font-bold transition">Approve</button>
                  <button onClick={() => handleReject(app._id)} className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded text-xs font-bold transition">Reject</button>
                </div>
              ) : (
                <span className="text-gray-400 text-xs font-semibold">Processed</span>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
}

function PetsView() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    gender: 'male',
    size: 'medium',
    description: '',
    status: 'Available'
  });

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await petApi.getAllPetsAdmin({ page, limit: 10 });
      if (res?.success) {
        setPets(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [page]);

  const openAddModal = () => {
    setCurrentPet(null);
    setImageFile(null);
    setFormData({
      name: '',
      type: 'dog',
      breed: '',
      age: '2 months',
      gender: 'male',
      size: 'medium',
      description: '',
      status: 'Available'
    });
    setShowModal(true);
  };

  const openEditModal = (pet) => {
    setCurrentPet(pet);
    setImageFile(null);
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      size: pet.size,
      description: pet.description,
      status: pet.status
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(formData).forEach(key => {
      fd.append(key, formData[key]);
    });
    if (imageFile) {
      fd.append('image', imageFile);
    }

    try {
      if (currentPet) {
        await petApi.updatePet(currentPet._id, fd);
      } else {
        await petApi.createPet(fd);
      }
      setShowModal(false);
      fetchPets();
    } catch (err) {
      alert(err.message || 'Error saving pet');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pet?')) return;
    try {
      await petApi.deletePet(id);
      fetchPets();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="sm:text-2xl text-xl mb-2">Pet Inventory</h2>
          <p className="text-gray-500 text-sm">Manage pets listed for adoption.</p>
        </div>
        <button onClick={openAddModal} className="btn text-sm">
          <i className="fas fa-plus"></i> Add Pet
        </button>
      </div>

      <Table
        headers={[
          { label: 'Image' },
          { label: 'Name' },
          { label: 'Breed' },
          { label: 'Age/Gender' },
          { label: 'Status' },
          { label: 'Actions', className: 'text-center' }
        ]}
        loading={loading}
        data={pets}
        emptyMessage="No pets found."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        renderRow={(pet) => (
          <tr key={pet._id} className="hover:bg-gray-55 transition">
            <td className="p-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden border">
                <img src={pet.image || '/assets/images/favicon.png'} alt={pet.name} className="w-full h-full object-cover" />
              </div>
            </td>
            <td className="p-4 font-bold text-dark">{pet.name}</td>
            <td className="p-4 capitalize">{pet.breed} ({pet.type})</td>
            <td className="p-4 text-xs font-medium">
              <div>{pet.age}</div>
              <div className="text-gray-400 capitalize">{pet.gender}</div>
            </td>
            <td className="p-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${pet.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>{pet.status}</span>
            </td>
            <td className="p-4 text-center">
              <div className="flex justify-center gap-2">
                <button onClick={() => openEditModal(pet)} className="bg-secondary hover:bg-dark text-white px-2 py-1 rounded text-xs font-bold transition">Edit</button>
                <button onClick={() => handleDelete(pet._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold transition">Delete</button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentPet ? 'Edit Pet' : 'Add New Pet'}
      >
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="p-6 space-y-4 flex-1 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Buddy"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-input"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Breed *</label>
                <input
                  type="text"
                  required
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="form-input"
                  placeholder="Golden Retriever"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Age *</label>
                <input
                  type="text"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="form-input"
                  placeholder="2 years old"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Gender *</label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="form-input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Size *</label>
                <select
                  required
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="form-input"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-input"
                >
                  <option value="Available">Available</option>
                  <option value="Adopted">Adopted</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-input"
                rows="3"
                placeholder="Lovely dog, fully vaccinated..."
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Pet Image *</label>
              <input
                type="file"
                required
                onChange={(e) => setImageFile(e.target.files[0])}
                className="form-input !py-1.5"
                accept="image/*"
              />
            </div>
          </div>

          <div className="p-6 pt-4 border-t bg-gray-50 flex gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-55 transition text-xs shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-dark transition text-xs shadow-sm"
            >
              Save Pet
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const addToast = useToast();

  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    text: '',
    isApproved: false
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewApi.getAllReviews({ status: filter, page, limit: 10 });
      if (res?.success) {
        setReviews(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter, page]);

  const handleOpenAdd = () => {
    setCurrentReview(null);
    setReviewForm({
      name: '',
      email: '',
      rating: 5,
      text: '',
      isApproved: filter === 'approved'
    });
    setShowReviewModal(true);
  };

  const handleOpenEdit = (review) => {
    setCurrentReview(review);
    setReviewForm({
      name: review.name,
      email: review.email,
      rating: review.rating || 5,
      text: review.text,
      isApproved: review.isApproved !== false
    });
    setShowReviewModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentReview) {
        await reviewApi.updateReview(currentReview._id, reviewForm);
        addToast('Review updated successfully!', 'success');
      } else {
        await reviewApi.createReview(reviewForm);
        addToast('Review created successfully!', 'success');
      }
      setShowReviewModal(false);
      fetchReviews();
    } catch (err) {
      addToast(err.message || 'Error saving review.', 'error');
    }
  };

  const handleApprove = async (id) => {
    try {
      await reviewApi.approveReview(id);
      addToast('Review approved successfully!', 'success');
      fetchReviews();
    } catch (err) {
      addToast(err.message || 'Error approving review.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewApi.deleteReview(id);
      addToast('Review deleted successfully!', 'success');
      fetchReviews();
    } catch (err) {
      addToast(err.message || 'Error deleting review.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-sm">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="sm:text-2xl text-xl mb-2">Reviews Moderation</h2>
          <p className="text-gray-500 text-sm">Moderator controls for user feedback and ratings displayed on homepage.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn text-sm">
          <i className="fas fa-plus"></i> Add Review
        </button>
      </div>

      <div className="flex gap-2 bg-white p-4 rounded-2xl border shadow-sm">
        {['pending', 'approved', 'all'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setFilter(tab); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition capitalize ${filter === tab ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
          >
            {tab === 'all' ? 'All Reviews' : tab === 'pending' ? 'Pending Approval' : 'Approved Reviews'}
          </button>
        ))}
      </div>

      <Table
        headers={[
          { label: 'Name' },
          { label: 'Rating' },
          { label: 'Content' },
          { label: 'Status', className: 'text-center' },
          { label: 'Actions', className: 'text-center' }
        ]}
        loading={loading}
        data={reviews}
        emptyMessage="No reviews found."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        renderRow={(r) => (
          <tr key={r._id} className="hover:bg-gray-55 transition">
            <td className="p-4">
              <div className="font-semibold text-dark">{r.name}</div>
              <div className="text-[10px] text-gray-400">{r.email}</div>
            </td>
            <td className="p-4">
              <div className="flex text-amber-400 gap-0.5 text-xs">
                {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                  <i key={idx} className="fas fa-star"></i>
                ))}
              </div>
            </td>
            <td className="p-4 text-xs italic text-gray-600 max-w-sm break-words">
              "{r.text}"
              <div className="text-[9px] text-gray-400 not-italic mt-1">Submitted: {new Date(r.createdAt).toLocaleDateString()}</div>
            </td>
            <td className="p-4 text-center">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {r.isApproved ? 'Approved' : 'Pending'}
              </span>
            </td>
            <td className="p-4 text-center">
              <div className="flex justify-center gap-2">
                {!r.isApproved && (
                  <button onClick={() => handleApprove(r._id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded text-xs font-bold transition">Approve</button>
                )}
                <button onClick={() => handleOpenEdit(r)} className="bg-secondary hover:bg-dark text-white px-2 py-1 rounded text-xs font-bold transition">Edit</button>
                <button onClick={() => handleDelete(r._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold transition">Delete</button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Add/Edit Review Modal Overlay */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={currentReview ? 'Edit Customer Review' : 'Create Customer Review'}
      >
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="p-6 space-y-4 flex-1 text-sm">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Customer Name *</label>
              <input
                type="text"
                required
                value={reviewForm.name}
                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                className="form-input"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Email Address *</label>
              <input
                type="email"
                required
                value={reviewForm.email}
                onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                className="form-input"
                placeholder="e.g. john@example.com"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Rating *</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) || 5 })}
                className="form-input"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Review Text *</label>
              <textarea
                required
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                className="form-input"
                rows="4"
                placeholder="Write the customer's review here..."
              ></textarea>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="approve-review"
                checked={reviewForm.isApproved}
                onChange={(e) => setReviewForm({ ...reviewForm, isApproved: e.target.checked })}
                className="rounded text-primary focus:ring-primary w-4 h-4 border-gray-300"
              />
              <label htmlFor="approve-review" className="font-semibold text-gray-700 select-none cursor-pointer">
                Approve and Show on Website
              </label>
            </div>
          </div>

          <div className="p-6 pt-4 border-t bg-gray-55 flex gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-55 transition text-xs shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-dark transition text-xs shadow-sm"
            >
              {currentReview ? 'Save Changes' : 'Create Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function MessagesView() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unread');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMsgs = async () => {
    setLoading(true);
    try {
      const res = await contactApi.getMessages({
        status: filter,
        page,
        limit: 10
      });
      if (res?.success) {
        setMsgs(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMsgs();
  }, [filter, page]);

  const handleMarkAsRead = async (id) => {
    try {
      await contactApi.markAsRead(id);
      fetchMsgs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await contactApi.deleteMessage(id);
      fetchMsgs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-sm">
      <div>
        <h2 className="sm:text-2xl text-xl mb-2">Contact Messages</h2>
        <p className="text-gray-500 text-sm">Read and moderate client messages.</p>
      </div>

      <div className="flex gap-2 bg-white p-4 rounded-2xl border shadow-sm">
        <button
          onClick={() => {
            setFilter('unread');
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${filter === 'unread' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
        >
          Unread Messages
        </button>
        <button
          onClick={() => {
            setFilter('read');
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${filter === 'read' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
        >
          Read Messages
        </button>
      </div>

      <Table
        headers={[
          { label: 'Sender' },
          { label: 'Subject' },
          { label: 'Message' },
          { label: 'Actions', className: 'text-center' }
        ]}
        loading={loading}
        data={msgs}
        emptyMessage="No messages found."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        renderRow={(m) => (
          <tr key={m._id} className="hover:bg-gray-55 transition">
            <td className="p-4">
              <div className="font-semibold text-dark">{m.name}</div>
              <div className="text-[10px] text-gray-400">{m.email}</div>
            </td>
            <td className="p-4 font-semibold text-gray-700">{m.subject}</td>
            <td className="p-4 text-xs text-gray-600 max-w-sm break-words">{m.message}</td>
            <td className="p-4 text-center">
              <div className="flex justify-center gap-2">
                {!m.isRead && (
                  <button onClick={() => handleMarkAsRead(m._id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-bold transition">Mark Read</button>
                )}
                <button onClick={() => handleDelete(m._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold transition">Delete</button>
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
}

function PackagesView() {
  const [packages, setPackages] = useState([]);
  const [fullSettings, setFullSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null: closed, -1: new, index: editing
  const [pkgEdit, setPkgEdit] = useState({ name: '', desc: '', price: 0, icon: 'fas fa-star', features: [], popular: false });
  const [newFeatureText, setNewFeatureText] = useState('');
  const addToast = useToast();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await contactApi.getSettings();
      if (res?.success && res.data) {
        setFullSettings(res.data);
        setPackages(res.data.packages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSavePackageList = async (updatedList) => {
    setSaving(true);
    try {
      const res = await contactApi.updateSettings({ ...fullSettings, packages: updatedList });
      if (res?.success) {
        setPackages(updatedList);
        setFullSettings(res.data || { ...fullSettings, packages: updatedList });
        addToast('Pricing packages updated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update packages.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAddPkg = () => {
    setPkgEdit({ name: '', desc: '', price: 50, icon: 'fas fa-star', features: [], popular: false, btnText: 'Select Package' });
    setNewFeatureText('');
    setEditingIndex(-1);
  };

  const handleOpenEditPkg = (pkg, idx) => {
    setPkgEdit({ ...pkg });
    setNewFeatureText('');
    setEditingIndex(idx);
  };

  const handleDeletePkg = async (idx) => {
    if (!window.confirm('Are you sure you want to delete this pricing package?')) return;
    const updated = packages.filter((_, i) => i !== idx);
    await handleSavePackageList(updated);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!pkgEdit.name.trim()) return addToast('Package name is required', 'error');

    const updated = [...packages];
    if (editingIndex === -1) {
      updated.push(pkgEdit);
    } else {
      updated[editingIndex] = pkgEdit;
    }

    setEditingIndex(null);
    await handleSavePackageList(updated);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 font-medium">Loading pricing packages...</div>;
  }

  return (
    <div className="animate-fadeIn space-y-6 text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="sm:text-2xl text-xl mb-2">Pricing Packages Management</h2>
          <p className="text-gray-500 text-sm">Create, edit, or remove membership tiers and pricing packages shown on the Pricing page.</p>
        </div>
        <button
          onClick={handleOpenAddPkg}
          className="btn px-5 py-2.5 shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <i className="fas fa-plus"></i>
          <span>Add Pricing Package</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
        {packages.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border text-center text-gray-400 italic">
            No pricing packages configured yet. Click "Add Pricing Package" above to create one.
          </div>
        ) : (
          packages.map((pkg, idx) => (
            <div key={idx} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 relative">
              {pkg.popular && (
                <div className="absolute -top-3 right-4 bg-primary text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Most Popular
                </div>
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-lg shrink-0">
                    <i className={pkg.icon || 'fas fa-star'}></i>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-dark">{pkg.name}</h3>
                    <div className="text-xl font-bold text-secondary">${pkg.price}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 min-h-[36px] mt-1">{pkg.desc}</p>

                <div className="mt-4 pt-3 border-t space-y-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Features Included ({pkg.features?.length || 0})</div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {pkg.features?.map((f, fIdx) => (
                      <div key={fIdx} className="text-xs text-gray-700 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-500 text-xs"></i>
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                    {(!pkg.features || pkg.features.length === 0) && (
                      <div className="text-xs text-gray-400 italic">No features listed.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => handleOpenEditPkg(pkg, idx)}
                  disabled={saving}
                  className="flex-1 py-2 bg-secondary hover:bg-dark text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePkg(idx)}
                  disabled={saving}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Package Edit / Add Modal */}
      <Modal
        isOpen={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        title={editingIndex === -1 ? 'Add Pricing Package' : 'Edit Pricing Package'}
      >
        <form onSubmit={handleModalSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="p-6 space-y-4 flex-1 text-sm">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Package Name *</label>
              <input
                type="text"
                required
                value={pkgEdit.name}
                onChange={(e) => setPkgEdit({ ...pkgEdit, name: e.target.value })}
                className="form-input"
                placeholder="e.g. Premium Package"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Description *</label>
              <input
                type="text"
                required
                value={pkgEdit.desc}
                onChange={(e) => setPkgEdit({ ...pkgEdit, desc: e.target.value })}
                className="form-input"
                placeholder="e.g. Enhanced grooming experience"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Button Label</label>
              <input
                type="text"
                value={pkgEdit.btnText || ''}
                onChange={(e) => setPkgEdit({ ...pkgEdit, btnText: e.target.value })}
                className="form-input"
                placeholder="e.g. Choose Premium (Default: Select [Package Name])"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Price ($) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={pkgEdit.price}
                  onChange={(e) => setPkgEdit({ ...pkgEdit, price: parseFloat(e.target.value) || 0 })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Icon Class *</label>
                <input
                  type="text"
                  required
                  value={pkgEdit.icon}
                  onChange={(e) => setPkgEdit({ ...pkgEdit, icon: e.target.value })}
                  className="form-input font-mono text-xs"
                  placeholder="e.g. fas fa-star"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="popular-pkg-modal"
                checked={pkgEdit.popular}
                onChange={(e) => setPkgEdit({ ...pkgEdit, popular: e.target.checked })}
                className="rounded text-primary focus:ring-primary w-4 h-4 border-gray-300 cursor-pointer"
              />
              <label htmlFor="popular-pkg-modal" className="font-semibold text-gray-700 select-none cursor-pointer">
                Mark as Most Popular Tier
              </label>
            </div>

            <div className="pt-2 border-t">
              <label className="block font-semibold mb-2 text-gray-700">Package Features</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  className="form-input"
                  placeholder="Add feature (e.g. Nail trimming)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newFeatureText.trim()) {
                        setPkgEdit({ ...pkgEdit, features: [...(pkgEdit.features || []), newFeatureText.trim()] });
                        setNewFeatureText('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newFeatureText.trim()) {
                      setPkgEdit({ ...pkgEdit, features: [...(pkgEdit.features || []), newFeatureText.trim()] });
                      setNewFeatureText('');
                    }
                  }}
                  className="px-4 py-2 bg-secondary hover:bg-dark text-white font-bold rounded-xl transition text-xs shrink-0"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {pkgEdit.features &&
                  pkgEdit.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border text-xs">
                      <span className="font-medium text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...pkgEdit.features];
                          updated.splice(fIdx, 1);
                          setPkgEdit({ ...pkgEdit, features: updated });
                        }}
                        className="text-red-500 hover:text-red-700 text-xs transition"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                {(!pkgEdit.features || pkgEdit.features.length === 0) && (
                  <div className="text-xs text-gray-400 italic">No features added yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-4 border-t bg-gray-50 flex gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition text-xs shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-dark transition text-xs shadow-sm"
            >
              {saving ? 'Saving...' : 'Save Package'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function SettingsView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('branding');
  const addToast = useToast();

  const [formData, setFormData] = useState({
    siteName: 'Petcare',
    businessName: 'Petcare',
    tagline: 'Caring for your furry friends with love and professional expertise',
    logo: '/assets/images/logo.png',
    favicon: '/assets/images/favicon.png',
    phone: '',
    email: '',
    address: '',
    workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    heroText: '',
    aboutText: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: ''
    },
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await contactApi.getSettings();
        if (res?.success && res.data) {
          const d = res.data;
          setFormData({
            siteName: d.siteName || 'Petcare',
            businessName: d.businessName || 'Petcare',
            tagline: d.tagline || 'Caring for your furry friends with love and professional expertise',
            logo: d.logo || '/assets/images/logo.png',
            favicon: d.favicon || '/assets/images/favicon.png',
            phone: d.phone || '',
            email: d.email || '',
            address: d.address || '',
            workingHours: d.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM',
            heroText: d.heroText || '',
            aboutText: d.aboutText || '',
            socialLinks: {
              facebook: d.socialLinks?.facebook || '',
              instagram: d.socialLinks?.instagram || '',
              twitter: d.socialLinks?.twitter || '',
              youtube: d.socialLinks?.youtube || '',
              linkedin: d.socialLinks?.linkedin || ''
            },
            metaTitle: d.metaTitle || 'Petcare - Premium Pet Care & Grooming Services',
            metaDescription: d.metaDescription || 'Best pet care, grooming, and adoption platform.',
            metaKeywords: d.metaKeywords || 'petcare, grooming, pet adoption, dog wash, cat styling'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return addToast('Logo image must be under 2MB', 'error');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result }));
        addToast('Logo updated! Click "Save All Settings" to apply.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        return addToast('Favicon image must be under 1MB', 'error');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, favicon: reader.result }));
        addToast('Favicon updated! Click "Save All Settings" to apply.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await contactApi.updateSettings(formData);
      if (res?.success) {
        addToast('Website settings saved successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 font-medium">Loading website settings...</div>;
  }

  return (
    <div className="animate-fadeIn space-y-6 text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="sm:text-2xl text-xl mb-2">Site Settings & Customization</h2>
          <p className="text-gray-500 text-sm">Manage website branding, logos, contacts, social media, and SEO meta tags.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn px-6 py-2.5 shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          {saving ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-save"></i>}
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'branding', label: 'Branding & Logos', icon: 'fas fa-paint-brush' },
          { id: 'contact', label: 'Contacts & Location', icon: 'fas fa-building' },
          { id: 'social', label: 'Social Links', icon: 'fas fa-share-alt' },
          { id: 'seo', label: 'SEO & Metadata', icon: 'fas fa-search' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSettingsTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeSettingsTab === tab.id
              ? 'bg-primary text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-dark'
              }`}
          >
            <i className={tab.icon}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: Branding & Logos */}
        {activeSettingsTab === 'branding' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-150 space-y-5">
              <h4 className="font-bold text-dark text-base border-b pb-3 flex items-center gap-2">
                <i className="fas fa-id-card text-primary"></i> Site Identity & Names
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Site Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="form-input"
                    placeholder="Petcare"
                  />
                  <span className="text-[10px] text-gray-400">Appears in header title and browser tab.</span>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="form-input"
                    placeholder="Petcare Management System"
                  />
                  <span className="text-[10px] text-gray-400">Official registered business or brand title.</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700">Brand Tagline / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="form-input"
                  placeholder="Caring for your furry friends with love and professional expertise"
                />
              </div>
            </div>

            {/* Logo & Favicon Upload Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Card */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-150 space-y-4">
                <h4 className="font-bold text-dark text-base flex items-center gap-2">
                  <i className="fas fa-image text-primary"></i> Website Logo
                </h4>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-white rounded-lg border p-1 flex items-center justify-center shrink-0 shadow-sm">
                    <img
                      src={formData.logo || '/assets/images/logo.png'}
                      alt="Logo Preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => { e.target.src = '/assets/images/logo.png'; }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold text-xs text-gray-700">Main Brand Logo</div>
                    <div className="text-[10px] text-gray-400">PNG, SVG, or JPG (Recommended: 200x50px)</div>
                    <label className="inline-block px-3 py-1 bg-secondary hover:bg-dark text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-sm">
                      Upload Logo
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-xs text-gray-600">Logo Image URL / Path</label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="form-input font-mono text-xs"
                    placeholder="/assets/images/logo.png"
                  />
                </div>
              </div>

              {/* Favicon Card */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-150 space-y-4">
                <h4 className="font-bold text-dark text-base flex items-center gap-2">
                  <i className="fas fa-icons text-primary"></i> Website Favicon
                </h4>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-white rounded-lg border p-2 flex items-center justify-center shrink-0 shadow-sm">
                    <img
                      src={formData.favicon || '/assets/images/favicon.png'}
                      alt="Favicon Preview"
                      className="w-8 h-8 object-contain"
                      onError={(e) => { e.target.src = '/assets/images/favicon.png'; }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold text-xs text-gray-700">Browser Icon (Favicon)</div>
                    <div className="text-[10px] text-gray-400">ICO, PNG (Recommended: 32x32px square)</div>
                    <label className="inline-block px-3 py-1 bg-secondary hover:bg-dark text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-sm">
                      Upload Favicon
                      <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-xs text-gray-600">Favicon Image URL / Path</label>
                  <input
                    type="text"
                    value={formData.favicon}
                    onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                    className="form-input font-mono text-xs"
                    placeholder="/assets/images/favicon.png"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contacts & Location */}
        {activeSettingsTab === 'contact' && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-150 space-y-5 animate-fadeIn">
            <h4 className="font-bold text-dark text-base border-b pb-3 flex items-center gap-2">
              <i className="fas fa-headset text-primary"></i> Contact & Operating Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Contact Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="info@petcare.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Business Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-input"
                  placeholder="168/170, Avenue 01, Mirpur DOHS, India"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Working Hours</label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="form-input"
                  placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                />
              </div>
            </div>

            <div className="pt-2 border-t space-y-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Homepage Hero Text</label>
                <input
                  type="text"
                  value={formData.heroText}
                  onChange={(e) => setFormData({ ...formData, heroText: e.target.value })}
                  className="form-input"
                  placeholder="Provide Attention and Care for all the Pets."
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">About Us Summary Text</label>
                <textarea
                  rows="3"
                  value={formData.aboutText}
                  onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                  className="form-input"
                  placeholder="Ensure every pet receives proper attention and care..."
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Social Links */}
        {activeSettingsTab === 'social' && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-150 space-y-4 animate-fadeIn">
            <h4 className="font-bold text-dark text-base border-b pb-3 flex items-center gap-2">
              <i className="fas fa-globe text-primary"></i> Official Social Media Channels
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                  <i className="fab fa-facebook text-blue-600"></i> Facebook Page URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                  className="form-input"
                  placeholder="https://facebook.com/petcare"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                  <i className="fab fa-instagram text-pink-600"></i> Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                  className="form-input"
                  placeholder="https://instagram.com/petcare"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                  <i className="fab fa-twitter text-sky-500"></i> Twitter / X URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                  className="form-input"
                  placeholder="https://x.com/petcare"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                  <i className="fab fa-youtube text-red-600"></i> YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, youtube: e.target.value } })}
                  className="form-input"
                  placeholder="https://youtube.com/@petcare"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700 flex items-center gap-2">
                  <i className="fab fa-linkedin text-blue-700"></i> LinkedIn Company URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                  className="form-input"
                  placeholder="https://linkedin.com/company/petcare"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: SEO & Metadata */}
        {activeSettingsTab === 'seo' && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-150 space-y-4 animate-fadeIn">
            <h4 className="font-bold text-dark text-base border-b pb-3 flex items-center gap-2">
              <i className="fas fa-search text-primary"></i> Search Engine Optimization (SEO) & Meta Data
            </h4>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Default Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="form-input"
                placeholder="Petcare - Premium Pet Care & Grooming Services"
              />
              <span className="text-[10px] text-gray-400">Shown in search result headers. Recommended: 50-60 characters.</span>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Meta Description</label>
              <textarea
                rows="3"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="form-input"
                placeholder="Best pet care, grooming, and adoption platform for dogs, cats, and pets."
              ></textarea>
              <span className="text-[10px] text-gray-400">Snippet shown in search engine listings. Recommended: 150-160 characters.</span>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Meta Keywords (Comma Separated)</label>
              <input
                type="text"
                value={formData.metaKeywords}
                onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                className="form-input"
                placeholder="petcare, grooming, pet adoption, dog wash, cat styling"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUsers({
        page,
        limit: 10,
        search: search.trim(),
        role: roleFilter
      });
      if (res?.success) {
        setUsers(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openAddModal = () => {
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'customer'
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      role: user.role
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await userApi.updateUser(currentUser._id, {
          name: formData.name,
          phone: formData.phone,
          role: formData.role
        });
      } else {
        await userApi.createUser(formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Error saving user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      const res = await userApi.deleteUser(id);
      if (res?.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Error deleting user');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="sm:text-2xl text-xl mb-2">User Management</h2>
          <p className="text-gray-500 text-sm">View, update, or remove registered accounts.</p>
        </div>
        <button onClick={openAddModal} className="btn text-sm">
          <i className="fas fa-plus"></i> Add User
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex gap-2">
          {['', 'customer', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => {
                setRoleFilter(role);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition capitalize ${roleFilter === role
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {role || 'All Roles'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="form-input !text-xs !py-1.5 !px-3"
          />
          <button type="submit" className="px-4 py-1.5 bg-dark text-white rounded-full text-xs font-bold hover:bg-gray-800 transition">Search</button>
        </form>
      </div>

      <Table
        headers={[
          { label: 'User' },
          { label: 'Contact' },
          { label: 'Role' },
          { label: 'Joined Date' },
          { label: 'Actions', className: 'text-center' }
        ]}
        loading={loading}
        data={users}
        emptyMessage="No users found."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        renderRow={(u) => (
          <tr key={u._id} className="hover:bg-gray-55 transition">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-dark">{u.name}</div>
                  <div className="text-[10px] text-gray-400">{u.email}</div>
                </div>
              </div>
            </td>
            <td className="p-4">
              <div className="text-xs font-medium text-gray-600">{u.phone || 'N/A'}</div>
            </td>
            <td className="p-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                }`}>{u.role}</span>
            </td>
            <td className="p-4 text-xs font-medium text-gray-500">
              {new Date(u.createdAt).toLocaleDateString()}
            </td>
            <td className="p-4 text-center">
              <div className="flex justify-center gap-2">
                <button onClick={() => openEditModal(u)} className="bg-secondary hover:bg-dark text-white px-2 py-1 rounded text-xs font-bold transition">Edit</button>
                <button onClick={() => handleDelete(u._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold transition">Delete</button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentUser ? 'Edit User Account' : 'Create New User'}
      >
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="p-6 space-y-4 flex-1 text-sm">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="form-input"
              />
            </div>

            {!currentUser && (
              <>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 555-123-4567"
                className="form-input"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Access Level / Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-input"
              >
                <option value="customer">Customer (Standard Access)</option>
                <option value="admin">Administrator (Full Access)</option>
              </select>
            </div>
          </div>

          <div className="p-6 pt-4 border-t bg-gray-55 flex gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-55 transition text-xs shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-dark transition text-xs shadow-sm"
            >
              {currentUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

