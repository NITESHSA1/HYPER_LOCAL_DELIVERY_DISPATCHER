import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  AlertCircle,
  Check,
  Bike,
  Car,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, updateAvailability } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    vehicleType: user?.vehicleType || 'bike',
    vehicleNumber: user?.vehicleNumber || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      ...(user?.role === 'rider' && {
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber
      })
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  };

  const handleToggleAvailability = async () => {
    const result = await updateAvailability(!user?.isAvailable);
    if (!result.success) {
      setMessage({ type: 'error', text: result.message });
    } else {
      setMessage({ type: 'success', text: `You are now ${!user?.isAvailable ? 'available' : 'unavailable'} for deliveries` });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      {message.text && (
        <div className={`flex items-center gap-2 p-4 mb-6 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Avatar & Basic Info */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 capitalize">{user?.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">{user?.rating || '5.0'}</span>
                {user?.role === 'rider' && (
                  <span className="text-sm text-gray-400">({user?.totalDeliveries || 0} deliveries)</span>
                )}
              </div>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-outline text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {/* Rider Availability Toggle */}
        {user?.role === 'rider' && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${user?.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium text-gray-900">
                {user?.isAvailable ? 'Available for Deliveries' : 'Currently Unavailable'}
              </span>
            </div>
            <button
              onClick={handleToggleAvailability}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                user?.isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                user?.isAvailable ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Full Name
                </span>
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                />
              ) : (
                <p className="text-gray-900 py-2.5">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  Email
                </span>
              </label>
              <p className="text-gray-900 py-2.5">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  Phone
                </span>
              </label>
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                />
              ) : (
                <p className="text-gray-900 py-2.5">{user?.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Role
                </span>
              </label>
              <p className="text-gray-900 py-2.5 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Address
              </span>
            </label>
            {editing ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="input"
                  placeholder="Street"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                  placeholder="City"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input"
                  placeholder="State"
                />
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="input"
                  placeholder="ZIP Code"
                />
              </div>
            ) : (
              <div className="text-gray-900 py-2.5">
                <p>{user?.address?.street}</p>
                <p>{user?.address?.city}, {user?.address?.state} {user?.address?.zipCode}</p>
              </div>
            )}
          </div>

          {/* Rider-specific fields */}
          {user?.role === 'rider' && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Bike className="w-4 h-4" />
                    Vehicle Type
                  </span>
                </label>
                {editing ? (
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2.5 capitalize">{user?.vehicleType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Car className="w-4 h-4" />
                    Vehicle Number
                  </span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900 py-2.5">{user?.vehicleNumber || 'Not set'}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {editing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    name: user?.name || '',
                    phone: user?.phone || '',
                    street: user?.address?.street || '',
                    city: user?.address?.city || '',
                    state: user?.address?.state || '',
                    zipCode: user?.address?.zipCode || '',
                    vehicleType: user?.vehicleType || 'bike',
                    vehicleNumber: user?.vehicleNumber || ''
                  });
                }}
                className="btn-outline"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;