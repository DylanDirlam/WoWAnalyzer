import React from 'react';

import Analyzer, { Options } from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import { formatPercentage, formatNumber } from 'common/format';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import { t } from '@lingui/macro';
import calculateMaxCasts from 'parser/core/calculateMaxCasts';
import StatTracker from 'parser/shared/modules/StatTracker';

import Abilities from '../Abilities';
import DissonantEchoes from '../shadowlands/conduits/DissonantEchoes';

class VoidBolt extends Analyzer {

  static dependencies = {
    spellUsable: SpellUsable,
    abilities: Abilities,
    statTracker: StatTracker,
    dissonantEchoes: DissonantEchoes,
  };
  protected spellUsable!: SpellUsable;
  protected abilities!: Abilities;
  protected statTracker!: StatTracker;
  protected dissonantEchoes!: DissonantEchoes;

  constructor(options: Options) {
    super(options);

    (options.abilities as Abilities).add({
      spell: SPELLS.VOID_BOLT,
      category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
      cooldown: (haste: number) => 4.5 / (1 + haste),
      gcd: {
        base: 1500,
      },
      castEfficiency: {
        suggestion: true,
        recommendedEfficiency: 0.85,
        maxCasts: () => this.maxCasts + this.dissonantEchoes.procsGained,
      },
    });
  }

      //   category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
      //   cooldown: (haste: number) => 4.5 / (1 + haste),
      //   gcd: {
      //     base: 1500,
      //   },
      //   castEfficiency: {
      //     suggestion: true,
      //     recommendedEfficiency: 0.85,
      //     maxCasts: (cooldown: number) => calculateMaxCasts(cooldown, combatant.getBuffUptime(SPELLS.VOIDFORM_BUFF.id)),
      //   },
      // },

  get maxCasts() {
    const cooldown = this.abilities.getAbility(SPELLS.VOID_BOLT.id)!.cooldown;
    const buffUptime = this.selectedCombatant.getBuffUptime(SPELLS.VOIDFORM_BUFF.id);
    return calculateMaxCasts(cooldown, buffUptime);
  }

  get suggestionThresholds() {
    return {
      actual: this.maxCasts,
      isLessThan: {
        minor: 0.95,
        average: 0.90,
        major: 0.8,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  suggestions(when: When) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<span>Your <SpellLink id={SPELLS.VAMPIRIC_TOUCH.id} /> uptime can be improved. Try to pay more attention to your <SpellLink id={SPELLS.VAMPIRIC_TOUCH.id} /> on the boss.</span>)
        .icon(SPELLS.VAMPIRIC_TOUCH.icon)
        .actual(t({
      id: "priest.shadow.suggestions.vampiricTouch.uptime",
      message: `${formatPercentage(actual)}% Vampiric Touch uptime`
    }))
        .recommended(`>${formatPercentage(recommended)}% is recommended`));
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(3)}
        size="flexible"
      >
        <BoringSpellValueText spell={SPELLS.VOID_BOLT}>
          <>
            {formatNumber(this.maxCasts)} <small>Max Casts</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default VoidBolt;
