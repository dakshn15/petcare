import React, { useState, useEffect } from 'react';
import Modal from '../components/UI/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import * as bookingApi from '../api/bookingApi';
import * as adoptionApi from '../api/adoptionApi';
import confetti from 'canvas-confetti';
import PageLoader from '../components/UI/PageLoader';

export default function Account() {
  const { user, logout } = useAuth();
  const addToast = useToast();
  const [bookings, setBookings] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'adoptions'
  const [showCancelConfirm, setShowCancelConfirm] = useState(null); // ID of booking to cancel
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [bookingsRes, adoptionsRes] = await Promise.all([
        bookingApi.getMyBookings(),
        adoptionApi.getMyAdoptions()
      ]);
      if (bookingsRes?.success) {
        setBookings(bookingsRes.data || []);
      }
      if (adoptionsRes?.success) {
        setAdoptions(adoptionsRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      addToast(err.message || 'Failed to load your data. Please refresh the page.', 'error', 5000);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      addToast(err.message || 'Logout failed. Please try again.', 'error');
    }
  };

  const handleCancelBookingClick = (bookingId) => {
    setShowCancelConfirm(bookingId);
  };

  const confirmCancellation = async () => {
    if (!showCancelConfirm) return;
    
    try {
      const res = await bookingApi.cancelBooking(showCancelConfirm);
      if (res?.success) {
        // Refresh bookings
        const bookingsRes = await bookingApi.getMyBookings();
        if (bookingsRes?.success) {
          setBookings(bookingsRes.data || []);
        }
        
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.8 }
        });
      }
    } catch (err) {
      addToast(err.message || 'Failed to cancel booking. Please try again.', 'error', 5000);
    } finally {
      setShowCancelConfirm(null);
    }
  };

  if (!user) {
    return <PageLoader message="Loading your profile…" />;
  }

  return (
    <div>
      {/* common banner */}
      <section
        className="banner-section relative lg:pt-20 pt-10 lg:pb-24 pb-12 bg-cover sm:bg-[right] bg-[80%] rtl:scale-x-[-1]"
        style={{ backgroundImage: "url('/assets/images/common-banner.png')" }}
      >
        <div className="md:container w-full mx-auto px-4 rtl:scale-x-[-1]">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">My Account</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">My Account</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Profile Details & History */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 relative overflow-hidden group">
                <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
                
                <div className="text-center relative z-[1]">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold font-quicksand text-dark mb-1">{user.name}</h3>
                  <p className="text-gray-500 text-xs font-semibold mb-6 break-all">{user.email}</p>
                  
                  <div className="space-y-4 border-t pt-6 text-start text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Phone:</span>
                      <span className="text-secondary font-semibold">{user.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Bookings:</span>
                      <span className="text-secondary font-semibold">{bookings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Adoptions:</span>
                      <span className="text-secondary font-semibold">{adoptions.length}</span>
                    </div>
                  </div>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="w-full mt-4 block text-center px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-dark transition duration-300 text-sm"
                    >
                      <i className="fas fa-user-shield me-2"></i>
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-red-50 hover:text-red-600 transition duration-300 text-sm"
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Log Out
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Bookings & Adoptions History */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
                
                {/* Tabs */}
                <div className="flex gap-4 border-b pb-4 mb-6">
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`pb-2 px-2 text-base font-bold font-quicksand transition duration-300 relative ${
                      activeTab === 'bookings' ? 'text-primary' : 'text-gray-400 hover:text-dark'
                    }`}
                  >
                    My Bookings
                    {activeTab === 'bookings' && (
                      <span className="absolute bottom-0 start-0 end-0 h-0.5 bg-primary"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('adoptions')}
                    className={`pb-2 px-2 text-base font-bold font-quicksand transition duration-300 relative ${
                      activeTab === 'adoptions' ? 'text-primary' : 'text-gray-400 hover:text-dark'
                    }`}
                  >
                    My Adoptions
                    {activeTab === 'adoptions' && (
                      <span className="absolute bottom-0 start-0 end-0 h-0.5 bg-primary"></span>
                    )}
                  </button>
                </div>

                {/* Bookings Tab Content */}
                {activeTab === 'bookings' && (
                  <div>
                    {loadingData ? (
                      <PageLoader compact message="Loading your bookings…" />
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <i className="fas fa-calendar-alt text-4xl mb-4 opacity-50 block"></i>
                        <p className="mb-6 font-medium">You don't have any bookings yet.</p>
                        <Link to="/service-booking" className="btn">Book a Grooming Service</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div
                            key={booking._id}
                            className="p-5 border rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition duration-200"
                          >
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-xs font-bold font-quicksand bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full uppercase">
                                  {booking.bookingId}
                                </span>
                                <span className="text-xs text-gray-400 font-semibold">
                                  {new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold font-quicksand text-dark mb-1">
                                {booking.serviceLabel}
                              </h4>
                              <p className="text-gray-600 text-sm font-medium">
                                For <span className="font-semibold text-primary">{booking.petName}</span> ({booking.petType})
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                <span className="flex items-center gap-1">
                                  <i className="far fa-calendar"></i> {booking.date}
                                </span>
                                {booking.time && (
                                  <span className="flex items-center gap-1 capitalize">
                                    <i className="far fa-clock"></i> {booking.time}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 justify-between md:justify-end border-t pt-4 md:border-none md:pt-0">
                              <div>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    booking.status === 'Confirmed'
                                      ? 'bg-green-100 text-green-700'
                                      : booking.status === 'Completed'
                                      ? 'bg-blue-100 text-blue-700'
                                      : booking.status === 'Cancelled'
                                      ? 'bg-gray-100 text-gray-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </div>
                              {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                <button
                                  onClick={() => handleCancelBookingClick(booking._id)}
                                  className="text-red-500 hover:text-red-700 text-sm font-bold transition duration-200"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Adoptions Tab Content */}
                {activeTab === 'adoptions' && (
                  <div>
                    {loadingData ? (
                      <PageLoader compact message="Loading your applications…" />
                    ) : adoptions.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <i className="fas fa-heart-broken text-4xl mb-4 opacity-50 block"></i>
                        <p className="mb-6 font-medium">You haven't submitted any adoption applications yet.</p>
                        <Link to="/adoption" className="btn">Apply to Adopt</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {adoptions.map((adoption) => (
                          <div
                            key={adoption._id}
                            className="p-5 border rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition duration-200"
                          >
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-xs font-bold font-quicksand bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full uppercase">
                                  {adoption.applicationId}
                                </span>
                                <span className="text-xs text-gray-400 font-semibold">
                                  {new Date(adoption.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold font-quicksand text-dark mb-1">
                                Adoption Application
                              </h4>
                              <p className="text-gray-600 text-sm font-medium">
                                Requested: <span className="font-semibold text-primary capitalize">{adoption.petType}</span>
                                {adoption.breed && ` (${adoption.breed})`}
                              </p>
                              <p className="text-gray-500 text-xs mt-2 line-clamp-1 italic font-medium">
                                " {adoption.reason} "
                              </p>
                            </div>

                            <div className="flex items-center gap-4 justify-between md:justify-end border-t pt-4 md:border-none md:pt-0">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  adoption.status === 'Approved'
                                    ? 'bg-green-100 text-green-800'
                                    : adoption.status === 'Rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {adoption.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!showCancelConfirm}
        onClose={() => setShowCancelConfirm(null)}
        title="Cancel Appointment?"
        maxWidth="max-w-sm"
      >
        <div className="p-6 text-center text-sm">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCancelConfirm(null)}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-full text-xs hover:bg-gray-200 transition duration-200"
            >
              Go Back
            </button>
            <button
              onClick={confirmCancellation}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold rounded-full text-xs hover:bg-red-600 transition duration-200"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
