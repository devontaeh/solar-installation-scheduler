import { Day, EmployeeType } from '../types';

export class Employee {
  readonly id: string;
  readonly name: string;
  readonly type: EmployeeType;
  readonly unavailableDays:  readonly Day[];

  constructor(id: string, name: string, type: EmployeeType, unavailableDays: Day[] = []) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.unavailableDays = unavailableDays;
  }

  isAvailable(day: Day): boolean {
    return !this.unavailableDays.includes(day);
  }
}
