import { expect, describe, it } from '@jest/globals';
import { Employee } from '../models/Employee';
import { EmployeePool } from '../services/EmployeePool';
import { Day } from '../types';

const makeEmployee = (
  id: string,
  unavailableDays: Day[] = []
): Employee => new Employee(id, `Employee ${id}`, 'certified', unavailableDays);

describe('EmployeePool.getAvailable', () => {
  it('returns all employees when none are unavailable or assigned', () => {
    const employees = [makeEmployee('emp_001'), makeEmployee('emp_002')];
    const pool = new EmployeePool(employees);
    expect(pool.getAvailable('monday')).toHaveLength(2);
  });

  it('excludes employees whose unavailableDays includes the queried day', () => {
    const employees = [makeEmployee('emp_001', ['monday']), makeEmployee('emp_002')];
    const pool = new EmployeePool(employees);
    const available = pool.getAvailable('monday');
    expect(available).toHaveLength(1);
    expect(available[0].id).toBe('emp_002');
  });

  it('excludes employees already assigned on the same day', () => {
    const employees = [makeEmployee('emp_001'), makeEmployee('emp_002')];
    const pool = new EmployeePool(employees);
    pool.assign('emp_001', 'monday');
    const available = pool.getAvailable('monday');
    expect(available).toHaveLength(1);
    expect(available[0].id).toBe('emp_002');
  });

  it('an employee assigned on monday is still available on tuesday', () => {
    const employees = [makeEmployee('emp_001')];
    const pool = new EmployeePool(employees);
    pool.assign('emp_001', 'monday');
    expect(pool.getAvailable('tuesday')).toHaveLength(1);
  });
});
