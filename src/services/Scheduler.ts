import { Building } from '../models/Building';
import { Employee } from '../models/Employee';
import { EmployeePool } from './EmployeePool';
import { selectCrew } from './crewSelector';
import { DAYS, Schedule, DaySchedule, Assignment } from '../types';

export class Scheduler {
  private readonly buildings: Building[];
  private readonly employees: Employee[];

  constructor(buildings: Building[], employees: Employee[]) {
    this.buildings = buildings;
    this.employees = employees;
  }

  generateSchedule(): Schedule {
    const pool = new EmployeePool(this.employees);
    const scheduledBuildingIds = new Set<string>();
    const days: DaySchedule[] = [];

    for (const day of DAYS) {
      pool.reset(day);
      const assignments: Assignment[] = [];
      const unscheduled: string[] = [];

      for (const building of this.buildings) {
        if (scheduledBuildingIds.has(building.id)) continue;

        const available = pool.getAvailable(day);
        const crew = selectCrew(available, building.getRequirements());

        if (crew !== null) {
          crew.forEach((e) => pool.assign(e.id, day));
          assignments.push({ buildingId: building.id, employeeIds: crew.map((e) => e.id) });
          scheduledBuildingIds.add(building.id);
        } else {
          unscheduled.push(building.id);
        }
      }

      days.push({ day, assignments, unscheduled });
    }

    return { days };
  }
}
