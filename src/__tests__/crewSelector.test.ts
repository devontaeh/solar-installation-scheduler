import { expect } from '@jest/globals';
import { selectCrew } from '../services/crewSelector';
import { Employee } from '../models/Employee';
import { CrewRequirement } from '../types';

const makeCertified = (id: string): Employee => new Employee(id, `Certified ${id}`, 'certified', []);
const makePending = (id: string): Employee => new Employee(id, `Pending ${id}`, 'pending', []);
const makeLaborer = (id: string): Employee => new Employee(id, `Laborer ${id}`, 'laborer', []);

describe('selectCrew', () => {
  it('returns null when not enough certified installers', () => {
    const available = [makePending('e1'), makeLaborer('e2')];
    const req: CrewRequirement = { certified: 1, pending: 0, anyType: 0 };
    expect(selectCrew(available, req)).toBeNull();
  });

  it('returns null when not enough pending installers', () => {
    const available = [makeCertified('e1'), makeLaborer('e2')];
    const req: CrewRequirement = { certified: 1, pending: 1, anyType: 0 };
    expect(selectCrew(available, req)).toBeNull();
  });

  it('returns null when not enough anyType workers', () => {
    const available = [makeCertified('e1')];
    const req: CrewRequirement = { certified: 1, pending: 0, anyType: 1 };
    expect(selectCrew(available, req)).toBeNull();
  });

  it('selects correct crew for single story (1 certified)', () => {
    const available = [makeCertified('e1'), makeLaborer('e2')];
    const req: CrewRequirement = { certified: 1, pending: 0, anyType: 0 };
    const crew = selectCrew(available, req);
    expect(crew).toHaveLength(1);
    expect(crew![0].type).toBe('certified');
  });

  it('selects correct crew for two story (1 certified + 1 anyType)', () => {
    const available = [makeCertified('e1'), makeLaborer('e2')];
    const req: CrewRequirement = { certified: 1, pending: 0, anyType: 1 };
    const crew = selectCrew(available, req);
    expect(crew).toHaveLength(2);
    expect(crew!.some((e) => e.type === 'certified')).toBe(true);
    expect(crew!.some((e) => e.type === 'laborer')).toBe(true);
  });

  it('selects correct crew for commercial (2 certified + 2 pending + 4 anyType)', () => {
    const available = [
      makeCertified('e1'), makeCertified('e2'),
      makePending('e3'), makePending('e4'),
      makeLaborer('e5'), makeLaborer('e6'), makeLaborer('e7'), makeLaborer('e8'),
    ];
    const req: CrewRequirement = { certified: 2, pending: 2, anyType: 4 };
    const crew = selectCrew(available, req);
    expect(crew).toHaveLength(8);
  });

  // Edge case: certified installers are valid anyType workers
  it('allows certified installers to fill anyType slots on commercial builds', () => {
    // 4 certified, 2 pending, 0 laborers — the 4 anyType slots must be filled by certified
    const available = [
      makeCertified('e1'), makeCertified('e2'),
      makeCertified('e3'), makeCertified('e4'),
      makePending('e5'), makePending('e6'),
    ];
    const req: CrewRequirement = { certified: 2, pending: 2, anyType: 2 };
    const crew = selectCrew(available, req);
    expect(crew).not.toBeNull();
    expect(crew).toHaveLength(6);
  });
});
