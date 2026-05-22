import { Building } from '../models/Building';
import { Employee } from '../models/Employee';
import { Schedule } from '../types';

export class ScheduleFormatter {
  private readonly employees: Employee[];
  private readonly buildings: Building[];
  private readonly employeeMap: Map<string, Employee>;
  private readonly buildingMap: Map<string, Building>;

  constructor(employees: Employee[], buildings: Building[]) {
    this.employees = employees;
    this.buildings = buildings;
    this.employeeMap = new Map(employees.map((e) => [e.id, e]));
    this.buildingMap = new Map(buildings.map((b) => [b.id, b]));
  }

  format(schedule: Schedule): string {
    return [
      'Aurora Scheduler — Work Schedule',
      '',
      this.formatEmployeesSection(),
      '',
      this.formatBuildingsSection(),
      '',
      this.formatWeeklyScheduleSection(schedule),
      '',
      this.formatUnscheduledSection(schedule),
    ].join('\n');
  }

  private formatEmployeesSection(): string {
    const header = `EMPLOYEES\n${'─'.repeat(40)}`;
    const lines = this.employees.map((e) => {
      const unavailable = e.unavailableDays.length > 0
        ? `unavailable: ${e.unavailableDays.join(', ')}`
        : 'available all week';
      return `  ${e.id.padEnd(4)}  ${e.name.padEnd(20)}  ${e.type.padEnd(11)}  ${unavailable}`;
    });
    return [header, ...lines].join('\n');
  }

  private formatBuildingsSection(): string {
    const header = `BUILDINGS\n${'─'.repeat(40)}`;
    const lines = this.buildings.map((b) =>
      `  ${b.id.padEnd(4)}  ${b.name.padEnd(35)}  ${b.type}`
    );
    return [header, ...lines].join('\n');
  }

  private formatWeeklyScheduleSection(schedule: Schedule): string {
    const header = `WEEKLY SCHEDULE`;
    const dayBlocks = schedule.days.map((daySchedule) => {
      const dayHeader = `${this.capitalize(daySchedule.day)}\n${'─'.repeat(40)}`;

      if (daySchedule.assignments.length === 0) {
        return `${dayHeader}\n  (no work scheduled)`;
      }

      const assignmentLines = daySchedule.assignments.map((assignment) => {
        const building = this.buildingMap.get(assignment.buildingId);
        const buildingName = building?.name ?? assignment.buildingId;
        const crew = assignment.employeeIds.map((id) => {
          const employee = this.employeeMap.get(id);
          return employee ? `${employee.name} (${employee.type})` : id;
        });
        return `  ${buildingName} → ${crew.join(', ')}`;
      });

      return [dayHeader, ...assignmentLines].join('\n');
    });
    return [header, ...dayBlocks].join('\n\n');
  }

  private formatUnscheduledSection(schedule: Schedule): string {
    const header = `UNSCHEDULED FOR THE WEEK\n${'─'.repeat(40)}`;
    const scheduledIds = new Set(
      schedule.days.flatMap((d) => d.assignments.map((a) => a.buildingId))
    );
    const neverScheduled = this.buildings.filter((b) => !scheduledIds.has(b.id));
    if (neverScheduled.length === 0) {
      return `${header}\n  (all buildings scheduled)`;
    }
    const lines = neverScheduled.map((b) => `  ${b.name}`);
    return [header, ...lines].join('\n');
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
