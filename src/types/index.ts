export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
export type Day = typeof DAYS[number];

export const EMPLOYEE_TYPES = ['certified', 'pending', 'laborer'] as const;
export type EmployeeType = typeof EMPLOYEE_TYPES[number];

export const BUILDING_TYPES = ['single_story', 'two_story', 'commercial'] as const;
export type BuildingType = typeof BUILDING_TYPES[number];

export interface CrewRequirement {
  readonly certified: number;
  readonly pending: number;
  readonly anyType: number;
}

export interface Assignment {
  readonly buildingId: string;
  readonly employeeIds:  readonly string[];
}

export interface DaySchedule {
  readonly day: Day;
  readonly assignments: Assignment[];
  readonly unscheduled: string[];
}

export interface Schedule {
  readonly days: DaySchedule[];
}
