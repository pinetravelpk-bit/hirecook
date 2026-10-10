// Field definitions for the admin CRUD screens (leads, clients, cooks).
export type Field = {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'date' | 'textarea' | 'select' | 'checkbox' | 'cook';
  options?: readonly string[];
  required?: boolean;
  wide?: boolean;
};

export const leadStatuses = ['new', 'contacted', 'shortlisted', 'trial', 'hired', 'lost'] as const;
export const clientStatuses = ['active', 'paused', 'ended'] as const;
export const cookStatuses = ['available', 'placed', 'inactive'] as const;
const cities = ['Islamabad', 'Rawalpindi'] as const;
const schedules = ['Full-time', 'Part-time', 'Live-in', 'Live-out', 'Morning', 'Evening', 'Weekend', 'One-off event'] as const;

export const entities = {
  leads: {
    title: 'Leads',
    singular: 'Lead',
    statuses: leadStatuses,
    search: ['name', 'phone', 'area', 'service', 'notes', 'admin_notes'],
    columns: [['name', 'Name'], ['phone', 'Phone'], ['service', 'Service'], ['area', 'Area'], ['city', 'City'], ['status', 'Status'], ['created_at', 'Received']],
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true },
      { name: 'city', label: 'City', type: 'select', options: cities },
      { name: 'area', label: 'Area / sector' },
      { name: 'service', label: 'Cook needed' },
      { name: 'schedule', label: 'Schedule', type: 'select', options: schedules },
      { name: 'people', label: 'Family size / guests' },
      { name: 'budget', label: 'Preferred timings' },
      { name: 'start', label: 'Start date', type: 'date' },
      { name: 'source', label: 'Source', type: 'select', options: ['website', 'whatsapp', 'phone', 'walk-in', 'referral', 'other'] },
      { name: 'status', label: 'Status', type: 'select', options: leadStatuses },
      { name: 'follow_up', label: 'Follow-up date', type: 'date' },
      { name: 'notes', label: 'Customer message', type: 'textarea', wide: true },
      { name: 'admin_notes', label: 'Internal notes', type: 'textarea', wide: true },
    ] as Field[],
  },
  clients: {
    title: 'Clients',
    singular: 'Client',
    statuses: clientStatuses,
    search: ['name', 'phone', 'area', 'address', 'service', 'notes'],
    columns: [['name', 'Name'], ['phone', 'Phone'], ['service', 'Service'], ['area', 'Area'], ['cook_name', 'Cook'], ['status', 'Status'], ['start_date', 'Start']],
    fields: [
      { name: 'name', label: 'Client name', required: true },
      { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'city', label: 'City', type: 'select', options: cities },
      { name: 'area', label: 'Area / sector' },
      { name: 'address', label: 'Full address', wide: true },
      { name: 'service', label: 'Service' },
      { name: 'cook_id', label: 'Assigned cook', type: 'cook' },
      { name: 'start_date', label: 'Start date', type: 'date' },
      { name: 'fee', label: 'Agency fee / billing note' },
      { name: 'status', label: 'Status', type: 'select', options: clientStatuses },
      { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
    ] as Field[],
  },
  cooks: {
    title: 'Cooks',
    singular: 'Cook',
    statuses: cookStatuses,
    search: ['name', 'phone', 'cnic', 'area', 'speciality', 'notes'],
    columns: [['name', 'Name'], ['phone', 'Phone'], ['speciality', 'Speciality'], ['area', 'Area'], ['verified', 'Verified'], ['status', 'Status']],
    fields: [
      { name: 'name', label: 'Cook name', required: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'cnic', label: 'CNIC' },
      { name: 'city', label: 'City', type: 'select', options: cities },
      { name: 'area', label: 'Lives in (area)' },
      { name: 'speciality', label: 'Speciality (desi, BBQ, Chinese…)' },
      { name: 'experience', label: 'Experience (years / past employers)' },
      { name: 'schedule', label: 'Available for', type: 'select', options: schedules },
      { name: 'status', label: 'Status', type: 'select', options: cookStatuses },
      { name: 'verified', label: 'CNIC & references verified', type: 'checkbox' },
      { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
    ] as Field[],
  },
} as const;

export type EntityKey = keyof typeof entities;
export const isEntity = (k: string): k is EntityKey => k in entities;
