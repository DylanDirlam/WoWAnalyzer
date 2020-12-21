import React from 'react';

import { Abelito75, Adoraci, Sharrq, Zeboot } from 'CONTRIBUTORS';
import { change, date } from 'common/changelog';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

export default [
  change(
    date(2020, 12, 21),
    <>
      Added <SpellLink id={SPELLS.UNFURLING_DARKNESS_TALENT.id} /> and{' '}
      <SpellLink id={SPELLS.FORTRESS_OF_THE_MIND_TALENT.id} /> modules.
    </>,
    [Adoraci],
  ),
  change(date(2020, 12, 10), <>Corrected Power Infusion spell Id.</>, [Abelito75]),
  change(date(2020, 10, 23), <>Update example log to more recent one.</>, [Adoraci]),
  change(date(2020, 10, 18), <>Converted legacy listeners to new event filters</>, Zeboot),
  change(date(2020, 10, 17), <>Updated for Shadowlands Pre-Patch.</>, [Adoraci]),
  change(
    date(2020, 9, 21),
    <>
      Removed Azerite Traits and Added Event Listeners, Centralized Constants, and Integration
      Tests.{' '}
    </>,
    [Sharrq],
  ),
];
