'use strict';

(function(exports) {
  exports.SummonStore = {
    start: function() {
      this.nameMap = new Map();
      window.SSR_SUMMON_RAW.forEach(function(summon) {
        var summonData = {
          id: summon[0],
          name: summon[1],
          min_hp: +summon[8],
          min_atk: +summon[9],
          max_hp: +summon[10],
          max_atk: +summon[11],
          attribute: this.getElementAttribute(summon[2]),
          type: summon[3],
          rarity: 'ssr',
          max_level: 100
        };
        this.nameMap.set(summon[1], summonData);
      }, this);
    },

    getElementAttribute: function(name) {
      switch (name) {
        case '火':
          return 1;
          break;
        case '水':
          return 2;
          break;
        case '土':
          return 3;
          break;
        case '風':
          return 4
          break;
        case '光':
          return 5;
          break;
        case '闇':
          return 6;
          break;
      }
    },

    calculateAttackBladeAmount: function(config) {
      var data = this.nameMap.get(config.name);
      var skills = [data.skill1];
      if  (data.skill2) {
        skills.push(data.skill2);
      }
      var skillLevel = config.skillLevel;
      var total = [
        {
          normal: 0,
          unknown: 0,
          magna: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0
        }
      ];
      skills.forEach(function(skillName) {
        switch (skillName) {
          case 'アンノウン・ATK II':
          case '烈光の至恩':
          case '自動辻斬装置':
            total[+data.attribute - 1].unknown += (5 + skillLevel);
            break;
          case 'アンノウン・ATK':
          case 'アンノウン・ATK ':
            total[+data.attribute - 1].unknown += (2 + skillLevel);
            break;
          case '地裂の攻刃':
            total[2].normal += (5 + skillLevel);
            break;
          case '大地の攻刃':
            total[2].normal += (2 + skillLevel);
            break;
          case '土の攻刃':
            total[2].normal += (0 + skillLevel);
            break;
          case '創樹方陣・攻刃':
            total[2].magna += (2 + skillLevel);
            break;
          case '創樹方陣・攻刃II':
            total[2].magna += (5 + skillLevel);
            break;
          case '奈落の攻刃':
            total[5].normal += (5 + skillLevel);
            break;
          case '憎悪の攻刃':
            total[5].normal += (2 + skillLevel);
            break;
          case '闇の攻刃':
            total[5].normal += (0 + skillLevel);
            break;
          case '黑霧方陣・攻刃':
            total[5].magna += (2 + skillLevel);
            break;
          case '黑霧方陣・攻刃II':
            total[5].magna += (5 + skillLevel);
            break;
          case '天光の攻刃':
            total[4].normal += (5 + skillLevel);
            break;
          case '雷電の攻刃':
            total[4].normal += (2 + skillLevel);
            break;
          case '光の攻刃':
            total[4].normal += (0 + skillLevel);
            break;
          case '騎解方陣・攻刃':
            total[4].normal += (2 + skillLevel);
            break;
          case '騎解方陣・攻刃II':
            total[4].normal += (5 + skillLevel);
            break;
          case '紅蓮の攻刃':
          case '紅蓮の攻刃II':
            total[0].normal += (5 + skillLevel);
            break;
          case '業火の攻刃':
            total[0].normal += (2 + skillLevel);
            break;
          case '火の攻刃':
            total[0].normal += (0 + skillLevel);
            break;
          case '機炎方陣・攻刃':
            total[0].magna += (2 + skillLevel);
            break;
          case '機炎方陣・攻刃II':
            total[0].magna += (5 + skillLevel);
            break;
          case '霧氷の攻刃':
            total[1].normal += (5 + skillLevel);
            break;
          case '渦潮の攻刃':
            total[1].normal += (2 + skillLevel);
            break;
          case '水の攻刃':
            total[1].normal += (0 + skillLevel);
            break;
          case '海神方陣・攻刃':
            total[1].magna += (2 + skillLevel);
            break;
          case '海神方陣・攻刃II':
            total[1].magna += (5 + skillLevel);
            break;
          case '雷電の攻刃':
            total[3].normal += (5 + skillLevel);
            break;
          case '乱気の攻刃':
            total[3].normal += (2 + skillLevel);
            break;
          case '竜巻の攻刃':
            total[3].normal += (0 + skillLevel);
            break;
          case '嵐竜方陣・攻刃':
            total[3].magna += (2 + skillLevel);
            break;
          case '嵐竜方陣・攻刃II':
            total[3].magna += (5 + skillLevel);
            break;
          case 'ヒューマンアニムス・ウィス':
            total.forEach(function(a) {
              if (skillLevel === 10) {
                skillLevel = 11;
              }
              a.normal += (19 + skillLevel);
            });
            break;
          case 'コンキリオ・ルーベル':
            total.forEach(function(a) {
              if (skillLevel === 10) {
                skillLevel = 11;
              }
              a.normal += (9.5 + 0.5 * skillLevel);
            });
            break;
        }
      }, this);
      return total;
    },
    calculateRealData: function(config) {
      var data = this.nameMap.get(config.name);
      var isFinalEvo = data.finalLiberation;
      if (isFinalEvo) {
        var diffAtk = Math.ceil((data.lv100_atk - data.min_atk) / 100);
        var diffHp = Math.ceil((data.lv100_hp - data.min_hp) / 100);
        var diffAtk2 = Math.ceil((data.max_atk - data.lv100_atk) / 50);
        var diffHp2 = Math.ceil((data.max_hp - data.lv100_hp) / 50);
        if (+config.level === 1) {
          return {
            attack: data.min_atk + 5 * config.plus,
            hp: data.min_hp + 1 * config.plus
          }
        } else if (+config.level === 100) {
          return {
            attack: data.lv100_atk + 5 * config.plus,
            hp: data.lv100_hp + 1 * config.plus
          }
        } else if (+config.level === 2) {
          return {
            attack: data.min_atk + diffAtk * 2 + 5 * config.plus,
            hp: data.min_hp + diffHp * 2 + config.plus
          }
        } else if (+config.level < 100) {
          return {
            attack: data.min_atk + diffAtk * config.level + 5 * config.plus,
            hp: data.min_hp + diffHp * config.level + config.plus
          }
        } else {
          return {
            attack: data.lv100_atk + diffAtk2 * config.level + 5 * config.plus,
            hp: data.lv100_hp + diffHp2 * config.level + config.plus
          }
        }
      } else {
        var diffAtk = Math.ceil((data.max_atk - data.min_atk) / data.max_level);
        var diffHp = Math.ceil((data.max_hp - data.min_hp) / data.max_level);
        if (+config.level === 1) {
          return {
            attack: data.min_atk + 5 * config.plus,
            hp: data.min_hp + 1 * config.plus
          }
        } else if (+config.level === 100) {
          return {
            attack: data.max_atk + 5 * config.plus,
            hp: data.max_hp + 1 * config.plus
          }
        } else if (+config.level === 2) {
          return {
            attack: data.min_atk + diffAtk * 2 + 5 * config.plus,
            hp: data.min_hp + diffHp * 2 + config.plus
          }
        } else {
          return {
            attack: data.min_atk + diffAtk * config.level + 5 * config.plus,
            hp: data.min_hp + diffHp * config.level + config.plus
          }
        }
      }
    }
  };
}(window));
