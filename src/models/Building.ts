import { BuildingType, CrewRequirement } from '../types';

const REQUIREMENTS: Record<BuildingType, CrewRequirement> = {
  single_story: { certified: 1, pending: 0, anyType: 0 },
  two_story: { certified: 1, pending: 0, anyType: 1 },
  commercial: { certified: 2, pending: 2, anyType: 4 },
};

export class Building {
  readonly id: string;
  readonly name: string;
  readonly type: BuildingType;

  constructor(id: string, name: string, type: BuildingType) {
    this.id = id;
    this.name = name;
    this.type = type;
  }

  getRequirements(): CrewRequirement {
    return REQUIREMENTS[this.type];
  }
}
