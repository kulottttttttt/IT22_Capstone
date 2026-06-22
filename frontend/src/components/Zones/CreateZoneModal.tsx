import { useState, useEffect } from 'react';
import { zoneService, type CreateZoneDto } from '../../services/zoneService';
import { parkingAreaService, type ParkingArea } from '../../services/parkingAreaService';

interface CreateZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
];

export const CreateZoneModal: React.FC<CreateZoneModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>([]);
  const [formData, setFormData] = useState<CreateZoneDto>({
    parkingAreaId: '',
    name: '',
    description: '',
    mapColorHex: PRESET_COLORS[0],
    sortOrder: 1,
  });
  const [loading, setLoading] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadParkingAreas();
    }
  }, [isOpen]);

  const loadParkingAreas = async () => {
    setLoadingAreas(true);
    try {
      const areas = await parkingAreaService.getAll();
      setParkingAreas(areas);
      if (areas.length > 0 && !formData.parkingAreaId) {
        setFormData((prev) => ({ ...prev, parkingAreaId: areas[0].id }));
      }
    } catch (error) {
      onError('Failed to load parking areas');
    } finally {
      setLoadingAreas(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.parkingAreaId) {
      newErrors.parkingAreaId = 'Parking area is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Zone name is required';
    }
    if (formData.sortOrder < 1) {
      newErrors.sortOrder = 'Sort order must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await zoneService.create(formData);
      onSuccess();
      handleClose();
    } catch (error: any) {
      onError(error.response?.data?.message || 'Failed to create zone');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      parkingAreaId: parkingAreas[0]?.id || '',
      name: '',
      description: '',
      mapColorHex: PRESET_COLORS[0],
      sortOrder: 1,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Create New Zone</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {loadingAreas ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading parking areas...</p>
            </div>
          ) : parkingAreas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">No parking areas available. Please create a parking area first.</p>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* Parking Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.parkingAreaId}
                    onChange={(e) => setFormData({ ...formData, parkingAreaId: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.parkingAreaId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {parkingAreas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                  {errors.parkingAreaId && <p className="text-red-500 text-sm mt-1">{errors.parkingAreaId}</p>}
                </div>

                {/* Zone Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zone Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Zone A, Ground Floor, etc."
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter zone description"
                    rows={3}
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zone Color
                  </label>
                  <div className="flex gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, mapColorHex: color })}
                        className={`w-10 h-10 rounded-full border-4 transition-all ${
                          formData.mapColorHex === color ? 'border-gray-800 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.mapColorHex}
                    onChange={(e) => setFormData({ ...formData, mapColorHex: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#HEXCODE"
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.sortOrder ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.sortOrder && <p className="text-red-500 text-sm mt-1">{errors.sortOrder}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Zone'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
