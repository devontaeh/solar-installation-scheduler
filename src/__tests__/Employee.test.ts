import { Employee } from '../models/Employee';
import { Day } from '../types';
import { expect, describe, it } from '@jest/globals';

const makeEmployee = (unavailableDays: Day[] = []): Employee =>
  new Employee('emp_001', 'Alice', 'certified', unavailableDays);

describe('Employee.isAvailable', () => {
  it('is available every day when unavailableDays is empty', () => {
    const employee = makeEmployee([]);
    expect(employee.isAvailable('monday')).toBe(true);
    expect(employee.isAvailable('friday')).toBe(true);
  });

  it('is not available on a day in unavailableDays', () => {
    const employee = makeEmployee(['monday']);
    expect(employee.isAvailable('monday')).toBe(false);
  });

  it('is available on days not in unavailableDays', () => {
    const employee = makeEmployee(['monday']);
    expect(employee.isAvailable('tuesday')).toBe(true);
  });
});


