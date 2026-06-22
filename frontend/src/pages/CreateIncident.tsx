import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/Layout/PageHeader';
import { incidentService } from '../services/incidentService';
import { dashboardService } from '../services/dashboardService';
import { slotService } from '../services/slotService';
import type { CreateIncidentRequest, IncidentType, IncidentPriority } from '../types/incident';
import type { ParkingArea, Zone, ParkingSlot } from '../types';

export const CreateIncident: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('Other');
  const [priority, setPriority] = useState<IncidentPriority>('Medium');
  const [parkingAreaId, setParkingAreaId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [parkingSlotId, setParkingSlotId] = useState('');

  // Data for dropdowns
  const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [filteredZones, setFilteredZones] = useState<Zone[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<ParkingSlot[]>([]);

  // Load parking areas, zones, and slots
  useEffect(() => {
    const loadData = async () => {
      try {
        const [areasData, zonesData, slotsData] = await Promise.all([
          dashboardService.getParkingAreas(),
          dashboardService.getZones(),
          slotService.getAllSlots(),
        ]);
        setParkingAreas(areasData);
        setZones(zonesData);
        setSlots(slotsData);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  // Filter zones when parking area changes
  useEffect(() => {
    if (parkingAreaId) {
      const filtered = zones.filter(z => z.parkingAreaId === parkingAreaId);
      setFilteredZones(filtered);
    } else {
      setFilteredZones([]);
    }
    setZoneId('');
    setParkingSlotId('');
  }, [parkingAreaId, zones]);

  // Filter slots when zone changes
  useEffect(() => {
    if (zoneId) {
      const filtered = slots.filter(s => s.zoneId === zoneId);
      setFilteredSlots(filtered);
    } else {
      setFilteredSlots([]);
    }
    setParkingSlotId('');
  }, [zoneId, slots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (!parkingAreaId) {
      setError('Parking area is required');
      return;
    }

    try {
      setLoading(true);

      const request: CreateIncidentRequest = {
        title: title.trim(),
        description: description.trim(),
        incidentType,
        priority,
        parkingAreaId,
        zoneId: zoneId || undefined,
        parkingSlotId: parkingSlotId || undefined,
      };

      await incidentService.createIncident(request);
      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        navigate('/incidents');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="Create Incident"
        subtitle="Report a new parking incident"
      />

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              ✓ Incident created successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Incident Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the incident"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of the incident"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Incident Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Incident Type *
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="DamagedSlot">Damaged Slot</option>
                <option value="IllegalParking">Illegal Parking</option>
                <option value="SensorFailure">Sensor Failure</option>
                <option value="VehicleObstruction">Vehicle Obstruction</option>
                <option value="MaintenanceRequest">Maintenance Request</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IncidentPriority)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Parking Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Parking Area *
              </label>
              <select
                value={parkingAreaId}
                onChange={(e) => setParkingAreaId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select parking area...</option>
                {parkingAreas.map(area => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>

            {/* Zone (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Zone (Optional)
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || !parkingAreaId}
              >
                <option value="">Select zone...</option>
                {filteredZones.map(zone => (
                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>

            {/* Parking Slot (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Parking Slot (Optional)
              </label>
              <select
                value={parkingSlotId}
                onChange={(e) => setParkingSlotId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || !zoneId}
              >
                <option value="">Select parking slot...</option>
                {filteredSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>{slot.slotNumber}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Creating...' : 'Create Incident'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/incidents')}
                disabled={loading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
