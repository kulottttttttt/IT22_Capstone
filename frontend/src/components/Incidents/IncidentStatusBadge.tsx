import React from 'react';
import type { IncidentStatus, IncidentPriority } from '../../types/incident';

interface StatusBadgeProps {
  status: IncidentStatus;
}

interface PriorityBadgeProps {
  priority: IncidentPriority;
}

export const IncidentStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: IncidentStatus) => {
    return status === 'InProgress' ? 'In Progress' : status;
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
      {formatStatus(status)}
    </span>
  );
};

export const IncidentPriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor()}`}>
      {priority}
    </span>
  );
};
