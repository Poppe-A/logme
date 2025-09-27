import type { Sport } from './sportApi';

export interface ISportForm {
  isOpen: boolean;
  onSubmit: (sport: Sport | Omit<Sport, 'id'>) => void;
  sport: Sport | null;
  closeModal: () => void;
}

export interface ISportFormData {
  name: Sport['name'];
  description: Sport['description'];
}
