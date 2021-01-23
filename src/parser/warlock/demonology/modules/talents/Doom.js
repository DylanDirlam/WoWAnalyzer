import React from 'react';

import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Enemies from 'parser/shared/modules/Enemies';
import Events from 'parser/core/Events';

import SPELLS from 'common/SPELLS';
import SpellLink from 'interface/SpellLink';
import { formatPercentage, formatThousands } from 'common/format';

import STATISTIC_CATEGORY from 'interface/STATISTIC_CATEGORY';
import Statistic from 'interface/statistics/Statistic';
import BoringSpellValueText from 'interface/statistics/BoringSpellValueText';
import ItemDamageDone from 'interface/ItemDamageDone';
import UptimeIcon from 'interface/icons/Uptime';
import { t } from '@lingui/macro';

class Doom extends Analyzer {
  get uptime() {
    return this.enemies.getBuffUptime(SPELLS.DOOM_TALENT.id) / this.owner.fightDuration;
  }

  get suggestionThresholds() {
    return {
      actual: this.uptime,
      isLessThan: {
        minor: 0.95,
        average: 0.9,
        major: 0.8,
      },
      style: 'percentage',
    };
  }

  static dependencies = {
    enemies: Enemies,
  };
  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.DOOM_TALENT.id);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.DOOM_TALENT), this.handleDoomDamage);
  }

  handleDoomDamage(event) {
    this.damage += event.amount + (event.absorbed || 0);
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<>Your <SpellLink id={SPELLS.DOOM_TALENT.id} /> uptime can be improved. Try to pay more attention to your Doom on the boss, as it is one of your Soul Shard generators.</>)
        .icon(SPELLS.DOOM_TALENT.icon)
        .actual(t({
      id: "warlock.demonology.suggestions.doom.uptime",
      message: `${formatPercentage(actual)}% Doom uptime`
    }))
        .recommended(`>${formatPercentage(recommended)}% is recommended`));
  }

  statistic() {
    return (
      <Statistic
        category={STATISTIC_CATEGORY.TALENTS}
        size="flexible"
        tooltip={`${formatThousands(this.damage)} damage`}
      >
        <BoringSpellValueText spell={SPELLS.DOOM_TALENT}>
          <ItemDamageDone amount={this.damage} /><br />
          <UptimeIcon /> {formatPercentage(this.uptime)}% <small>Uptime</small>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default Doom;
