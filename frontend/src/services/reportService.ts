import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { ReportData, ReportFilters, ReportType } from '../types/reports';
import { dashboardService } from './dashboardService';
import { slotService } from './slotService';
import { incidentService } from './incidentService';
import { analyticsService } from './analyticsService';

export const reportService = {
  // Generate report data
  async generateReportData(reportType: ReportType, filters: ReportFilters): Promise<ReportData> {
    try {
      // Fetch all required data
      const [zones, slots, incidents, prediction] = await Promise.all([
        dashboardService.getZones(),
        slotService.getAllSlots(),
        incidentService.getIncidents(),
        analyticsService.getPredictions(),
      ]);

      // Calculate occupancy data
      const occupancyTrend = await analyticsService.getOccupancyTrend(slots);
      const zonePerformance = await analyticsService.getZonePerformance(zones, slots);

      // Calculate summary statistics
      const totalSlots = slots.length;
      const occupiedSlots = slots.filter(s => s.currentStatus === 'Occupied').length;
      const availableSlots = slots.filter(s => s.currentStatus === 'Available').length;
      const averageOccupancy = totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;

      // Find peak occupancy
      const peakData = occupancyTrend.reduce((max, curr) => 
        curr.occupied > max.occupied ? curr : max
      , occupancyTrend[0] || { hour: '00:00', occupied: 0 });

      // Calculate incident statistics
      const resolvedIncidents = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
      const pendingIncidents = incidents.filter(i => i.status === 'Open' || i.status === 'InProgress').length;

      const reportData: ReportData = {
        reportType,
        generatedAt: new Date().toISOString(),
        filters,
        summary: {
          totalSlots,
          averageOccupancy: Math.round(averageOccupancy * 10) / 10,
          peakOccupancy: peakData.occupied,
          peakOccupancyTime: peakData.hour,
          availableSlots,
          totalIncidents: incidents.length,
          resolvedIncidents,
          pendingIncidents,
        },
        occupancyData: occupancyTrend.map(t => ({
          date: new Date().toISOString().split('T')[0],
          hour: parseInt(t.hour.split(':')[0]),
          totalSlots,
          occupiedSlots: t.occupied,
          availableSlots: t.available,
          maintenanceSlots: t.maintenance,
          occupancyRate: totalSlots > 0 ? (t.occupied / totalSlots) * 100 : 0,
        })),
        incidentData: incidents.slice(0, 20).map(i => ({
          id: i.id,
          title: i.title,
          type: i.incidentType,
          priority: i.priority,
          status: i.status,
          zone: i.zoneName || 'N/A',
          createdAt: i.createdAt,
          resolvedAt: i.resolvedAt,
        })),
        utilizationData: zonePerformance.map(z => ({
          zoneName: z.zoneName,
          totalSlots: z.availableSlots + Math.round((z.occupancyRate / 100) * z.availableSlots),
          averageOccupancy: z.occupancyRate,
          peakOccupancy: z.occupancyRate * 1.2,
          utilizationRate: z.utilizationPercentage,
        })),
        predictionData: (prediction.predictions || []).map(p => ({
          time: new Date(p.forecastTime).toLocaleTimeString(),
          predictedOccupancy: p.predictedOccupancyPercentage,
          actualOccupancy: prediction.currentOccupancyPercentage,
          accuracy: p.confidenceScore * 100,
        })),
      };

      return reportData;
    } catch (error) {
      console.error('Error generating report data:', error);
      throw new Error('Failed to generate report data');
    }
  },

  // Export to PDF
  exportToPDF(reportData: ReportData, reportTitle: string): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.text(reportTitle, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Summary Statistics
    doc.setFontSize(14);
    doc.text('Summary Statistics', 14, yPosition);
    yPosition += 10;

    const summaryData = [
      ['Total Slots', reportData.summary.totalSlots.toString()],
      ['Average Occupancy', `${reportData.summary.averageOccupancy}%`],
      ['Peak Occupancy', `${reportData.summary.peakOccupancy} at ${reportData.summary.peakOccupancyTime}`],
      ['Available Slots', reportData.summary.availableSlots.toString()],
      ['Total Incidents', reportData.summary.totalIncidents.toString()],
      ['Resolved Incidents', reportData.summary.resolvedIncidents.toString()],
      ['Pending Incidents', reportData.summary.pendingIncidents.toString()],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Occupancy Data (last 12 hours)
    if (reportData.occupancyData.length > 0) {
      doc.setFontSize(14);
      doc.text('Hourly Occupancy (Last 12 Hours)', 14, yPosition);
      yPosition += 10;

      const occupancyRows = reportData.occupancyData.slice(-12).map(o => [
        `${o.hour}:00`,
        o.occupiedSlots.toString(),
        o.availableSlots.toString(),
        `${o.occupancyRate.toFixed(1)}%`,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Hour', 'Occupied', 'Available', 'Rate']],
        body: occupancyRows,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // Zone Utilization (new page if needed)
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    if (reportData.utilizationData.length > 0) {
      doc.setFontSize(14);
      doc.text('Zone Performance', 14, yPosition);
      yPosition += 10;

      const utilizationRows = reportData.utilizationData.map(u => [
        u.zoneName,
        u.totalSlots.toString(),
        `${u.averageOccupancy.toFixed(1)}%`,
        `${u.utilizationRate.toFixed(1)}%`,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Zone', 'Total Slots', 'Avg Occupancy', 'Utilization']],
        body: utilizationRows,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // Incidents (new page if needed)
    if (reportData.incidentData.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('Recent Incidents', 14, yPosition);
      yPosition += 10;

      const incidentRows = reportData.incidentData.slice(0, 10).map(i => [
        i.title.substring(0, 30),
        i.type,
        i.priority,
        i.status,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Title', 'Type', 'Priority', 'Status']],
        body: incidentRows,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
      });
    }

    // Save PDF
    const fileName = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  },

  // Export to Excel
  exportToExcel(reportData: ReportData, reportTitle: string): void {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Smart Parking Management System'],
      [reportTitle],
      [`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`],
      [],
      ['Summary Statistics'],
      ['Metric', 'Value'],
      ['Total Slots', reportData.summary.totalSlots],
      ['Average Occupancy', `${reportData.summary.averageOccupancy}%`],
      ['Peak Occupancy', `${reportData.summary.peakOccupancy} at ${reportData.summary.peakOccupancyTime}`],
      ['Available Slots', reportData.summary.availableSlots],
      ['Total Incidents', reportData.summary.totalIncidents],
      ['Resolved Incidents', reportData.summary.resolvedIncidents],
      ['Pending Incidents', reportData.summary.pendingIncidents],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Occupancy Data Sheet
    if (reportData.occupancyData.length > 0) {
      const occupancySheet = XLSX.utils.json_to_sheet(
        reportData.occupancyData.map(o => ({
          'Date': o.date,
          'Hour': `${o.hour}:00`,
          'Total Slots': o.totalSlots,
          'Occupied': o.occupiedSlots,
          'Available': o.availableSlots,
          'Maintenance': o.maintenanceSlots,
          'Occupancy Rate': `${o.occupancyRate.toFixed(1)}%`,
        }))
      );
      XLSX.utils.book_append_sheet(workbook, occupancySheet, 'Occupancy Data');
    }

    // Zone Performance Sheet
    if (reportData.utilizationData.length > 0) {
      const utilizationSheet = XLSX.utils.json_to_sheet(
        reportData.utilizationData.map(u => ({
          'Zone Name': u.zoneName,
          'Total Slots': u.totalSlots,
          'Average Occupancy': `${u.averageOccupancy.toFixed(1)}%`,
          'Peak Occupancy': `${u.peakOccupancy.toFixed(1)}%`,
          'Utilization Rate': `${u.utilizationRate.toFixed(1)}%`,
        }))
      );
      XLSX.utils.book_append_sheet(workbook, utilizationSheet, 'Zone Performance');
    }

    // Predictions Sheet
    if (reportData.predictionData.length > 0) {
      const predictionSheet = XLSX.utils.json_to_sheet(
        reportData.predictionData.map(p => ({
          'Time': p.time,
          'Predicted Occupancy': `${p.predictedOccupancy.toFixed(1)}%`,
          'Actual Occupancy': p.actualOccupancy ? `${p.actualOccupancy.toFixed(1)}%` : 'N/A',
          'Accuracy': p.accuracy ? `${p.accuracy.toFixed(1)}%` : 'N/A',
        }))
      );
      XLSX.utils.book_append_sheet(workbook, predictionSheet, 'Predictions');
    }

    // Incidents Sheet
    if (reportData.incidentData.length > 0) {
      const incidentSheet = XLSX.utils.json_to_sheet(
        reportData.incidentData.map(i => ({
          'ID': i.id,
          'Title': i.title,
          'Type': i.type,
          'Priority': i.priority,
          'Status': i.status,
          'Zone': i.zone,
          'Created At': new Date(i.createdAt).toLocaleString(),
          'Resolved At': i.resolvedAt ? new Date(i.resolvedAt).toLocaleString() : 'N/A',
        }))
      );
      XLSX.utils.book_append_sheet(workbook, incidentSheet, 'Incidents');
    }

    // Save Excel
    const fileName = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  },

  // Print Report
  printReport(): void {
    window.print();
  },
};
