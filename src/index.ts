import { Employee } from './models/Employee';
import { Building } from './models/Building';
import { Scheduler } from './services/Scheduler';
import { ScheduleFormatter } from './services/ScheduleFormatter';

// DECISION: hardcoded demo over CLI args — prompt asks for proof of correctness,
// not a user-facing tool. Dataset is designed to exercise deferral, unavailability,
// and all three building types.

const employees: Employee[] = [
  new Employee('e1', 'Alice Carter',   'certified', []),
  new Employee('e2', 'Ben Torres',     'certified', ['monday']),
  new Employee('e3', 'Carmen Diaz',    'pending',   ['wednesday']),
  new Employee('e4', 'David Kim',      'pending',   []),
  new Employee('e5', 'Eva Rossi',      'laborer',   ['tuesday']),
  new Employee('e6', 'Frank Nguyen',   'laborer',   []),
  new Employee('e7', 'Grace Okafor',   'laborer',   []),
  new Employee('e8', 'Hiro Tanaka',    'laborer',   ['monday', 'friday']),
  new Employee('e9', 'Isabel Ferreira','certified',  ['thursday']),
  new Employee('e10','James Webb',     'pending',   []),
];

// Buildings listed in priority order (highest → lowest)
const buildings: Building[] = [
  new Building('b1', 'Riverside Commercial Plaza', 'commercial'),
  new Building('b2', 'Oakwood Two-Story Home',     'two_story'),
  new Building('b3', 'Maple Single-Story Home',    'single_story'),
  new Building('b4', 'Downtown Office Complex',    'commercial'),
  new Building('b5', 'Sunset Single-Story Home',   'single_story'),
  new Building('b6', 'Hillcrest Two-Story Home',   'two_story'),
];

// FUTURE: buildings that require multiple days (not in prompt scope)
// FUTURE: employee overtime / max hours per week
// FUTURE: crew preferences or skill matching beyond role type
// FUTURE: real date-based unavailability (not just day-of-week)

const scheduler = new Scheduler(buildings, employees);
const schedule = scheduler.generateSchedule();

const formatter = new ScheduleFormatter(employees, buildings);
console.log(formatter.format(schedule));

