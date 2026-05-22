import { expect } from '@jest/globals';
import { ScheduleFormatter } from '../services/ScheduleFormatter';
import { Employee } from '../models/Employee';
import { Building } from '../models/Building';
import { Schedule } from '../types';

const employee = new Employee('e1', 'Alice', 'certified', []);
const building = new Building('b1', 'Casa Nova', 'single_story');

const makeSchedule = (overrides: Partial<Schedule['days'][0]> = {}): Schedule => ({
  days: [
    { day: 'monday', assignments: [], unscheduled: [], ...overrides },
    { day: 'tuesday', assignments: [], unscheduled: [] },
    { day: 'wednesday', assignments: [], unscheduled: [] },
    { day: 'thursday', assignments: [], unscheduled: [] },
    { day: 'friday', assignments: [], unscheduled: [] },
  ],
});

describe('ScheduleFormatter.format', () => {
  it('formats a single assignment with building name and employee name + type', () => {
    const formatter = new ScheduleFormatter([employee], [building]);
    const schedule = makeSchedule({
      assignments: [{ buildingId: 'b1', employeeIds: ['e1'] }],
    });
    const output = formatter.format(schedule);
    expect(output).toContain('Casa Nova');
    expect(output).toContain('Alice (certified)');
  });

  it('lists buildings never scheduled in the UNSCHEDULED FOR THE WEEK section', () => {
    const formatter = new ScheduleFormatter([], [building]);
    const schedule = makeSchedule();
    const output = formatter.format(schedule);
    expect(output).toContain('UNSCHEDULED FOR THE WEEK');
    expect(output).toContain('Casa Nova');
  });

  it('shows (no work scheduled) for a day with no assignments and no unscheduled', () => {
    const formatter = new ScheduleFormatter([], []);
    const schedule = makeSchedule();
    const output = formatter.format(schedule);
    expect(output).toContain('(no work scheduled)');
  });

  it('prints a day header for each of the 5 days', () => {
    const formatter = new ScheduleFormatter([], []);
    const schedule = makeSchedule();
    const output = formatter.format(schedule);
    expect(output).toContain('Monday');
    expect(output).toContain('Friday');
  });
});
