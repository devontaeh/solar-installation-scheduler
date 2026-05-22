import { Employee } from '../models/Employee';
import { CrewRequirement } from '../types';

export function selectCrew(available: Employee[], req: CrewRequirement): Employee[] | null {
  const certified = available.filter((e) => e.type === 'certified');
  if (certified.length < req.certified) return null;
  const selectedCertified = certified.slice(0, req.certified);

  const selectedCertifiedIds = new Set(selectedCertified.map((e) => e.id));
  const remaining = available.filter((e) => !selectedCertifiedIds.has(e.id));
  const pending = remaining.filter((e) => e.type === 'pending');
  if (pending.length < req.pending) return null;
  const selectedPending = pending.slice(0, req.pending);

  const selectedPendingIds = new Set(selectedPending.map((e) => e.id));
  const remainingAfterPending = remaining.filter((e) => !selectedPendingIds.has(e.id));
  if (remainingAfterPending.length < req.anyType) return null;
  const selectedAny = remainingAfterPending.slice(0, req.anyType);

  return [...selectedCertified, ...selectedPending, ...selectedAny];
}
