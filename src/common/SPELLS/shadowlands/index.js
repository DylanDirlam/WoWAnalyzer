import safeMerge from 'common/safeMerge';

import Conduits from './conduits';
import Covenants from './covenants';
import Legendaries from './legendaries';

export default safeMerge(Conduits, Covenants, Legendaries);
