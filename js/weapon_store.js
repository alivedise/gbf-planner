'use strict';

(function(exports) {
  exports.WeaponStore = {
    start: function() {
      this.nameMap = new Map();
      this.idMap = new Map();
      window.SSR_WEAPON_RAW.forEach(function(weapon) {
        var weaponData = {
          id: weapon[0],
          name: weapon[1],
          min_hp: +weapon[8],
          min_atk: +weapon[9],
          max_hp: +weapon[10],
          max_atk: +weapon[11],
          attribute: this.getElementAttribute(weapon[2]),
          type: weapon[3],
          skill1: weapon[6],
          skill2: weapon[7],
          rarity: 'ssr',
          finalLiberation: weapon[14] !== '',
          max_level: (weapon[14] !== '') ? 150 : 100
        };
        this.nameMap.set(weapon[1], weaponData);
        if (!weapon[14]) {
          this.idMap.set(weapon[0], weaponData)
        }
      }, this);
      this.parseFinalRevolution();
    },
    parseFinalRevolution: function() {
      this.nameMap.forEach(function(data) {
        if (data.finalLiberation) {
          var baseWeapon = this.idMap.get(data.id);
          data.lv100_atk = baseWeapon.max_atk;
          data.lv100_hp = baseWeapon.max_hp;
        }
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
          magna: 0,
          magnals: 0,
          normalls: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          magnals: 0,
          normalls: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          magnals: 0,
          normalls: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          magnals: 0,
          normalls: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          magnals: 0,
          normalls: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          magnals: 0,
          normalls: 0
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
          case '地裂の攻刃II':
            if (skillLevel <= 10) {
              total[2].normal += (6 + skillLevel);
            } else {
              total[2].normal += (16 + 0.8 * (skillLevel - 10));
            }
            break;
          case '大地の攻刃':
            total[2].normal += (2 + skillLevel);
            break;
          case '土の攻刃':
            total[2].normal += (0 + skillLevel);
            break;
          case '創樹方陣・攻刃':
            if (skillLevel <= 10) {
              total[2].magna += (2 + skillLevel);
            } else {
              total[2].magna += (12 + 0.5 * (skillLevel - 10));
            }
            break;
          case '創樹方陣・攻刃II':
            if (skillLevel <= 10) {
              total[2].magna += (5 + skillLevel);
            } else {
              total[2].magna += (15 + 0.5 * (skillLevel - 10));
            }
            break;
          case '創樹方陣・攻刃II':
            var bw_coefficient = 12;
            if ( skill_level < 10 ) {
              bw_coefficient += -0.3 + skillLevel * 1.8;
            } else {
              bw_coefficient += 18 + (skillLevel - 10) * 3 / 5;
            }
            total[2].magnals += bw_coefficient / 3;
            break;
          case '奈落の攻刃':
            total[5].normal += (5 + skillLevel);
            break;
          case '奈落の攻刃II':
            if (skillLevel <= 10) {
              total[5].normal += (6 + skillLevel);
            } else {
              total[5].normal += (16 + 0.8 * (skillLevel - 10));
            }
            break;
          case '憎悪の攻刃':
            total[5].normal += (2 + skillLevel);
            break;
          case '闇の攻刃':
            total[5].normal += (0 + skillLevel);
            break;
          case '黑霧方陣・攻刃':
            if (skillLevel <= 10) {
              total[5].magna += (2 + skillLevel);
            } else {
              total[5].magna += (12 + 0.5 * (skillLevel - 10));
            }
            break;
          case '黑霧方陣・攻刃II':
            if (skillLevel <= 10) {
              total[5].magna += (5 + skillLevel);
            } else {
              total[5].magna += (15 + 0.5 * (skillLevel - 10));
            }
            break;
          case '天光の攻刃II':
            if (skillLevel <= 10) {
              total[4].normal += (6 + skillLevel);
            } else {
              total[4].normal += (16 + 0.8 * (skillLevel - 10));
            }
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
            if (skillLevel <= 10) {
              total[4].magna += (2 + skillLevel);
            } else {
              total[4].magna += (12 + 0.5 * (skillLevel - 10));
            }
            break;
          case '騎解方陣・攻刃II':
            if (skillLevel <= 10) {
              total[4].magna += (5 + skillLevel);
            } else {
              total[4].magna += (15 + 0.5 * (skillLevel - 10));
            }
            break;
          case '紅蓮の攻刃':
            total[0].normal += (5 + skillLevel);
            break;
          case '紅蓮の攻刃II':
            if (skillLevel <= 10) {
              total[0].normal += (6 + skillLevel);
            } else {
              total[0].normal += (16 + 0.8 * (skillLevel - 10));
            }
            break;
          case '業火の攻刃':
            total[0].normal += (2 + skillLevel);
            break;
          case '火の攻刃':
            total[0].normal += (0 + skillLevel);
            break;
          case '機炎方陣・攻刃':
            if (skillLevel <= 10) {
              total[0].magna += (2 + skillLevel);
            } else {
              total[0].magna += (12 + 0.5 * (skillLevel - 10));
            }
            break;
          case '機炎方陣・攻刃II':
            if (skillLevel <= 10) {
              total[0].magna += (5 + skillLevel);
            } else {
              total[0].magna += (15 + 0.5 * (skillLevel - 10));
            }
            break;
          case '機炎方陣・攻刃II':
            var bw_coefficient = 12;
            if ( skill_level < 10 ) {
              bw_coefficient += -0.3 + skillLevel * 1.8;
            } else {
              bw_coefficient += 18 + (skillLevel - 10) * 3 / 5;
            }
            total[0].magnals += bw_coefficient / 3;
            break;
          case '霧氷の攻刃':
            total[1].normal += (5 + skillLevel);
            break;
          case '霧氷の攻刃II':
            if (skillLevel <= 10) {
              total[1].normal += (6 + skillLevel);
            } else {
              total[1].normal += (16 + 0.8 * (skillLevel - 10));
            }
            break;
          case '渦潮の攻刃':
            total[1].normal += (2 + skillLevel);
            break;
          case '水の攻刃':
            total[1].normal += (0 + skillLevel);
            break;
          case '海神方陣・攻刃':
            if (skillLevel <= 10) {
              total[1].magna += (2 + skillLevel);
            } else {
              total[1].magna += (12 + 0.5 * (skillLevel - 10));
            }
            break;
          case '海神方陣・攻刃II':
            if (skillLevel <= 10) {
              total[1].magna += (5 + skillLevel);
            } else {
              total[1].magna += (15 + 0.5 * (skillLevel - 10));
            }
            break;
          case '雷電の攻刃':
            total[3].normal += (5 + skillLevel);
            break;
          case '乱気の攻刃II':
            if (skillLevel <= 10) {
              total[3].normal += (6 + skillLevel);
            } else {
              total[3].normal += (16 + 0.8 * (skillLevel - 10));
            }
            break;
          case '乱気の攻刃':
            total[3].normal += (2 + skillLevel);
            break;
          case '竜巻の攻刃':
            total[3].normal += (0 + skillLevel);
            break;
          case '嵐竜方陣・攻刃':
            if (skillLevel <= 10) {
              total[3].magna += (2 + skillLevel);
            } else {
              total[3].magna += (12 + 0.5 * (skillLevel - 10));
            }
            break;
          case '嵐竜方陣・背水':
            var bw_coefficient = 0;
            if ( skill_level < 10 ) {
              bw_coefficient += -0.3 + skillLevel * 1.8;
            } else {
              bw_coefficient += 18 + (skillLevel - 10) * 3 / 5;
            }
            total[3].magnals += bw_coefficient / 3;
            break;
          case '嵐竜方陣・攻刃II':
            if (skillLevel <= 10) {
              total[3].magna += (5 + skillLevel);
            } else {
              total[3].magna += (15 + 0.5 * (skillLevel - 10));
            }
            break;
          case 'ヒューマンアニムス・ウィス':
          case 'ヒュムアニムス・ウィス':
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
            hp: data.min_hp + 1 * config.plus,
            amount: this.calculateAttackBladeAmount(config)
          }
        } else if (+config.level === 100) {
          return {
            attack: data.lv100_atk + 5 * config.plus,
            hp: data.lv100_hp + 1 * config.plus,
            amount: this.calculateAttackBladeAmount(config)
          }
        } else if (+config.level === 2) {
          return {
            attack: data.min_atk + diffAtk * 2 + 5 * config.plus,
            hp: data.min_hp + diffHp * 2 + config.plus,
            amount: this.calculateAttackBladeAmount(config)
          }
        } else if (+config.level < 100) {
          return {
            attack: data.min_atk + diffAtk * config.level + 5 * config.plus,
            hp: data.min_hp + diffHp * config.level + config.plus,
            amount: this.calculateAttackBladeAmount(config)
          }
        } else {
          return {
            attack: data.lv100_atk + diffAtk2 * config.level + 5 * config.plus,
            hp: data.lv100_hp + diffHp2 * config.level + config.plus,
            amount: this.calculateAttackBladeAmount(config)
          }
        }
      } else {
        var diffAtk = Math.ceil((data.max_atk - data.min_atk) / data.max_level);
        var diffHp = Math.ceil((data.max_hp - data.min_hp) / data.max_level);
        if (+config.level === 1) {
          return {
            attack: data.min_atk + 5 * config.plus,
            hp: data.min_hp + 1 * config.plus,
            amount: this.calculateAttackBladeAmount(config)
          }
        } else if (+config.level === 100) {
          return {
            attack: data.max_atk + 5 * config.plus,
            hp: data.max_hp + 1 * config.plus,
            amount: this.calculateAttackBladeAmount(config)
          }
        } else if (+config.level === 2) {
          return {
            attack: data.min_atk + diffAtk * 2 + 5 * config.plus,
            hp: data.min_hp + diffHp * 2 + config.plus,
            amount: this.calculateAttackBladeAmount(config)
          }
        } else {
          return {
            attack: data.min_atk + diffAtk * config.level + 5 * config.plus,
            hp: data.min_hp + diffHp * config.level + config.plus,
            amount: this.calculateAttackBladeAmount(config)
          }
        }
      }
    }
  };
}(window));
