import { createConsultant } from '@/test-helper/createConsultant';
import { findOverhead } from './findOverhead';

describe('Test findOverhead', () => {
  const companyId = 'mlmania';
  const overHead = createConsultant({
    companyId,
    role: {
      id: 1,
      name: 'overhead',
    },
    upline: null,
  });

  const ausbilder = createConsultant({
    companyId,
    role: {
      id: 2,
      name: 'ausbilder',
    },
    upline: overHead.id,
  });

  const azubi = createConsultant({
    companyId,
    role: {
      id: 3,
      name: 'azubi',
    },
    upline: ausbilder.id,
  });

  const otherConsultants = [overHead, ausbilder, azubi];

  test('Find overhead from lowest rank', () => {
    // Act
    const result = findOverhead({
      consultant: azubi,
      otherConsultants,
    });
    // Assert
    expect(result).toStrictEqual(overHead);
  });

  test('Find overhead from second lowest rank', () => {
    // Act
    const result = findOverhead({
      consultant: ausbilder,
      otherConsultants,
    });
    // Assert
    expect(result).toStrictEqual(overHead);
  });

  test('Find overhead from already overhead', () => {
    // Act
    const result = findOverhead({
      consultant: overHead,
      otherConsultants,
    });
    // Assert
    expect(result).toStrictEqual(overHead);
  });
});
