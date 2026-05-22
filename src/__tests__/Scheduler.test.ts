import { expect, describe, it } from '@jest/globals';
import { Scheduler } from '../services/Scheduler';
import { Employee } from '../models/Employee';
import { Building } from '../models/Building';
import { Day } from '../types';

const makeCertified = (id: string, unavailableDays: Day[] = []): Employee =>
  new Employee(id, `Certified ${id}`, 'certified', unavailableDays);

const makePending = (id: string, unavailableDays: Day[] = []): Employee =>
  new Employee(id, `Pending ${id}`, 'pending', unavailableDays);

const makeLaborer = (id: string, unavailableDays: Day[] = []): Employee =>
  new Employee(id, `Laborer ${id}`, 'laborer', unavailableDays);

const makeSingleStory = (id: string): Building => new Building(id, `Single ${id}`, 'single_story');
const makeTwoStory = (id: string): Building => new Building(id, `Two Story ${id}`, 'two_story');
const makeCommercial = (id: string): Building => new Building(id, `Commercial ${id}`, 'commercial');

describe('Scheduler.generateSchedule', () => {
  it('returns a schedule with exactly 5 days', () => {
    const scheduler = new Scheduler([], []);
    const schedule = scheduler.generateSchedule();
    expect(schedule.days).toHaveLength(5);
  });

  it('schedules all buildings when crew is always sufficient', () => {
    const employees = [makeCertified('e1'), makeCertified('e2')];
    const buildings = [makeSingleStory('b1'), makeSingleStory('b2')];
    const scheduler = new Scheduler(buildings, employees);
    const schedule = scheduler.generateSchedule();

    const allAssigned = schedule.days.flatMap((d) => d.assignments.map((a) => a.buildingId));
    expect(allAssigned).toContain('b1');
    expect(allAssigned).toContain('b2');
  });

  it('defers a building to next available day when employee is unavailable', () => {
    const employees = [makeCertified('e1', ['monday'])];
    const buildings = [makeSingleStory('b1')];
    const scheduler = new Scheduler(buildings, employees);
    const schedule = scheduler.generateSchedule();

    const monday = schedule.days.find((d) => d.day === 'monday')!;
    const tuesday = schedule.days.find((d) => d.day === 'tuesday')!;

    expect(monday.assignments).toHaveLength(0);
    expect(tuesday.assignments.map((a) => a.buildingId)).toContain('b1');
  });

  it('leaves a building unscheduled all week if crew is never sufficient', () => {
    const employees: Employee[] = [];
    const buildings = [makeSingleStory('b1')];
    const scheduler = new Scheduler(buildings, employees);
    const schedule = scheduler.generateSchedule();

    const allAssigned = schedule.days.flatMap((d) => d.assignments.map((a) => a.buildingId));
    expect(allAssigned).not.toContain('b1');
  });

  it('higher priority building wins employee when two buildings compete', () => {
    const employees = [makeCertified('e1')];
    const buildings = [makeSingleStory('b1'), makeSingleStory('b2')];
    const scheduler = new Scheduler(buildings, employees);
    const schedule = scheduler.generateSchedule();

    const monday = schedule.days.find((d) => d.day === 'monday')!;
    const assignedIds = monday.assignments.map((a) => a.buildingId);

    expect(assignedIds).toContain('b1');
    expect(assignedIds).not.toContain('b2');
  });

  it('does not reschedule a building that was already completed', () => {
    const employees = [makeCertified('e1')];
    const buildings = [makeSingleStory('b1')];
    const scheduler = new Scheduler(buildings, employees);
    const schedule = scheduler.generateSchedule();

    const timesScheduled = schedule.days
      .flatMap((d) => d.assignments)
      .filter((a) => a.buildingId === 'b1').length;

    expect(timesScheduled).toBe(1);
  });

  it('schedules a two story building with correct crew', () => {
    const employees = [makeCertified('e1'), makeLaborer('e2')];
    const buildings = [makeTwoStory('b1')];
    const scheduler = new Scheduler(buildings, employees);
    const schedule = scheduler.generateSchedule();

    const assignment = schedule.days.flatMap((d) => d.assignments).find((a) => a.buildingId === 'b1');
    expect(assignment).toBeDefined();
    expect(assignment!.employeeIds).toHaveLength(2);
  });

  it('schedules a commercial building with correct crew of 8', () => {
    const employees = [
      makeCertified('e1'), makeCertified('e2'),
      makePending('e3'), makePending('e4'),
      makeLaborer('e5'), makeLaborer('e6'), makeLaborer('e7'), makeLaborer('e8'),
    ];
    const buildings = [makeCommercial('b1')];
    const scheduler = new Scheduler(buildings, employees);
    const schedule = scheduler.generateSchedule();

    const assignment = schedule.days.flatMap((d) => d.assignments).find((a) => a.buildingId === 'b1');
    expect(assignment).toBeDefined();
    expect(assignment!.employeeIds).toHaveLength(8);
  });

  // Edge cases
  it('returns 5 empty days when buildings list is empty', () => {
    const scheduler = new Scheduler([], [makeCertified('e1')]);
    const schedule = scheduler.generateSchedule();
    expect(schedule.days).toHaveLength(5);
    schedule.days.forEach((d) => expect(d.assignments).toHaveLength(0));
  });

  it('marks all buildings unscheduled every day when employees list is empty', () => {
    const buildings = [makeSingleStory('b1'), makeSingleStory('b2')];
    const scheduler = new Scheduler(buildings, []);
    const schedule = scheduler.generateSchedule();
    const allAssigned = schedule.days.flatMap((d) => d.assignments);
    expect(allAssigned).toHaveLength(0);
  });

  it('leaves all buildings unscheduled when all employees are unavailable all week', () => {
    const allDays: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const employees = [makeCertified('e1', allDays)];
    const buildings = [makeSingleStory('b1')];
    const scheduler = new Scheduler(buildings, employees);
    const schedule = scheduler.generateSchedule();
    const allAssigned = schedule.days.flatMap((d) => d.assignments.map((a) => a.buildingId));
    expect(allAssigned).not.toContain('b1');
  });

  it('leaves commercial building unscheduled when one employee short of minimum', () => {
    const employees = [
      makeCertified('e1'), makeCertified('e2'),
      makePending('e3'), makePending('e4'),
      makeLaborer('e5'), makeLaborer('e6'), makeLaborer('e7'),
      // missing one worker — 7 total, need 8
    ];
    const buildings = [makeCommercial('b1')];
    const scheduler = new Scheduler(buildings, employees);
    const schedule = scheduler.generateSchedule();
    const allAssigned = schedule.days.flatMap((d) => d.assignments.map((a) => a.buildingId));
    expect(allAssigned).not.toContain('b1');
  });
});
