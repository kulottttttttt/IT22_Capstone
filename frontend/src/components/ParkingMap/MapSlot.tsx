import React from 'react';
import type { ParkingSlot } from '../../types';

interface MapSlotProps {
  slot: ParkingSlot;
  onClick: (slot: ParkingSlot) => void;
  isSelected?: boolean;
}

export const MapSlot: React.FC<MapSlotProps> = ({ slot, onClick, isSelected }) => {
  const getStatusColor = () => {
    switch (slot.currentStatus) {
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

  const getVehicleIcon = () => {
    switch (slot.vehicleType) {
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

  return (
    <button
      onClick={() => onClick(slot)}
      className={`
        relative w-full aspect-square rounded-lg shadow-lg transition-all duration-200 
        flex flex-col items-center justify-center text-white font-bold text-xs
        ${getStatusColor()}
        ${isSelected ? 'ring-4 ring-blue-400 scale-105' : ''}
        hover:scale-105 active:scale-95
      `}
      title={`${slot.slotNumber} - ${slot.currentStatus}`}
    >
      {/* Slot Number */}
      <div className="text-sm font-bold mb-1">{slot.slotNumber}</div>
      
      {/* Vehicle Icon */}
      <div className="text-lg">{getVehicleIcon()}</div>
      
      {/* Sensor Indicator */}
      {slot.isSensorEnabled && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-4 border-blue-400 rounded-lg pointer-events-none" />
      )}
    </button>
  );
};
