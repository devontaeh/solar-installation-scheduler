import { Employee } from '../models/Employee';
import { CrewRequirement } from '../types';

export function selectCrew(available: Employee[], req: CrewRequirement): Employee[] | null {
  const certified = available.filter((e) => e.type === 'certified');
  if (certified.length < req.certified) return null;
  const selectedCertified = certified.slice(0, req.certified);

  const remaining = available.filter((e) => !selectedCertified.includes(e));
  const pending = remaining.filter((e) => e.type === 'pending');
  if (pending.length < req.pending) return null;
  const selectedPending = pending.slice(0, req.pending);

  const remainingAfterPending = remaining.filter((e) => !selectedPending.includes(e));
  if (remainingAfterPending.length < req.anyType) return null;
  const selectedAny = remainingAfterPending.slice(0, req.anyType);

  return [...selectedCertified, ...selectedPending, ...selectedAny];
}
