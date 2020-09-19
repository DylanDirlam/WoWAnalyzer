import React from 'react';

import { Putro } from 'CONTRIBUTORS';
import { change, date } from 'common/changelog';
import ResourceLink from 'common/ResourceLink';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';

export default [
  change(date(2020, 8, 14), 'Updated Marksmanship module following beta build 35522', Putro),
  change(date(2020, 8, 12), <> Generalized the hunter <ResourceLink id={RESOURCE_TYPES.FOCUS.id} /> module and fixed a few issues with it. </>, Putro),
  change(date(2020, 8, 8), 'Marksmanship modules updated for Shadowlands', Putro),
];
