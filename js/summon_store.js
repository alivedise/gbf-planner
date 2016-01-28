'use strict';

(function(exports) {
  exports.SummonStore = {
    start: function() {
      this.idLimitMap = new Map();
      this.baseIdMap = new Map();
      window.SSR_SUMMON_LIMIT_BREAK.forEach(function(summon) {
        var limit = +summon[13] || 0;
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
          max_level: limit === 4 ? 150 : 100,
          skill: summon[7],
          limit: limit
        };
        if (summonData.limit === 3) {
          this.baseIdMap.set(summonData.id, summonData);
        }
        var key = summon[0] + ':' + limit;
        this.idLimitMap.set(key, summonData);
      }, this);
      this.parseUltimate();
    },

    parseUltimate: function() {
      this.idLimitMap.forEach(function(instance) {
        if (instance.limit === 4) {
          var id = instance.id;
          instance.lv100_atk = this.baseIdMap.get(id).max_atk;
          instance.lv100_hp = this.baseIdMap.get(id).max_hp;
        }
      }, this);
    },

    getData: function(config) {
      return this.idLimitMap.get(config.id + ':' + config.limit);
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

    calculateSummonBonus: function(config) {
      var data = this.getData(config);
      var total = [
        {
          attribute: 0,
          character: 0,
          magna: 0,
          unknown: 0,
          normal: 0
        },
        {
          attribute: 0,
          character: 0,
          magna: 0,
          unknown: 0,
          normal: 0
        },
        {
          attribute: 0,
          character: 0,
          magna: 0,
          unknown: 0,
          normal: 0
        },
        {
          attribute: 0,
          character: 0,
          magna: 0,
          unknown: 0,
          normal: 0
        },
        {
          attribute: 0,
          character: 0,
          magna: 0,
          unknown: 0,
          normal: 0
        },
        {
          attribute: 0,
          character: 0,
          magna: 0,
          unknown: 0,
          normal: 0
        }
      ];
      if (data.name.indexOf('Dark angel Ollivier') >= 0 ) {
        if (config.limit === 4) {
          total[5].character += 60;
        } else if (config.limit === 3) {
          total[5].character += 40;
        } else {
          total[5].character += 25;
        }
      } else if (data.name.indexOf('Ranko Kanzaki') >= 0) {
        if (config.limit === 3) {
          total.forEach(function(one) {
            one.unknown += 50;
          });
        } else {
          total.forEach(function(one) {
            one.unknown += 30;
          });
        }
      } else if (data.name.indexOf('Agnis') >= 0) {
        if (config.limit === 3) {
          total[0].normal += 120;
        } else {
          total[0].normal += 80;
        }
      } else if (data.name.indexOf('Athena') >= 0) {
        if (config.limit === 3) {
          total[0].attribute += 80;
        } else {
          total[0].attribute += 50;
        }
      } else if (data.name.indexOf('Anat') >= 0) {
        if (config.limit === 3) {
          total[3].attribute += 80;
        } else {
          total[3].attribute += 50;
        }
      } else if (data.name.indexOf('Apollo') >= 0) {
        if (config.limit >= 3) {
          total[4].attribute += 80;
        } else {
          total[4].attribute += 50;
        }
      } else if (data.name.indexOf('Albacore') >= 0) {
        if (config.limit >= 3) {
          total[3].character += 25;
        } else {
          total[3].character += 20;
        }
      } else if (data.name.indexOf('Avaritia') >= 0) {
        if (config.limit >= 3) {
          total[2].character += 40;
        } else {
          total[2].character += 30;
        }
      } else if (data.name.indexOf('Ifrit') >= 0) {
        if (config.limit === 4) {
          total[0].attribute += 60;
        } else if (config.limit === 3) {
          total[0].attribute += 50;
        } else {
          total[0].attribute += 40;
        }
      } else if (data.name.indexOf('Vohu Manah') >= 0) {
        if (config.limit === 3) {
          total[2].attribute += 50;
        } else {
          total[2].attribute += 40;
        }
      } else if (data.name.indexOf('Oxymoron') >= 0) {
        if (config.limit === 3) {
          total[0].attribute += 40;
          total[1].attribute += 40;
        } else {
          total[0].attribute += 25;
          total[1].attribute += 25;
        }
      } else if (data.name.indexOf('Oceanus') >= 0) {
        if (config.limit === 3) {
          total[1].attribute += 60;
          total[4].attribute += 60;
        } else {
          total[1].attribute += 40;
          total[4].attribute += 40;
        }
      } else if (data.name.indexOf('オダヅモッキー・ギャングスタ') >= 0) {
        total[1].attribute += 50;
      } else if (data.name.indexOf('Autumn･Myconid') >= 0) {
        total[2].attribute += 50;
      } else if (data.name.indexOf('Odin') >= 0) {
        if (config.limit >= 3) {
          total[4].attribute += 75;
          total[5].attribute += 75;
        } else {
          total[4].attribute += 50;
          total[5].attribute += 50;
        }
      } else if (data.name.indexOf('Garuda') >= 0) {
        if (config.limit >= 3) {
          total[3].character += 40;
        } else {
          total[3].character += 25;
        }
      } else if (data.name.indexOf('Cybele') >= 0) {
        if (config.limit >= 3) {
          total[2].character += 40;
        } else {
          total[2].character += 30;
        }
      } else if (data.name.indexOf('Quetzalcoatl') >= 0) {
        if (config.limit >= 3) {
          total[2].attribute += 60;
          total[3].attribute += 60;
        } else {
          total[2].attribute += 40;
          total[3].attribute += 40;
        }
      } else if (data.name.indexOf('Cerberus') >= 0) {
        if (config.limit >= 3) {
          total[0].attribute += 40;
          total[5].attribute += 40;
        } else {
          total[0].attribute += 25;
          total[5].attribute += 25;
        }
      } else if (data.name.indexOf('Cocytus') >= 0) {
        if (config.limit >= 3) {
          total[1].attribute += 50;
        } else {
          total[1].attribute += 40;
        }
      } else if (data.name.indexOf('Colow') >= 0) {
        if (config.limit === 4) {
          total[4].character += 50;
        } else if (config.limit === 3) {
          total[4].character += 40;
        } else {
          total[4].character += 30;
        }
      } else if (data.name.indexOf('Colossus Magna') >= 0) {
        if (config.limit >= 3) {
          total[0].magna += 100;
        } else {
          total[0].magna += 50;
        }
      } else if (data.name.indexOf('Sagittarius') >= 0) {
        if (config.limit === 4) {
          total[3].attribute += 60;
        } else if (config.limit === 3) {
          total[3].attribute += 50;
        } else {
          total[3].attribute += 40;
        }
      } else if (data.name.indexOf('Satan') >= 0) {
        if (config.limit >= 3) {
          total[2].attribute += 60;
          total[5].attribute += 60;
        } else {
          total[2].attribute += 40;
          total[5].attribute += 40;
        }
      } else if (data.name.indexOf('Satyr') >= 0) {
        if (config.limit >= 3) {
          total[0].character += 40;
        } else {
          total[0].character += 30;
        }
      } else if (data.name.indexOf('Chevalier Magna') >= 0) {
        if (config.limit >= 3) {
          total[4].magna += 100;
        } else {
          total[4].magna += 50;
        }
      } else if (data.name.indexOf('Sylph') >= 0) {
        if (config.limit >= 3) {
          total[0].character += 25;
        } else {
          total[0].character += 20;
        }
      } else if (data.name.indexOf('Jack') >= 0) {
        if (config.limit === 3) {
          total[5].attribute += 20;
        } else {
          total[5].attribute += 10;
        }
      } else if (data.name.indexOf('THE Order grande') >= 0) {
        if (config.limit >= 3) {
          total.forEach(function(one) {
            one.character += 200;
          });
        } else {
          total.forEach(function(one) {
            one.character += 100;
          });
        }
      } else if (data.name.indexOf('Siren') >= 0) {
        if (config.limit === 3) {
          total[3].attribute += 60;
          total[4].attribute += 60;
        } else {
          total[3].attribute += 40;
          total[4].attribute += 40;
        }
      } else if (data.name.indexOf('Celeste Magna') >= 0) {
        if (config.limit === 3) {
          total[5].magna += 100;
        } else {
          total[5].magna += 50;
        }
      } else if (data.name.indexOf('Zeus') >= 0) {
        if (config.limit === 3) {
          total[4].normal += 120;
        } else {
          total[4].normal += 80;
        }
      } else if (data.name.indexOf('Zephyros') >= 0) {
        if (config.limit === 3) {
          total[3].normal += 120;
        } else {
          total[3].normal += 80;
        }
      } else if (data.name.indexOf('Tiamat Magna') >= 0) {
        if (config.limit === 3) {
          total[3].magna += 100;
        } else {
          total[3].magna += 50;
        }
      } else if (data.name.indexOf('Titan') >= 0) {
        if (config.limit === 3) {
          total[2].normal += 120;
        } else {
          total[2].normal += 80;
        }
      } else if (data.name.indexOf('Deirdre') >= 0) {
        total[3].attribute += 50;
      } else if (data.name.indexOf('Diabolos') >= 0) {
        if (config.limit === 3) {
          total[5].attribute += 40;
        } else {
          total[5].attribute += 30;
        }
      } else if (data.name.indexOf('Na-zha') >= 0) {
        if (config.limit === 4) {
          total[0].attribute += 70;
          total[3].attribute += 70;
        } else if (config.limit === 3) {
          total[0].attribute += 60;
          total[3].attribute += 60;
        } else {
          total[0].attribute += 40;
          total[3].attribute += 40;
        }
      } else if (data.name.indexOf('Nephthys') >= 0) {
        if (config.limit === 3) {
          total[3].attribute += 50;
        } else {
          total[3].attribute += 40;
        }
      } else if (data.name.indexOf('Neptune') >= 0) {
        if (config.limit === 3) {
          total[1].character += 40;
        } else {
          total[1].character += 30;
        }
      } else if (data.name.indexOf('Hades') >= 0) {
        if (config.limit === 3) {
          total[5].normal += 120;
        } else {
          total[5].normal += 80;
        }
      } else if (data.name.indexOf('Baal') >= 0) {
        if (config.limit === 3) {
          total[2].attribute += 60;
          total[4].attribute += 60;
        } else {
          total[2].attribute += 40;
          total[4].attribute += 40;
        }
      } else if (data.name.indexOf('Bahamut') >= 0) {
        if (config.limit === 3) {
          total[5].attribute += 120;
        } else {
          total[5].attribute += 100;
        }
      } else if (data.name.indexOf('Fafnir') >= 0) {
        total[0].attribute += 50;
      } else if (data.name.indexOf('Phoenix') >= 0) {
        if (config.limit === 3) {
          total[0].attribute += 50;
        } else {
          total[0].attribute += 40;
        }
      } else if (data.name.indexOf('Fenrir') >= 0) {
        if (config.limit === 4) {
          total[1].attribute += 40;
        } else if (config.limit === 3) {
          total[1].attribute += 25;
        } else {
          total[1].attribute += 20;
        }
      } else if (data.name.indexOf('Hecatoncheir') >= 0) {
        if (config.limit >= 3) {
          total[4].character += 25;
        } else {
          total[4].character += 20;
        }
      } else if (data.name.indexOf('Poseidon') >= 0) {
        if (config.limit >= 3) {
          total[1].character += 25;
        } else {
          total[1].character += 20;
        }
      } else if (data.name.indexOf('Makyura Marius') >= 0) {
        if (config.limit >= 3) {
          total[1].attribute += 80;
        } else {
          total[1].attribute += 50;
        }
      } else if (data.name.indexOf('Magi') >= 0) {
        if (config.limit >= 3) {
          total[4].character += 30;
        } else {
          total[4].character += 25;
        }
      } else if (data.name.indexOf('Manawydan') >= 0) {
        if (config.limit >= 3) {
          total[1].character += 25;
        } else {
          total[1].character += 20;
        }
      } else if (data.name.indexOf('Mamonas') >= 0) {
        if (config.limit >= 3) {
          total[3].character += 25;
        } else {
          total[3].character += 20;
        }
      } else if (data.name.indexOf('Marduk') >= 0) {
        if (config.limit >= 3) {
          total[2].character += 25;
        } else {
          total[2].character += 20;
        }
      } else if (data.name.indexOf('Mithra') >= 0) {
        if (config.limit >= 3) {
          total[3].character += 25;
        } else {
          total[3].character += 20;
        }
      } else if (data.name.indexOf('Midgardsorm') >= 0) {
        if (config.limit >= 3) {
          total[2].character += 25;
        } else {
          total[2].character += 20;
        }
      } else if (data.name.indexOf('Medusa') >= 0) {
        if (config.limit >= 3) {
          total[2].attribute += 80;
        } else {
          total[2].attribute += 50;
        }
      } else if (data.name.indexOf('Yggdrasil Magna') >= 0) {
        if (config.limit >= 3) {
          total[2].magna += 100;
        } else {
          total[2].magna += 50;
        }
      } else if (data.name.indexOf('Lich') >= 0) {
        if (config.limit >= 3) {
          total[1].attribute += 60;
          total[5].attribute += 60;
        } else {
          total[1].attribute += 40;
          total[5].attribute += 40;
        }
      } else if (data.name.indexOf('Leviathan Magna') >= 0) {
        if (config.limit >= 3) {
          total[1].magna += 100;
        } else {
          total[1].magna += 50;
        }
      } else if (data.name.indexOf('Lucifer') >= 0) {
        if (config.limit >= 3) {
          total[4].attribute += 120;
        } else {
          total[4].attribute += 100;
        }
      } else if (data.name.indexOf('Robomi') >= 0) {
        if (config.limit >= 3) {
          total[4].attribute += 50;
        } else {
          total[4].attribute += 40;
        }
      } else if (data.name.indexOf('Ebisu') >= 0) {
        total[1].attribute += 50;
      } else if (data.name.indexOf('Varuna') >= 0) {
        if (config.limit === 3) {
          total[1].normal += 120;
        } else {
          total[1].normal += 80;
        }
      } else if (data.name.indexOf('Veselago') >= 0) {
        total[4].attribute += 40;
      } else if (data.name.indexOf('Dragon of Thunderbolt') >= 0) {
        if (config.limit >= 3) {
          total[0].attribute += 60;
          total[4].attribute += 60;
        } else {
          total[0].attribute += 40;
          total[4].attribute += 40;
        }
      } else if (data.name.indexOf('Fujin & Raijin') >= 0) {
        if (config.limit >= 3) {
          total[3].attribute += 40;
          total[4].attribute += 40;
        } else {
          total[3].attribute += 25;
          total[4].attribute += 25;
        }
      } else if (data.name.indexOf('Flam=glass') >= 0) {
        if (config.limit > 3) {
          total[0].character += 60;
          total[1].character += 60;
        }
      }
      return total;
    },
    calculateRealData: function(config) {
      var data = this.getData(config);
      var isFinalEvo = (data.limit === 4);
      if (isFinalEvo) {
        var diffAtk = (data.lv100_atk - data.min_atk) / 100;
        var diffHp = (data.lv100_hp - data.min_hp) / 100;
        var diffAtk2 = (data.max_atk - data.lv100_atk) / 50;
        var diffHp2 = (data.max_hp - data.lv100_hp) / 50;
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
        } else if (+config.level === 150) {
          return {
            attack: data.max_atk + 5 * config.plus,
            hp: data.max_hp + 1 * config.plus
          }
        } else if (+config.level === 2) {
          return {
            attack: Math.ceil(data.min_atk + diffAtk * 2 + 5 * config.plus),
            hp: Math.ceil(data.min_hp + diffHp * 2 + config.plus)
          }
        } else if (+config.level < 100) {
          return {
            attack: Math.ceil(data.min_atk + diffAtk * config.level + 5 * config.plus),
            hp: Math.ceil(data.min_hp + diffHp * config.level + config.plus)
          }
        } else {
          return {
            attack: Math.ceil(data.lv100_atk + diffAtk2 * (config.level - 100) + 5 * config.plus),
            hp: Math.ceil(data.lv100_hp + diffHp2 * (config.level - 100) + config.plus)
          }
        }
      } else {
        var diffAtk = (data.max_atk - data.min_atk) / data.max_level;
        var diffHp = (data.max_hp - data.min_hp) / data.max_level;
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
            attack: Math.ceil(data.min_atk + diffAtk * 2 + 5 * config.plus),
            hp: Math.ceil(data.min_hp + diffHp * 2 + config.plus)
          }
        } else {
          return {
            attack: Math.ceil(data.min_atk + diffAtk * config.level + 5 * config.plus),
            hp: Math.ceil(data.min_hp + diffHp * config.level + config.plus)
          }
        }
      }
    }
  };
}(window));
