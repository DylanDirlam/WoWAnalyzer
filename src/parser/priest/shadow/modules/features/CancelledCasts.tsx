import React from 'react';
import { When, ThresholdStyle } from 'parser/core/ParseResults';
import CoreCancelledCasts from 'parser/shared/modules/CancelledCasts';
import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';
import { Options } from 'parser/core/Analyzer';
import { Trans } from '@lingui/macro';

class CancelledCasts extends CoreCancelledCasts {
  constructor(options: Options) {
    super(options);
    this.IGNORED_ABILITIES = [
      //Include the spells that you do not want to be tracked
      SPELLS.MIND_FLAY.id,
      SPELLS.MIND_SEAR.id,
      SPELLS.SHADOW_MEND.id,
    ];
  }

  get cancelledPercentage() {
    return this.castsCancelled / this.totalCasts;
  }

  get suggestionThresholds() {
    return {
      actual: this.cancelledPercentage,
      isGreaterThan: {
        minor: 0.05,
        average: 0.07,
        major: 0.1,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  suggestions(when: When) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<>You cancelled {formatPercentage(this.cancelledPercentage)}% of your spells. While it is expected that you will have to cancel a few casts to react to boss mechanics or move, you should try to ensure that you are cancelling as few casts as possible by pre-moving to locations by stutterstepping.</>)
      .icon('inv_misc_map_01')
      .actual(<Trans id="priest.shadow.suggestions.castsCancelled">{formatPercentage(actual)}% casts cancelled</Trans>)
      .recommended(`<${formatPercentage(recommended)}% is recommended`));
  }
}

export default CancelledCasts;
