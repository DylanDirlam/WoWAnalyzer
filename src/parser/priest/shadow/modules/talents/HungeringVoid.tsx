import React from 'react';

import SPELLS from 'common/SPELLS/index';
import SpellLink from 'common/SpellLink';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { DamageEvent } from 'parser/core/Events';
import Statistic from 'interface/statistics/Statistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import { t } from '@lingui/macro';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import { formatDuration, formatNumber } from 'common/format';
import HIT_TYPES from 'game/HIT_TYPES';

import { VOID_FORM_ACTIVATORS } from '../../constants';

// Example Log: /report/hmJqLPZ7GVgY1CNa/16-Normal+Fetid+Devourer+-+Kill+(1:52)/44-베시잉/events

class HungeringVoid extends Analyzer {

  _voidforms: any = [];

  constructor(options: Options) {
    super(options);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(VOID_FORM_ACTIVATORS), this.startVoidform);
    this.addEventListener(Events.removebuff.by(SELECTED_PLAYER).spell(SPELLS.VOIDFORM_BUFF), this.endVoidform);
    this.addEventListener(Events.fightend, this.onFinished);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.VOID_BOLT), this.onVoidBoltDamage);
  }

  get voidforms() {
    return Object.keys(this._voidforms).map(key => this._voidforms[key]);
  }

  // get suggestionThresholds() {
  //   return {
  //     actual: this.totalWasted,
  //     isGreaterThan: {
  //       minor: 0.2,
  //       average: 0.5,
  //       major: 2,
  //     },
  //     style: ThresholdStyle.SECONDS,
  //   };
  // }

  get currentVoidform() {
    if (this.voidforms && this.voidforms.length > 0) {
      return this._voidforms[this.voidforms[this.voidforms.length - 1].start];
    } else {
      return false;
    }
  }

  get averageVoidformExtension() {
    return this.voidforms.reduce((total: any, voidform: any) => total + this.getVoidformExtension(voidform), 0) / this.voidforms.length
  }

  getVoidformExtension(voidform: any) {
    return (voidform.voidBoltCrits * 2) + voidform.voidBoltNormalHits;
  }

  startVoidform(event: any) {
    this._voidforms[event.timestamp] = {
      start: event.timestamp,
      voidBoltCrits: 0,
      voidBoltNormalHits: 0,
    };
  }

  onVoidBoltDamage(event: DamageEvent) {
    // Sometimes the void bolt will still be in travel while VF falls off and it doesn't extend
    if (event.timestamp > this.currentVoidform.end) {
      return
    }

    if (event.hitType === HIT_TYPES.CRIT) {
      this.currentVoidform.voidBoltCrits += 1;
    } else {
      this.currentVoidform.voidBoltNormalHits += 1;
    }
  }

  endVoidform(event: any) {
    this.currentVoidform.end = event.timestamp;
  }

  onFinished() {
    if (this.selectedCombatant.hasBuff(SPELLS.VOIDFORM_BUFF.id)) {
      // end last voidform of the fight:
      this.endVoidform({ timestamp: this.owner._timestamp });
    }
  }

  // suggestions(when: When) {
  //   when(this.suggestionThresholds)
  //     .addSuggestion((suggest, actual, recommended) => suggest(<>You interrupted <SpellLink id={SPELLS.VOID_TORRENT_TALENT.id} /> early, wasting {formatSeconds(this.totalWasted)} channeling seconds! Try to position yourself & time it so you don't get interrupted due to mechanics.</>)
  //       .icon(SPELLS.VOID_TORRENT_TALENT.icon)
  //       .actual(t({
  //     id: "priest.shadow.suggestions.voidTorrent.secondsLost",
  //     message: `Lost ${formatSeconds(actual)} seconds of Void Torrent.`
  //   }))
  //       .recommended('No time wasted is recommended.'));
  // }

  statistic() {
    return (
      <Statistic
        category={STATISTIC_CATEGORY.TALENTS}
        size="flexible"
        dropdown={(
          <>
            <table className="table table-condensed">
              <thead>
                <tr>
                  <td className="text-left"><b>Voidform</b></td>
                  <td><b>VB Casts</b></td>
                  <td><b>Extension</b></td>
                </tr>
              </thead>
              <tbody>
                {
                  this.voidforms.map((voidform, idx) => (
                    <tr key={idx}>
                      <td className="text-left">
                        {formatDuration((voidform.start - this.owner.fight.start_time) / 1000) || 0} &rarr; {formatDuration((voidform.end - this.owner.fight.start_time) / 1000) || 0}
                      </td>
                      <td>{formatNumber(voidform.voidBoltNormalHits + voidform.voidBoltCrits)}</td>
                      <td>{formatNumber(this.getVoidformExtension(voidform))}s</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.HUNGERING_VOID_TALENT}>
          <>
            {formatNumber(this.averageVoidformExtension)}s <small>Average Voidform Extension</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default HungeringVoid;
