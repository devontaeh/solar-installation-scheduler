export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export const DAYS: readonly Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export type EmployeeType = 'certified' | 'pending' | 'laborer';

export type BuildingType = 'single_story' | 'two_story' | 'commercial';

// DECISION: flat counts rather than per-role arrays — the scheduler only needs
// how many of each role are required, not their identities at requirement-definition time.
export interface CrewRequirement {
  readonly certified: number;
  readonly pending: number;
  readonly anyType: number;
}

export interface Assignment {
  readonly buildingId: string;
  readonly employeeIds: string[];
}

export interface DaySchedule {
  readonly day: Day;
  readonly assignments: Assignment[];
  readonly unscheduled: string[];
}

export interface Schedule {
  readonly days: DaySchedule[];
}
