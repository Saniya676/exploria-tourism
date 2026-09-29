import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { packageService, bookingService, reviewService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GuideCard from '../../components/cards/GuideCard';
import {
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  Heart
} from 'lucide-react';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [travelDate, setTravelDate] = useState('2026-10-15');
  const [travelersCount, setTravelersCount] = useState(2);
  const [selectedGuideId, setSelectedGuideId] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  async function fetchPackageDetails() {
    try {
      setLoading(true);
      const res = await packageService.getById(id);
      if (res.success) {
        setPkg(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalAmount = pkg ? Number(pkg.price) * Number(travelersCount) : 0;

  async function handleConfirmBooking(e) {
    e.preventDefault();
    if (!user) {
      showToast('Please login to book this package', 'info');
      navigate('/login');
      return;
    }

    try {
      setBookingSubmitting(true);
      const res = await bookingService.create({
        package_id: pkg.id,
        guide_id: selectedGuideId || null,
        travel_date: travelDate,
        travelers_count: travelersCount,
        special_notes: specialNotes
      });

      if (res.success) {
        showToast(`Booking Confirmed! Booking Code: ${res.data.booking_code}`, 'success');
        setBookingModalOpen(false);
        navigate('/dashboard/bookings');
      }
    } catch (err) {
      showToast(err.message || 'Booking failed', 'error');
    } finally {
      setBookingSubmitting(false);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!user) {
      showToast('Please login to leave a review', 'info');
      navigate('/login');
      return;
    }

    try {
      setReviewSubmitting(true);
      const res = await reviewService.create({
        package_id: pkg.id,
        rating,
        comment
      });
      if (res.success) {
        showToast('Review submitted successfully!', 'success');
        setComment('');
        await fetchPackageDetails();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Package Not Found</h2>
        <Link to="/packages" className="text-sm font-bold text-teal-600 underline">Back to Packages</Link>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-12">
      {/* Header */}
      <div className="bg-slate-900 text-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link to="/packages" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back to Packages
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-teal-500 text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-full">
                  {pkg.difficulty}
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" /> {pkg.destination_name}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">{pkg.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-teal-400" /> {pkg.duration_days} Days / {pkg.duration_days - 1} Nights</span>
                <span className="flex items-center gap-1.5 text-amber-400 font-bold"><Star className="w-4 h-4 fill-amber-400" /> {Number(pkg.rating).toFixed(2)} ({pkg.reviews_count || 0} Reviews)</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-400" /> Best Season: {pkg.best_season}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-4 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Price Per Person</span>
                <div className="text-4xl font-black text-white mt-0.5">${pkg.price}</div>
              </div>

              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-teal-500/25 transition"
              >
                Book This Package
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cover Image Gallery */}
          <div className="h-96 rounded-3xl overflow-hidden shadow-md">
            <img src={pkg.cover_image} alt={pkg.title} className="w-full h-full object-cover" />
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Expedition Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{pkg.description}</p>
          </div>

          {/* Included / Excluded Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-200/60 space-y-3">
              <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> What's Included
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {(pkg.included_services || []).map((serv, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{serv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-200/60 space-y-3">
              <h3 className="font-bold text-sm text-rose-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" /> What's Excluded
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {(pkg.excluded_services || []).map((serv, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{serv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Itinerary */}
          {pkg.itineraries && pkg.itineraries.length > 0 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Day-by-Day Itinerary</h2>
              <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-teal-200">
                {pkg.itineraries.map((day) => (
                  <div key={day.id} className="relative pl-10 space-y-1">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-md">
                      D{day.day_number}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{day.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety & Required Equipment */}
          {pkg.safety_info && (
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-teal-400">
                <ShieldCheck className="w-5 h-5" /> Safety & Equipment Guidelines
              </h2>
              <div className="text-xs space-y-3 text-slate-300">
                <p><strong>Safety Protocol:</strong> {pkg.safety_info}</p>
                <p><strong>Required Equipment:</strong> {pkg.required_equipment}</p>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Traveler Reviews ({pkg.reviews ? pkg.reviews.length : 0})</h2>

            {/* Review List */}
            <div className="space-y-4">
              {(pkg.reviews || []).map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rev.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt={rev.user_name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{rev.user_name}</h4>
                        <span className="text-[10px] text-slate-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400" /> {rev.rating}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Post Review Form */}
            <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Write a Review</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-semibold">Your Rating:</span>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl p-2">
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                  <option value={2}>2 Stars (Poor)</option>
                  <option value={1}>1 Star (Terrible)</option>
                </select>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience on this trip..."
                required
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-2xl p-3 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-5 py-2.5 bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition"
              >
                {reviewSubmitting ? 'Posting...' : 'Submit Review'}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Booking Sidebar Widget & Available Guides */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-4 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900">Book Package</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Departure Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Number of Travelers</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              {pkg.guides && pkg.guides.length > 0 && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Select Preferred Guide (Optional)</label>
                  <select
                    value={selectedGuideId}
                    onChange={(e) => setSelectedGuideId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 font-semibold text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="">No Guide (Self Guided)</option>
                    {pkg.guides.map((g) => (
                      <option key={g.id} value={g.id}>{g.name} (${g.hourly_rate}/hr)</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Total Dynamic Amount:</span>
              <span className="text-2xl font-black text-slate-900">${totalAmount}</span>
            </div>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-teal-500/25 transition"
            >
              Proceed to Test Checkout
            </button>
          </div>
        </div>

      </div>

      {/* BOOKING TEST CHECKOUT MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-teal-400">
                <CreditCard className="w-5 h-5" /> Demo Test Payment Checkout
              </h3>
              <button onClick={() => setBookingModalOpen(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs">
              <p><strong>Package:</strong> {pkg.title}</p>
              <p><strong>Departure Date:</strong> {travelDate}</p>
              <p><strong>Travelers:</strong> {travelersCount} Person(s)</p>
              <p className="text-teal-300 font-bold text-base pt-1">Total Payable: ${totalAmount}</p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-300 font-semibold">Special Notes for Guide / Host</label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Vegetarian food, extra luggage..."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] text-amber-300">
              ⚡ <strong>Demo Mode:</strong> No real money will be charged. This completes an instant test booking transaction.
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={bookingSubmitting}
              className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-teal-500/25"
            >
              {bookingSubmitting ? 'Confirming Booking...' : 'Complete Demo Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
