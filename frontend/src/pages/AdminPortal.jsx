import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as dashboardApi from '../api/dashboardApi';
import * as serviceApi from '../api/serviceApi';
import * as bookingApi from '../api/bookingApi';
import * as adoptionApi from '../api/adoptionApi';
import * as reviewApi from '../api/reviewApi';
import * as contactApi from '../api/contactApi';
import * as petApi from '../api/petApi';
import * as userApi from '../api/userApi';

export default function AdminPortal() {
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Authorization Check
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login?redirect=admin');
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        <div className="text-center">
          <i className="fas fa-spinner animate-spin text-4xl text-primary mb-4"></i>
          <p className="font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-dark text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
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

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
            { id: 'users', label: 'User Management', icon: 'fas fa-users' },
            { id: 'services', label: 'Services', icon: 'fas fa-cut' },
            { id: 'bookings', label: 'Bookings', icon: 'fas fa-calendar-check' },
            { id: 'adoptions', label: 'Adoptions', icon: 'fas fa-heart' },
            { id: 'pets', label: 'Pet Inventory', icon: 'fas fa-paw' },
            { id: 'reviews', label: 'Reviews Moderation', icon: 'fas fa-star' },
            { id: 'messages', label: 'Contact Messages', icon: 'fas fa-envelope' },
            { id: 'settings', label: 'Site Settings', icon: 'fas fa-cog' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition duration-200 ${
                activeTab === item.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <i className={`${item.icon} text-base`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition"
          >
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'users' && <UsersView />}
        {activeTab === 'services' && <ServicesView />}
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
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, actRes, chartRes] = await Promise.all([
          dashboardApi.getDashboardStats(),
          dashboardApi.getDashboardActivities({ limit: 8 }),
          dashboardApi.getDashboardChart()
        ]);
        if (statsRes?.success) setStats(statsRes.data);
        if (actRes?.success) setActivities(actRes.data || []);
        if (chartRes?.success) setChartData(chartRes.data || []);
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-quicksand text-dark mb-1">Welcome back, Admin</h1>
        <p className="text-gray-500 text-sm">Here is a summary of the activity across Petcare today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Revenue', value: `$${stats?.totalRevenue || 0}`, icon: 'fas fa-dollar-sign', color: 'bg-emerald-500 text-white' },
          { title: 'Pending Bookings', value: stats?.pendingBookings || 0, icon: 'fas fa-calendar-alt', color: 'bg-amber-500 text-white' },
          { title: 'Active Services', value: stats?.totalServices || 0, icon: 'fas fa-cut', color: 'bg-blue-500 text-white' },
          { title: 'Pets Available', value: stats?.totalPets || 0, icon: 'fas fa-paw', color: 'bg-pink-500 text-white' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase block mb-1">{kpi.title}</span>
              <strong className="text-2xl font-bold text-dark">{kpi.value}</strong>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${kpi.color}`}>
              <i className={kpi.icon}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SVG Chart Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold font-quicksand text-dark text-lg mb-6">Booking Statistics (Last 12 Months)</h3>
          <div className="flex-1 flex items-end justify-between h-64 gap-2 pt-4 px-2 border-b border-l border-gray-100">
            {chartData.map((bar, idx) => {
              const heightPercent = (bar.value / maxVal) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-2 bg-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none z-10 font-bold whitespace-nowrap">
                    {bar.value} Bookings
                  </span>
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent || 4}%` }}
                    className="w-full max-w-[32px] bg-primary/20 group-hover:bg-primary rounded-t-md transition duration-300"
                  ></div>
                  {/* Label */}
                  <span className="text-[10px] text-gray-400 font-bold mt-2 rotate-45 origin-left whitespace-nowrap">
                    {bar.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed Column */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold font-quicksand text-dark text-lg mb-6">Recent Activity Feed</h3>
          {activities.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No recent activities.</div>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {activities.map((act) => (
                <div key={act._id} className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0">
                    <i className={
                      act.action === 'LOGIN' ? 'fas fa-sign-in-alt' :
                      act.action.includes('BOOKING') ? 'fas fa-calendar-check' :
                      act.action.includes('ADOPTION') ? 'fas fa-heart' :
                      act.action.includes('SERVICE') ? 'fas fa-cut' : 'fas fa-info-circle'
                    }></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 leading-tight font-medium break-words">{act.details}</p>
                    <span className="text-[10px] text-gray-400 font-semibold">{new Date(act.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServicesView() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null); // null for add, object for edit

  const [formData, setFormData] = useState({
    name: '',
    value: '',
    price: '',
    description: '',
    tag: '',
    duration: '',
    includedText: '',
    addonsText: ''
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceApi.getAllServicesAdmin();
      if (res?.success) {
        setServices(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setCurrentService(null);
    setFormData({
      name: '',
      value: '',
      price: '',
      description: '',
      tag: 'Grooming',
      duration: '45',
      includedText: '',
      addonsText: ''
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setCurrentService(service);
    // Format arrays of objects to simple multiline JSON or string representation
    const includedText = (service.included || []).map(i => `${i.name}|${i.desc}`).join('\n');
    const addonsText = (service.addons || []).map(a => `${a.name}|${a.price}|${a.desc}`).join('\n');

    setFormData({
      name: service.name,
      value: service.value,
      price: service.price,
      description: service.description,
      tag: service.tag || 'Grooming',
      duration: service.duration || '45',
      includedText,
      addonsText
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Map string fields back to arrays of objects
    const included = formData.includedText.split('\n').filter(line => line.includes('|')).map(line => {
      const [name, desc] = line.split('|');
      return { name: name.trim(), desc: desc.trim(), icon: 'fas fa-check-circle' };
    });

    const addons = formData.addonsText.split('\n').filter(line => line.includes('|')).map(line => {
      const [name, price, desc] = line.split('|');
      return {
        addonId: name.toLowerCase().replace(/\s+/g, '-'),
        name: name.trim(),
        price: parseFloat(price) || 0,
        desc: (desc || '').trim(),
        icon: 'fas fa-plus-circle'
      };
    });

    const payload = {
      name: formData.name,
      value: formData.value,
      price: parseFloat(formData.price),
      description: formData.description,
      tag: formData.tag,
      duration: formData.duration,
      included,
      addons
    };

    try {
      if (currentService) {
        await serviceApi.updateService(currentService._id, payload);
      } else {
        await serviceApi.createService(payload);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      alert(err.message || 'Error saving service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceApi.deleteService(id);
      fetchServices();
    } catch (err) {
      alert(err.message || 'Error deleting service');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-dark">Services Management</h2>
          <p className="text-gray-500 text-sm">Add, modify or delete the grooming services.</p>
        </div>
        <button onClick={openAddModal} className="btn text-sm">
          <i className="fas fa-plus"></i> Add Service
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                <th className="p-4 text-start">Name</th>
                <th className="p-4 text-start">Slug</th>
                <th className="p-4 text-start">Tag</th>
                <th className="p-4 text-start">Duration</th>
                <th className="p-4 text-start">Price</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">Loading services...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">No services found.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-dark">{service.name}</td>
                    <td className="p-4 text-gray-500">{service.value}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase">{service.tag}</span>
                    </td>
                    <td className="p-4">{service.duration} mins</td>
                    <td className="p-4 font-bold text-secondary">${service.price}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(service)} className="text-blue-500 hover:text-blue-700 text-xs font-bold">Edit</button>
                        <button onClick={() => handleDelete(service._id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <h4 className="text-xl font-bold font-quicksand text-dark mb-4">{currentService ? 'Edit Service' : 'Add New Service'}</h4>
            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Full Service Bath"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="form-input"
                    placeholder="full-bath"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Price *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Duration (mins)</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="form-input"
                    placeholder="45-60"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Tag</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="form-input"
                    placeholder="Premium Care"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  rows="3"
                  placeholder="Service description..."
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">What's Included (Name|Description per line)</label>
                <textarea
                  value={formData.includedText}
                  onChange={(e) => setFormData({ ...formData, includedText: e.target.value })}
                  className="form-input font-mono text-xs"
                  rows="3"
                  placeholder="Premium Shampoo|Organic shampoo for coat types&#10;Nail Trimming|Professional nail trim"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Add-ons (Name|Price|Description per line)</label>
                <textarea
                  value={formData.addonsText}
                  onChange={(e) => setFormData({ ...formData, addonsText: e.target.value })}
                  className="form-input font-mono text-xs"
                  rows="3"
                  placeholder="Teeth Cleaning|20|Enzymatic dental rinse&#10;Paw Massage|10|Relaxing massage"
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-dark transition text-sm"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingsView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getAllBookings({ status: statusFilter, search });
      if (res?.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
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
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold font-quicksand text-dark">Bookings Management</h2>
        <p className="text-gray-500 text-sm">Approve, complete, or cancel customers' bookings.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex gap-2">
          {['', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                statusFilter === status
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                <th className="p-4 text-start">ID</th>
                <th className="p-4 text-start">Customer</th>
                <th className="p-4 text-start">Pet</th>
                <th className="p-4 text-start">Service</th>
                <th className="p-4 text-start">Date/Time</th>
                <th className="p-4 text-start">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        booking.status === 'Cancelled' ? 'bg-gray-100 text-gray-700' : 'bg-amber-100 text-amber-700'
                      }`}>{booking.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        {booking.status === 'Pending' && (
                          <button onClick={() => handleApprove(booking._id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Approve</button>
                        )}
                        {booking.status === 'Confirmed' && (
                          <button onClick={() => handleComplete(booking._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">Complete</button>
                        )}
                        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                          <button onClick={() => handleCancel(booking._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdoptionsView() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await adoptionApi.getAllApplications({ status: statusFilter });
      if (res?.success) {
        setApps(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [statusFilter]);

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
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold font-quicksand text-dark">Adoption Applications</h2>
        <p className="text-gray-500 text-sm">Moderate and manage pet adoption requests.</p>
      </div>

      <div className="flex gap-2 bg-white p-4 rounded-2xl border shadow-sm">
        {['', 'Under Review', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              statusFilter === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                <th className="p-4 text-start">App ID</th>
                <th className="p-4 text-start">Applicant</th>
                <th className="p-4 text-start">Pet Requested</th>
                <th className="p-4 text-start">Reason</th>
                <th className="p-4 text-start">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">Loading applications...</td>
                </tr>
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">No applications found.</td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{app.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      {app.status === 'Under Review' ? (
                        <div className="flex justify-center gap-1.5">
                          <button onClick={() => handleApprove(app._id)} className="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded text-xs font-bold">Approve</button>
                          <button onClick={() => handleReject(app._id)} className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded text-xs font-bold">Reject</button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs font-semibold">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PetsView() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [imageFile, setImageFile] = useState(null);

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
      const res = await petApi.getAllPetsAdmin();
      if (res?.success) {
        setPets(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-dark">Pet Inventory</h2>
          <p className="text-gray-500 text-sm">Manage pets listed for adoption.</p>
        </div>
        <button onClick={openAddModal} className="btn text-sm">
          <i className="fas fa-plus"></i> Add Pet
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                <th className="p-4 text-start">Image</th>
                <th className="p-4 text-start">Name</th>
                <th className="p-4 text-start">Breed</th>
                <th className="p-4 text-start">Age/Gender</th>
                <th className="p-4 text-start">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">Loading pets...</td>
                </tr>
              ) : pets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">No pets found.</td>
                </tr>
              ) : (
                pets.map((pet) => (
                  <tr key={pet._id} className="hover:bg-gray-50">
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        pet.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>{pet.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(pet)} className="text-blue-500 hover:text-blue-700 text-xs font-bold">Edit</button>
                        <button onClick={() => handleDelete(pet._id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <h4 className="text-xl font-bold font-quicksand text-dark mb-4">{currentPet ? 'Edit Pet' : 'Add New Pet'}</h4>
            <form onSubmit={handleSave} className="space-y-4 text-sm">
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
                  <label className="block font-semibold mb-1 text-gray-700">Age</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="form-input"
                    placeholder="2 years old"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="form-input"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Size</label>
                  <select
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
                  <label className="block font-semibold mb-1 text-gray-700">Status</label>
                  <select
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
                <label className="block font-semibold mb-1 text-gray-700">Pet Image File</label>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="form-input !py-1.5"
                  accept="image/*"
                />
              </div>
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-dark transition text-sm"
                >
                  Save Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewApi.getAllReviews({ status: filter });
      if (res?.success) {
        setReviews(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const handleApprove = async (id) => {
    try {
      await reviewApi.approveReview(id);
      fetchReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewApi.deleteReview(id);
      fetchReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold font-quicksand text-dark">Reviews Moderation</h2>
        <p className="text-gray-500 text-sm">Approve customer reviews before they show on the homepage.</p>
      </div>

      <div className="flex gap-2 bg-white p-4 rounded-2xl border shadow-sm">
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            filter === 'pending' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Pending Approval
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            filter === 'approved' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Approved Reviews
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                <th className="p-4 text-start">Name</th>
                <th className="p-4 text-start">Rating</th>
                <th className="p-4 text-start">Content</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">No reviews found.</td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
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
                    <td className="p-4 text-xs italic text-gray-600 max-w-sm break-words">"{r.text}"</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        {!r.isApproved && (
                          <button onClick={() => handleApprove(r._id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Approve</button>
                        )}
                        <button onClick={() => handleDelete(r._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MessagesView() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unread');

  const fetchMsgs = async () => {
    setLoading(true);
    try {
      const res = await contactApi.getMessages({ status: filter });
      if (res?.success) {
        setMsgs(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMsgs();
  }, [filter]);

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
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold font-quicksand text-dark">Contact Messages</h2>
        <p className="text-gray-500 text-sm">Read and moderate client messages.</p>
      </div>

      <div className="flex gap-2 bg-white p-4 rounded-2xl border shadow-sm">
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            filter === 'unread' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Unread Messages
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            filter === 'read' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Read Messages
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                <th className="p-4 text-start">Sender</th>
                <th className="p-4 text-start">Subject</th>
                <th className="p-4 text-start">Message</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">Loading messages...</td>
                </tr>
              ) : msgs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">No messages found.</td>
                </tr>
              ) : (
                msgs.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-semibold text-dark">{m.name}</div>
                      <div className="text-[10px] text-gray-400">{m.email}</div>
                    </td>
                    <td className="p-4 font-semibold text-gray-700">{m.subject}</td>
                    <td className="p-4 text-xs text-gray-600 max-w-sm break-words">{m.message}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        {!m.isRead && (
                          <button onClick={() => handleMarkAsRead(m._id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Mark Read</button>
                        )}
                        <button onClick={() => handleDelete(m._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    businessName: 'Petcare Pro',
    phone: '',
    email: '',
    address: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await contactApi.getSettings();
        if (res?.success && res.data) {
          const d = res.data;
          setFormData({
            businessName: d.businessName || 'Petcare Pro',
            phone: d.phone || '',
            email: d.email || '',
            address: d.address || '',
            socialLinks: {
              facebook: d.socialLinks?.facebook || '',
              instagram: d.socialLinks?.instagram || '',
              twitter: d.socialLinks?.twitter || ''
            }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await contactApi.updateSettings(formData);
      if (res?.success) {
        setSuccessMsg('Website settings saved successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 font-medium">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl animate-fadeIn space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-quicksand text-dark">Website Settings</h2>
        <p className="text-gray-500 text-sm">Configure dynamic site contacts and social media profiles.</p>
      </div>

      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-2 text-sm font-semibold">
          <i className="fas fa-check-circle"></i>
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Business Name</label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Business Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-bold text-dark">Social Media Profiles</h4>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Facebook URL</label>
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                className="form-input"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Instagram URL</label>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                className="form-input"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Twitter/X URL</label>
              <input
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn mt-4 w-full flex justify-center items-center gap-2">
            {saving ? (
              <>
                <i className="fas fa-spinner animate-spin"></i> Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </form>
      </div>
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
        limit: 8,
        search: search.trim(),
        role: roleFilter
      });
      if (res?.success) {
        setUsers(res.data || []);
        setTotalPages(res.totalPages || 1);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-dark">User Management</h2>
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
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition capitalize ${
                roleFilter === role
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                <th className="p-4 text-start">User</th>
                <th className="p-4 text-start">Contact</th>
                <th className="p-4 text-start">Role</th>
                <th className="p-4 text-start">Joined Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">No users found.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                      }`}>{u.role}</span>
                    </td>
                    <td className="p-4 text-xs font-medium text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openEditModal(u)} className="text-blue-500 hover:text-blue-700 text-xs font-bold">Edit</button>
                        <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-100">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-100 text-gray-500 font-bold rounded-lg text-xs hover:bg-gray-200 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-100 text-gray-500 font-bold rounded-lg text-xs hover:bg-gray-200 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <h4 className="text-xl font-bold font-quicksand text-dark mb-4">
              {currentUser ? 'Edit User Account' : 'Create New User'}
            </h4>
            <form onSubmit={handleSave} className="space-y-4 text-sm">
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

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-dark transition text-sm"
                >
                  {currentUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
