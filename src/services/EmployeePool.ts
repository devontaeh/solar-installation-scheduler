import { Employee } from '../models/Employee';
import { Day } from '../types';

export class EmployeePool {
  private readonly employees: Employee[];
  private readonly assignedByDay: Map<Day, Set<string>>;

  constructor(employees: Employee[]) {
    this.employees = employees;
    this.assignedByDay = new Map();
  }

  getAvailable(day: Day): Employee[] {
    const assigned = this.assignedByDay.get(day) ?? new Set<string>();
    return this.employees.filter(
      (e) => e.isAvailable(day) && !assigned.has(e.id)
    );
  }

  assign(employeeId: string, day: Day): void {
    if (!this.assignedByDay.has(day)) {
      this.assignedByDay.set(day, new Set());
    }
    this.assignedByDay.get(day)!.add(employeeId);
  }
}
