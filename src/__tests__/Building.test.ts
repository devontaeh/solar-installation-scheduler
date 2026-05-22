import { expect } from '@jest/globals';
import { Building } from '../models/Building';

describe('Building.getRequirements', () => {
  it('returns correct crew for single story', () => {
    const building = new Building('bld_001', 'Casa Nova', 'single_story');
    expect(building.getRequirements()).toEqual({ certified: 1, pending: 0, anyType: 0 });
  });

  it('returns correct crew for two story', () => {
    const building = new Building('bld_002', 'Hilltop House', 'two_story');
    expect(building.getRequirements()).toEqual({ certified: 1, pending: 0, anyType: 1 });
  });

  it('returns correct crew for commercial', () => {
    const building = new Building('bld_003', 'Aurora HQ', 'commercial');
    expect(building.getRequirements()).toEqual({ certified: 2, pending: 2, anyType: 4 });
  });
});
