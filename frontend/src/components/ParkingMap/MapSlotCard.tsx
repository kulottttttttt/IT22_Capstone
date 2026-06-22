import type { ParkingSlot, SlotStatus } from '../../types';

interface MapSlotCardProps {
  slot: ParkingSlot;
  onClick: (slot: ParkingSlot) => void;
}

const getStatusColor = (status: SlotStatus): string => {
  switch (status) {
    case 'Available':
      return 'bg-green-500 hover:bg-green-600 border-green-600';
    case 'Occupied':
      return 'bg-red-500 hover:bg-red-600 border-red-600';
    case 'Maintenance':
      return 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600 border-gray-600';
  }
};

const getStatusIcon = (status: SlotStatus): string => {
  switch (status) {
    case 'Available':
      return '✓';
    case 'Occupied':
      return '🚗';
    case 'Maintenance':
      return '🔧';
    default:
      return '?';
  }
};

const getVehicleTypeIcon = (vehicleType: string): string => {
  switch (vehicleType) {
    case 'Car':
      return '🚗';
    case 'Motorcycle':
      return '🏍️';
    case 'SUV':
      return '🚙';
    case 'Truck':
      return '🚚';
    default:
      return '🚗';
  }
};

export const MapSlotCard: React.FC<MapSlotCardProps> = ({ slot, onClick }) => {
  const statusColor = getStatusColor(slot.currentStatus);
  const statusIcon = getStatusIcon(slot.currentStatus);
  const vehicleIcon = getVehicleTypeIcon(slot.vehicleType);

  return (
    <button
      onClick={() => onClick(slot)}
      className={`
        relative w-full aspect-square rounded-lg shadow-md border-2
        ${statusColor}
        text-white font-semibold transition-all duration-200
        transform hover:scale-105 hover:shadow-lg
        flex flex-col items-center justify-center gap-1
        cursor-pointer
      `}
      title={`${slot.slotNumber} - ${slot.currentStatus}`}
    >
      {/* Status Icon */}
      <div className="text-2xl">{statusIcon}</div>
      
      {/* Slot Number */}
      <div className="text-sm font-bold">{slot.slotNumber}</div>
      
      {/* Vehicle Type Icon */}
      <div className="text-xs opacity-80">{vehicleIcon}</div>
      
      {/* Sensor Indicator */}
      {slot.isSensorEnabled && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-300 rounded-full animate-pulse" 
             title="Sensor Enabled" />
      )}
    </button>
  );
};
