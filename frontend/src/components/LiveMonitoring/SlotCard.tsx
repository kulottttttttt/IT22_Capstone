import type { ParkingSlot, SlotStatus } from '../../types';

interface SlotCardProps {
  slot: ParkingSlot;
  onClick: () => void;
  canUpdate: boolean;
}

export const SlotCard: React.FC<SlotCardProps> = ({ slot, onClick, canUpdate }) => {
  const getStatusStyles = (status: SlotStatus) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-green-100 hover:bg-green-200',
          border: 'border-green-400',
          text: 'text-green-800',
          icon: '✓'
        };
      case 'Occupied':
        return {
          bg: 'bg-red-100 hover:bg-red-200',
          border: 'border-red-400',
          text: 'text-red-800',
          icon: '🚗'
        };
      case 'Maintenance':
        return {
          bg: 'bg-yellow-100 hover:bg-yellow-200',
          border: 'border-yellow-400',
          text: 'text-yellow-800',
          icon: '🔧'
        };
    }
  };

  const styles = getStatusStyles(slot.currentStatus);

  return (
    <button
      onClick={onClick}
      disabled={!canUpdate}
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200
        ${styles.bg} ${styles.border}
        ${canUpdate ? 'cursor-pointer shadow-md hover:shadow-lg' : 'cursor-default opacity-75'}
      `}
    >
      {/* Slot Number */}
      <div className="text-center">
        <div className={`text-2xl font-bold ${styles.text} mb-1`}>
          {slot.slotNumber}
        </div>
        
        {/* Status Icon */}
        <div className="text-3xl mb-2">
          {styles.icon}
        </div>
        
        {/* Status Text */}
        <div className={`text-xs font-semibold ${styles.text}`}>
          {slot.currentStatus}
        </div>
        
        {/* Vehicle Type */}
        <div className="text-xs text-gray-600 mt-1">
          {slot.vehicleType}
        </div>
      </div>

      {/* Sensor Indicator */}
      {slot.isSensorEnabled && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Sensor Enabled"></div>
        </div>
      )}
    </button>
  );
};
