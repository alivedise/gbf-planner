'use strict';

(function (exports) {
  exports.App = React.createClass({
    displayName: 'App',

    getInitialState: function getInitialState() {
      var baseWeaponConfig = {
        id: 0,
        plus: 0,
        level: 100,
        skillLevel: 10,
        limit: 0
      };
      var baseSummonConfig = {
        id: 0,
        plus: 0,
        level: 100,
        limit: 0
      };
      return {
        weaponConfig: [Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig)],
        summonConfig: [Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig)],
        characterConfig: {
          rank: 1,
          hp: 100,
          'attribute-bonus': 0,
          'friend': Object.assign({}, baseSummonConfig)
        }
      };
    },
    onPlusChange: function onPlusChange(evt) {
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
      if (slot === 'f') {
        this.setState(function (previuosState) {
          var summonConfig = previuosState.characterConfig.friend;
          summonConfig.plus = value;
          return {
            friend: previuosState.characterConfig.friend
          };
        });
      } else {
        this.setState(function (previuosState) {
          if (type === 'weapon') {
            var weaponConfig = previuosState.weaponConfig;
            weaponConfig[+slot].plus = value;
            return {
              weaponConfig: weaponConfig
            };
          } else {
            var summonConfig = previuosState.summonConfig;
            summonConfig[+slot].plus = value;
            return {
              summonConfig: summonConfig
            };
          }
        });
      }
    },
    onLevelChange: function onLevelChange(evt) {
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
      if (slot === 'f') {
        this.setState(function (previuosState) {
          var summonConfig = previuosState.characterConfig.friend;
          summonConfig.level = value;
          return {
            friend: previuosState.characterConfig.friend
          };
        });
      } else {
        this.setState(function (previuosState) {
          if (type === 'weapon') {
            var weaponConfig = previuosState.weaponConfig;
            weaponConfig[+slot].level = value;
            return {
              weaponConfig: weaponConfig
            };
          } else {
            var summonConfig = previuosState.summonConfig;
            summonConfig[+slot].level = value;
            return {
              summonConfig: summonConfig
            };
          }
        });
      }
    },
    onWeaponSkillLevelChange: function onWeaponSkillLevelChange(evt) {
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
      this.setState(function (previuosState) {
        var weaponConfig = previuosState.weaponConfig;
        weaponConfig[+slot].skillLevel = value;
        return {
          weaponConfig: weaponConfig
        };
      });
    },
    componentDidMount: function componentDidMount() {
      this.ref = new Firebase('https://gbf-item-database.firebaseio.com');
      this.weaponRef = this.ref.child('weapon');
      this.summonRef = this.ref.child('summon');
      this.parseHash();
      WeaponStore.start();
      SummonStore.start();
      window.Appp = this;
      window.addEventListener('hashchange', (function () {
        console.log('parse hash');
        this.parseHash();
      }).bind(this));
    },
    parseHash: function parseHash() {
      var config = window.location.hash;
      var strings = config.split(';');
      if (strings.length < 17) {
        console.error('invalid hash');
        return;
      }
      var pcString = strings[0].split(',');
      var frString = strings[1].split(',');
      var weaponString = [strings[2].split(','), strings[3].split(','), strings[4].split(','), strings[5].split(','), strings[6].split(','), strings[7].split(','), strings[8].split(','), strings[9].split(','), strings[10].split(','), strings[11].split(',')];
      var summonString = [strings[12].split(','), strings[13].split(','), strings[14].split(','), strings[15].split(','), strings[16].split(',')];
      this.setState({
        characterConfig: {
          rank: pcString[0] || 1,
          friend: {
            id: frString[0].length === 10 ? frString[0] : '',
            limit: +frString[1] || 0,
            level: +frString[2] || 0,
            plus: +frString[3] || 0
          }
        },
        weaponConfig: weaponString.map(function (weapon) {
          return {
            id: weapon[0].length === 10 ? weapon[0] : '',
            limit: +weapon[1] || 0,
            level: +weapon[2] || 100,
            skillLevel: +weapon[3] || 0,
            plus: +weapon[4] || 0
          };
        }),
        summonConfig: summonString.map(function (summon) {
          return {
            id: summon[0].length === 10 ? summon[0] : '',
            limit: +summon[1] || 0,
            level: +summon[2] || 100,
            plus: +summon[3] || 0
          };
        })
      });
    },
    onClick: function onClick(evt) {
      // console.log(evt.type, evt.target);
      if (evt.target.className.indexOf('weapon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        console.log(slot);
        Service.request('WeaponSelector:open').then((function (result) {
          if (!result) {
            return;
          }
          var a = result.split(':');
          var id = a[0];
          var limit = a[1];
          console.log(id, limit);
          this.setState(function (currentState) {
            var weaponConfig = currentState.weaponConfig[slot];
            weaponConfig.id = id;
            weaponConfig.limit = +limit;
            weaponConfig.plus = 0;
            weaponConfig.level = 100;
            weaponConfig.skillLevel = 10;
            return {
              weaponConfig: currentState.weaponConfig
            };
          });
        }).bind(this))['catch'](function (err) {
          console.log(err);
        });
      } else if (evt.target.className.indexOf('summon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        Service.request('SummonSelector:open').then((function (result) {
          if (!result) {
            return;
          }
          var a = result.split(':');
          var id = a[0];
          var limit = a[1];
          console.log(id, limit);
          this.setState(function (currentState) {
            var summonConfig = currentState.summonConfig[slot];
            summonConfig.id = id;
            summonConfig.limit = +limit;
            summonConfig.plus = 0;
            summonConfig.level = 100;
            return {
              summonConfig: currentState.summonConfig
            };
          });
        }).bind(this))['catch'](function (err) {
          console.log(err);
        });
      }
    },
    onMouseOut: function onMouseOut(evt) {
      //console.log(evt.type, evt.target);
      if (evt.target.tagName === 'DIV') {
        evt.target.classList.remove('on');
      }
    },
    onMouseDown: function onMouseDown(evt) {
      // console.log(evt.type, evt.target);
      if (evt.target.tagName === 'IMG') {
        evt.target.parentNode.classList.add('on');
      } else if (evt.target.classList.contains('img-blank')) {
        evt.target.classList.add('on');
      }
    },
    onMouseUp: function onMouseUp(evt) {
      // console.log(evt.type, evt.target);
      if (evt.target.tagName === 'IMG') {
        evt.target.parentNode.classList.remove('on');
      } else if (evt.target.classList.contains('img-blank')) {
        evt.target.classList.add('on');
      }
    },
    addAmount: function addAmount(total, add) {
      total.forEach(function (a, index) {
        a.magna += add[index].magna;
        a.normal += add[index].normal;
        a.unknown += add[index].unknown;
        a.baha += add[index].baha;
      });
    },
    addBonus: function addBonus(total, add) {
      total.forEach(function (a, index) {
        a.magna += add[index].magna;
        a.normal += add[index].normal;
        a.unknown += add[index].unknown;
        a.attribute += add[index].attribute;
        a.character += add[index].character;
      });
    },
    onRankChange: function onRankChange(evt) {
      var value = isNaN(evt.target.value) ? 1 : evt.target.value;

      this.setState(function (currentState) {
        var characterConfig = currentState.characterConfig;
        characterConfig.rank = value;
        return {
          characterConfig: characterConfig
        };
      });
    },
    saveConfigToHash: function saveConfigToHash() {
      var charString = this.state.characterConfig.rank + ';';
      var friendString = this.state.characterConfig.friend.id + ',' + this.state.characterConfig.friend.limit + ',' + this.state.characterConfig.friend.level + ',' + this.state.characterConfig.friend.plus + ';';
      var weaponString = '';
      this.state.weaponConfig.map(function (weapon) {
        weaponString += weapon.id + ',' + weapon.limit + ',' + weapon.level + ',' + weapon.skillLevel + ',' + weapon.plus + ';';
      });
      var summonString = '';
      this.state.summonConfig.map(function (summon) {
        summonString += summon.id + ',' + summon.limit + ',' + summon.level + ',' + summon.plus + ';';
      });
      window.location.hash = charString + friendString + weaponString + summonString;
      this.refs.link.getDOMNode().value = window.location.href;
    },
    chooseFriend: function chooseFriend() {
      Service.request('SummonSelector:open').then((function (result) {
        if (!result) {
          return;
        }
        var a = result.split(':');
        var id = a[0];
        var limit = a[1];
        console.log(id, limit);
        this.setState(function (currentState) {
          var characterConfig = currentState.characterConfig;
          var summonConfig = characterConfig.friend;
          summonConfig.id = id;
          summonConfig.limit = limit;
          summonConfig.level = 100;
          summonConfig.plus = 0;
          return {
            characterConfig: characterConfig
          };
        });
      }).bind(this))['catch'](function () {});
    },
    render: function render() {
      var totalWeaponHp = 0;
      var totalWeaponAtk = 0;
      var totalSummonAtk = 0;
      var totalSummonHp = 0;
      var totalBonus = [{
        attribute: 100,
        character: 0,
        magna: 100,
        unknown: 100,
        normal: 100
      }, {
        attribute: 100,
        character: 0,
        magna: 100,
        unknown: 100,
        normal: 100
      }, {
        attribute: 100,
        character: 0,
        magna: 100,
        unknown: 100,
        normal: 100
      }, {
        attribute: 100,
        character: 0,
        magna: 100,
        unknown: 100,
        normal: 100
      }, {
        attribute: 100,
        character: 0,
        magna: 100,
        unknown: 100,
        normal: 100
      }, {
        attribute: 100,
        character: 0,
        magna: 100,
        unknown: 100,
        normal: 100
      }];
      var totalAmount = [{
        normal: 0,
        unknown: 0,
        magna: 0,
        baha: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0,
        baha: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0,
        baha: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0,
        baha: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0,
        baha: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0,
        baha: 0
      }];

      var friendSummonDOM = '';
      if (this.state.characterConfig.friend.id) {
        var data = SummonStore.getData(this.state.characterConfig.friend);
        var realData = SummonStore.calculateRealData(this.state.characterConfig.friend);
        var add = SummonStore.calculateSummonBonus(this.state.characterConfig.friend);
        this.addBonus(totalBonus, add);
        totalSummonAtk += realData.attack;
        totalSummonHp += realData.hp;
        friendSummonDOM = React.createElement(
          'div',
          { className: 'prt-deck-select', onClick: this.chooseFriend },
          React.createElement(
            'div',
            { className: 'lis-deck' },
            React.createElement(
              'div',
              { className: 'prt-supporter', 'data-summon-id': this.state.characterConfig.friend.id },
              React.createElement(
                'div',
                { className: 'prt-supporter-name' },
                React.createElement(
                  'span',
                  { className: 'txt-supporter-name' },
                  'Friend Summon'
                )
              ),
              React.createElement(
                'div',
                { className: 'prt-supporter-info' },
                React.createElement(
                  'div',
                  { className: 'prt-summon-image', 'data-image': this.state.characterConfig.friend.id },
                  React.createElement('img', { className: 'img-supporter-summon',
                    src: "http://gbf.game-a1.mbga.jp/assets/img/sp/assets/summon/m/" + this.state.characterConfig.friend.id + ".jpg",
                    alt: this.state.characterConfig.friend.id, draggable: 'false' }),
                  React.createElement(
                    'div',
                    { className: 'prt-supporter-quality' },
                    "+" + this.state.characterConfig.friend.plus
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'prt-supporter-detail' },
                  React.createElement(
                    'div',
                    { className: 'prt-supporter-summon' },
                    React.createElement(
                      'span',
                      { className: 'txt-summon-level' },
                      "Lv " + this.state.characterConfig.friend.level
                    ),
                    React.createElement(
                      'span',
                      null,
                      " " + data.name
                    )
                  ),
                  React.createElement(
                    'div',
                    { className: 'prt-summon-skill  bless-rank1-style' },
                    data.skill
                  ),
                  React.createElement('div', { className: 'prt-supporter-info' })
                )
              ),
              React.createElement(
                'div',
                { className: 'prt-supporter-thumb' },
                React.createElement('img', { className: 'img-supporter', src: 'http://gbf.game-a1.mbga.jp/assets/img/sp/assets/leader/a/150201_sw_1_01.png', alt: '150201_sw_1_01', draggable: 'false' })
              )
            )
          )
        );
      } else {
        friendSummonDOM = React.createElement(
          'div',
          { className: 'prt-deck-select', onClick: this.chooseFriend },
          React.createElement(
            'div',
            { className: 'lis-deck' },
            React.createElement(
              'div',
              { className: 'prt-supporter', 'data-summon-id': this.state.characterConfig.friend.id },
              React.createElement(
                'div',
                { className: 'prt-supporter-name' },
                React.createElement(
                  'span',
                  { className: 'txt-supporter-name' },
                  'Friend Summon'
                )
              ),
              React.createElement(
                'div',
                { className: 'prt-supporter-info' },
                React.createElement('div', { className: 'prt-summon-image blank' }),
                React.createElement(
                  'div',
                  { className: 'prt-supporter-detail' },
                  React.createElement(
                    'div',
                    { className: 'prt-supporter-summon' },
                    'Choose friend summon ..'
                  ),
                  React.createElement('div', { className: 'prt-summon-skill  bless-rank1-style' })
                )
              )
            )
          )
        );
      }

      var subWeaponDOM = this.state.weaponConfig.map(function (weapon, index) {
        if (index === 0) {
          return '';
        } else if (weapon.id) {
          var weaponData = WeaponStore.getData(weapon);
          var realData = WeaponStore.calculateRealData(weapon);
          console.log(realData);
          var realAtk = realData.attack;
          var realHp = realData.hp;
          totalWeaponAtk += realAtk;
          totalWeaponHp += realHp;
          this.addAmount(totalAmount, realData.amount);
          var starDOM = '';

          if (weaponData.limit === 4) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-ultimate-star-on' })
            );
          } else if (weapon.level > 80) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' })
            );
          } else if (weapon.level > 80) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' })
            );
          } else if (weapon.level > 40) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' })
            );
          }
          return React.createElement(
            'div',
            { className: 'lis-weapon-sub', 'data-slot': index },
            React.createElement(
              'div',
              { className: 'btn-weapon rarity-4' },
              React.createElement('img', { className: 'img-weapon-sub', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/" + weapon.id + ".jpg" }),
              React.createElement('div', { className: 'shining-1' }),
              React.createElement('div', { className: 'shining-2' }),
              starDOM,
              React.createElement(
                'div',
                { className: 'prt-quality' },
                this.state.weaponConfig[index].plus ? '+' + this.state.weaponConfig[index].plus : ''
              )
            ),
            React.createElement(
              'div',
              { className: 'prt-weapon-sub-status' },
              React.createElement(
                'div',
                { className: 'prt-hp' },
                React.createElement('div', { className: 'ico-hp' }),
                React.createElement(
                  'div',
                  { className: 'txt-hp-value', title: realHp },
                  realHp
                )
              ),
              React.createElement(
                'div',
                { className: 'prt-attack' },
                React.createElement('div', { className: 'ico-atk' }),
                React.createElement(
                  'div',
                  { className: 'txt-atk-value', title: realAtk },
                  realAtk
                )
              )
            )
          );
        } else {
          return React.createElement(
            'div',
            { className: 'lis-weapon-sub blank', 'data-slot': index },
            React.createElement('div', { className: 'btn-weapon-blank img-blank' }),
            React.createElement(
              'div',
              { className: 'prt-weapon-sub-status' },
              React.createElement('div', { className: 'prt-hp' }),
              React.createElement('div', { className: 'prt-attack' })
            )
          );
        }
      }, this);
      var mainWeaponDOM = '';
      if (!this.state.weaponConfig[0].id) {
        mainWeaponDOM = React.createElement(
          'div',
          { className: 'cnt-weapon-main blank', 'data-slot': '0' },
          React.createElement(
            'div',
            { className: 'prt-main-bg' },
            React.createElement(
              'div',
              { className: 'prt-weapon-icon' },
              React.createElement('div', { className: 'ico-weapon-s1' }),
              React.createElement('div', { className: 'ico-weapon-s4' })
            ),
            React.createElement(
              'div',
              { className: 'btn-weapon' },
              React.createElement('img', { className: 'img-weapon-main', src: 'http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/ls/1999999999.jpg' })
            )
          ),
          React.createElement(
            'div',
            { className: 'prt-weapon-main-status' },
            React.createElement('div', { className: 'prt-hp' }),
            React.createElement('div', { className: 'prt-attack' })
          )
        );
      } else {
        var weapon = this.state.weaponConfig[0];
        var weaponData = WeaponStore.getData(this.state.weaponConfig[0]);
        var realData = WeaponStore.calculateRealData(this.state.weaponConfig[0]);
        var realAtk = realData.attack;
        var realHp = realData.hp;
        totalWeaponAtk += realAtk;
        totalWeaponHp += realHp;
        this.addAmount(totalAmount, realData.amount);
        var starDOM = '';
        if (weaponData.limit === 4) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-ultimate-star-on' })
          );
        } else if (weapon.level > 80) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' })
          );
        } else if (weapon.level > 60) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' })
          );
        } else if (weapon.level > 40) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' })
          );
        }
        mainWeaponDOM = React.createElement(
          'div',
          { className: 'cnt-weapon-main', 'data-slot': '0' },
          React.createElement(
            'div',
            { className: 'prt-main-bg' },
            React.createElement(
              'div',
              { className: 'prt-weapon-icon' },
              React.createElement('div', { className: 'ico-weapon-s1' }),
              React.createElement('div', { className: 'ico-weapon-s4' })
            ),
            React.createElement(
              'div',
              { className: 'btn-weapon' },
              React.createElement('img', { className: 'img-weapon-main', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/ls/" + this.state.weaponConfig[0].id + ".jpg" }),
              starDOM,
              React.createElement(
                'div',
                { className: 'prt-quality' },
                this.state.weaponConfig[0].plus ? '+' + this.state.weaponConfig[0].plus : ''
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'prt-weapon-main-status' },
            React.createElement(
              'div',
              { className: 'prt-hp' },
              React.createElement('div', { className: 'ico-hp' }),
              React.createElement(
                'div',
                { className: 'txt-hp-value', title: realHp },
                realHp
              )
            ),
            React.createElement(
              'div',
              { className: 'prt-attack' },
              React.createElement('div', { className: 'ico-atk' }),
              React.createElement(
                'div',
                { className: 'txt-atk-value', title: realAtk },
                realAtk
              )
            )
          )
        );
      }
      var mainSummonDOM = '';
      if (this.state.summonConfig[0].id) {
        var summon = this.state.summonConfig[0];
        var summonData = SummonStore.getData(this.state.summonConfig[0]);
        var realData = SummonStore.calculateRealData(this.state.summonConfig[0]);
        var realAtk = realData.attack;
        var realHp = realData.hp;
        totalSummonHp += realHp;
        totalSummonAtk += realAtk;
        var attribute = summonData.attribute;
        var add = SummonStore.calculateSummonBonus(this.state.summonConfig[0]);
        this.addBonus(totalBonus, add);
        var starDOM = '';
        if (summonData.limit === 4) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-ultimate-star-on' })
          );
        } else if (summonData.limit === 3) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' })
          );
        } else if (summon.level > 60) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' })
          );
        } else if (summon.level > 40) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' })
          );
        }
        mainSummonDOM = React.createElement(
          'div',
          { className: 'cnt-summon-main' },
          React.createElement(
            'div',
            { className: 'prt-main-bg' },
            React.createElement(
              'div',
              { className: 'btn-summon rarity-2', 'data-slot': '0' },
              React.createElement('img', { className: 'img-summon-main', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_main/" + this.state.summonConfig[0].id + ".jpg" }),
              React.createElement(
                'div',
                { className: 'prt-attr-icon' },
                React.createElement('div', { className: "icon_type_b_" + attribute })
              ),
              React.createElement('div', { className: 'shining-1' }),
              React.createElement('div', { className: 'shining-2' }),
              starDOM,
              React.createElement(
                'div',
                { className: 'prt-quality' },
                this.state.summonConfig[0].plus ? '+' + this.state.summonConfig[0].plus : ''
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'prt-summon-main-status' },
            React.createElement(
              'div',
              { className: 'prt-hp' },
              React.createElement('div', { className: 'ico-hp' }),
              React.createElement(
                'div',
                { className: 'txt-hp-value', title: realHp },
                realHp
              )
            ),
            React.createElement(
              'div',
              { className: 'prt-attack' },
              React.createElement('div', { className: 'ico-atk' }),
              React.createElement(
                'div',
                { className: 'txt-atk-value', title: realAtk },
                realAtk
              )
            )
          )
        );
      } else {
        mainSummonDOM = React.createElement(
          'div',
          { className: 'cnt-summon-main blank' },
          React.createElement(
            'div',
            { className: 'prt-main-bg' },
            React.createElement(
              'div',
              { className: 'btn-summon rarity-2', 'data-slot': '0' },
              React.createElement('img', { className: 'img-summon-main', src: 'http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_main/2030002000.jpg' }),
              React.createElement(
                'div',
                { className: 'prt-attr-icon' },
                React.createElement('div', { className: 'icon_type_b_2' })
              ),
              React.createElement('div', { className: 'shining-1' }),
              React.createElement('div', { className: 'shining-2' })
            )
          ),
          React.createElement(
            'div',
            { className: 'prt-summon-main-status' },
            React.createElement(
              'div',
              { className: 'prt-hp' },
              React.createElement('div', { className: 'ico-hp' }),
              React.createElement('div', { className: 'txt-hp-value' })
            ),
            React.createElement(
              'div',
              { className: 'prt-attack' },
              React.createElement('div', { className: 'ico-atk' }),
              React.createElement('div', { className: 'txt-atk-value' })
            )
          )
        );
      }
      var subSummonDOM = this.state.summonConfig.map(function (summon, index) {
        if (index === 0) {
          return '';
        } else if (summon.id) {
          var summonData = SummonStore.getData(summon);
          var realData = SummonStore.calculateRealData(summon);
          var realHp = realData.hp;
          var realAtk = realData.attack;
          totalSummonHp += realHp;
          totalSummonAtk += realAtk;
          var starDOM = '';

          if (summonData.limit === 4) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-ultimate-star-on' })
            );
          } else if (summonData.limit === 3) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' })
            );
          } else if (summon.level > 60) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' })
            );
          } else if (summon.level > 40) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' })
            );
          }
          return React.createElement(
            'div',
            { className: 'lis-summon-sub' },
            React.createElement(
              'div',
              { className: 'btn-summon rarity-3', 'data-slot': index },
              React.createElement('img', { className: 'img-summon-sub', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/" + summon.id + ".jpg" }),
              React.createElement(
                'div',
                { className: 'prt-attr-icon' },
                React.createElement('div', { className: 'icon_type_6' })
              ),
              React.createElement('div', { className: 'shining-1' }),
              React.createElement('div', { className: 'shining-2' }),
              starDOM,
              React.createElement(
                'div',
                { className: 'prt-quality' },
                this.state.summonConfig[index].plus ? '+' + this.state.summonConfig[index].plus : ''
              )
            ),
            React.createElement(
              'div',
              { className: 'prt-summon-sub-status' },
              React.createElement(
                'div',
                { className: 'prt-hp' },
                React.createElement('div', { className: 'ico-hp' }),
                React.createElement(
                  'div',
                  { className: 'txt-hp-value', title: realHp },
                  realHp
                )
              ),
              React.createElement(
                'div',
                { className: 'prt-attack' },
                React.createElement('div', { className: 'ico-atk' }),
                React.createElement(
                  'div',
                  { className: 'txt-atk-value', title: realAtk },
                  realAtk
                )
              )
            )
          );
        } else {
          return React.createElement(
            'div',
            { className: 'lis-summon-sub' },
            React.createElement('div', { className: 'btn-summon img-blank blank', 'data-slot': index }),
            React.createElement(
              'div',
              { className: 'prt-summon-sub-status' },
              React.createElement('div', { className: 'prt-hp' }),
              React.createElement('div', { className: 'prt-attack' })
            )
          );
        }
      }, this);

      var weaponConfigDOM = '';
      var amountDOM = '';
      if (totalWeaponAtk) {
        var from150 = [],
            from15 = [],
            from100 = [],
            from99 = [],
            from10 = [];
        for (var i = 1; i <= 150; i++) {
          from150.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        for (var i = 1; i <= 10; i++) {
          from10.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        for (var i = 1; i <= 15; i++) {
          from15.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        for (var i = 0; i < 100; i++) {
          from99.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        for (var i = 1; i <= 100; i++) {
          from100.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        var rows = [];
        this.state.weaponConfig.forEach(function (weapon, index) {
          if (weapon.id) {
            var weaponData = WeaponStore.getData(weapon);
            var starDOM = '';
            if (weaponData.limit === 4) {
              starDOM = React.createElement(
                'div',
                { className: 'prt-evolution-star-s' },
                React.createElement('div', { className: 'prt-star-on' }),
                React.createElement('div', { className: 'prt-star-on' }),
                React.createElement('div', { className: 'prt-star-on' }),
                React.createElement('div', { className: 'prt-ultimate-star-on' })
              );
            }
            rows.push(React.createElement(
              'tr',
              { 'data-type': 'weapon', 'data-slot': index, key: "weapon-config-" + index },
              React.createElement(
                'td',
                { className: 'list-item' },
                React.createElement('img', { src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/" + weapon.id + ".jpg" })
              ),
              React.createElement(
                'td',
                null,
                index + 1
              ),
              React.createElement(
                'td',
                null,
                weaponData.name
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'level', value: weapon.level, onChange: this.onLevelChange },
                  weaponData.max_level === 100 ? from100 : from150
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'plus', value: weapon.plus, onChange: this.onPlusChange },
                  from99
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'skillLevel', value: weapon.skillLevel, onChange: this.onWeaponSkillLevelChange },
                  weaponData.limit === 4 ? from15 : from10
                )
              ),
              React.createElement(
                'td',
                null,
                starDOM
              )
            ));
          } else {}
        }, this);
        weaponConfigDOM = React.createElement(
          'table',
          { className: 'table table-condensed table-striped table-hover' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement('th', null),
              React.createElement(
                'th',
                null,
                'Slot'
              ),
              React.createElement(
                'th',
                null,
                'Name'
              ),
              React.createElement(
                'th',
                null,
                'level'
              ),
              React.createElement(
                'th',
                null,
                'Plus'
              ),
              React.createElement(
                'th',
                null,
                'Skill level'
              ),
              React.createElement(
                'th',
                null,
                'Over limit'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            rows
          )
        );

        // Amount
        var rankAtk = 1000;
        if (this.state.characterConfig.rank === 2) {
          rankAtk += 80;
        } else if (this.state.characterConfig.rank > 2) {
          rankAtk += this.state.characterConfig.rank * 40;
        }
        var mainAttribute = this.state.weaponConfig[0].id ? WeaponStore.getData(this.state.weaponConfig[0]).attribute : 1;
        var magnaPercentage = 1 + totalAmount[mainAttribute - 1].magna / 100 * (totalBonus[mainAttribute - 1].magna / 100);
        var normalPercentage = 1 + (totalBonus[mainAttribute - 1].character + totalAmount[mainAttribute - 1].baha + totalAmount[mainAttribute - 1].normal * (totalBonus[mainAttribute - 1].normal / 100)) / 100;
        var attributePercentage = 1 * totalBonus[mainAttribute - 1].attribute / 100;
        var unknownPercentage = 1 + totalAmount[mainAttribute - 1].unknown / 100 * (totalBonus[mainAttribute - 1].unknown / 100);
        var calculatedAtk = (totalSummonAtk + totalWeaponAtk + rankAtk) * attributePercentage * magnaPercentage * normalPercentage * unknownPercentage;

        amountDOM = React.createElement(
          'div',
          { className: 'emulator amount' },
          React.createElement(
            'sup',
            null,
            '基礎攻擊'
          ),
          '(' + (totalWeaponAtk + totalSummonAtk),
          React.createElement(
            'span',
            { className: 'operator' },
            ' + '
          ),
          rankAtk + ')',
          React.createElement(
            'span',
            { className: 'operator' },
            ' X '
          ),
          React.createElement(
            'sup',
            null,
            '屬性'
          ),
          '(' + totalBonus[mainAttribute - 1].attribute + '%)',
          React.createElement(
            'span',
            { className: 'operator' },
            ' X '
          ),
          React.createElement(
            'sup',
            null,
            '一般'
          ),
          '(' + (100 + totalAmount[mainAttribute - 1].normal),
          '%',
          React.createElement(
            'sub',
            null,
            '普刃'
          ),
          '+',
          totalAmount[mainAttribute - 1].baha,
          '%',
          React.createElement(
            'sub',
            null,
            '巴哈'
          ),
          '+',
          totalBonus[mainAttribute - 1].character + '%',
          React.createElement(
            'sub',
            null,
            '角色'
          ),
          ')',
          React.createElement(
            'span',
            { className: 'operator' },
            ' X '
          ),
          React.createElement(
            'sup',
            null,
            'UN'
          ),
          '(' + (100 + totalAmount[mainAttribute - 1].unknown) + '%)',
          React.createElement(
            'span',
            { className: 'operator' },
            ' X '
          ),
          React.createElement(
            'sup',
            null,
            '方陣'
          ),
          '(' + (100 + totalAmount[mainAttribute - 1].magna) + '*' + totalBonus[mainAttribute - 1].magna + '%)',
          React.createElement(
            'span',
            { className: 'operator' },
            ' = '
          ),
          React.createElement('br', null),
          React.createElement(
            'sup',
            null,
            '總合攻擊'
          ),
          '' + Math.round(calculatedAtk)
        );
      }
      var summonConfigDOM = '';
      if (totalSummonAtk) {
        var from150 = [],
            from15 = [],
            from100 = [],
            from4 = [],
            from99 = [],
            from80 = [];
        for (var i = 1; i <= 150; i++) {
          from150.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        for (var i = 0; i < 100; i++) {
          from99.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        for (var i = 1; i <= 100; i++) {
          from100.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        for (var i = 1; i <= 80; i++) {
          from80.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        for (var i = 0; i <= 4; i++) {
          from4.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        var rows = [];
        this.state.summonConfig.forEach(function (summon, index) {
          if (summon.id) {
            var summonData = SummonStore.getData(summon);
            var starDOM = '';
            if (summonData.limit === 4) {
              starDOM = React.createElement(
                'div',
                { className: 'prt-evolution-star-s' },
                React.createElement('div', { className: 'prt-star-on' }),
                React.createElement('div', { className: 'prt-star-on' }),
                React.createElement('div', { className: 'prt-star-on' }),
                React.createElement('div', { className: 'prt-ultimate-star-on' })
              );
            } else if (summonData.limit === 3) {
              starDOM = React.createElement(
                'div',
                { className: 'prt-evolution-star-s' },
                React.createElement('div', { className: 'prt-star-on' }),
                React.createElement('div', { className: 'prt-star-on' }),
                React.createElement('div', { className: 'prt-star-on' })
              );
            }
            rows.push(React.createElement(
              'tr',
              { 'data-type': 'summon', 'data-slot': index, key: "summon-config-" + index },
              React.createElement(
                'td',
                { className: 'list-item' },
                React.createElement('img', { src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/" + summon.id + ".jpg" })
              ),
              React.createElement(
                'td',
                null,
                index + 1
              ),
              React.createElement(
                'td',
                null,
                summonData.name
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'level', value: summon.level, onChange: this.onLevelChange },
                  summonData.limit === 4 ? from150 : summonData.limit === 3 ? from100 : from80
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'plus', value: summon.plus, onChange: this.onPlusChange },
                  from99
                )
              ),
              React.createElement(
                'td',
                null,
                starDOM
              )
            ));
          } else {}
        }, this);
        if (this.state.characterConfig.friend.id) {
          var summon = this.state.characterConfig.friend;
          var summonData = SummonStore.getData(this.state.characterConfig.friend);
          var starDOM = '';
          if (summonData.limit === 4) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-ultimate-star-on' })
            );
          } else if (summonData.limit === 3) {
            starDOM = React.createElement(
              'div',
              { className: 'prt-evolution-star-s' },
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' }),
              React.createElement('div', { className: 'prt-star-on' })
            );
          }
          rows.push(React.createElement(
            'tr',
            { 'data-type': 'summon', 'data-slot': 'f', key: "summon-config-friend" },
            React.createElement(
              'td',
              { className: 'list-item' },
              React.createElement('img', { src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/" + summonData.id + ".jpg" })
            ),
            React.createElement(
              'td',
              null,
              'Friend'
            ),
            React.createElement(
              'td',
              null,
              summonData.name
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'select',
                { className: 'level', value: summon.level, onChange: this.onLevelChange },
                summonData.limit === 4 ? from150 : summonData.limit === 3 ? from100 : from80
              )
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'select',
                { className: 'plus', value: summon.plus, onChange: this.onPlusChange },
                from99
              )
            ),
            React.createElement(
              'td',
              null,
              starDOM
            )
          ));
        }
        summonConfigDOM = React.createElement(
          'table',
          { className: 'table table-condensed table-striped table-hover' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement('th', null),
              React.createElement(
                'th',
                null,
                'Slot'
              ),
              React.createElement(
                'th',
                null,
                'Name'
              ),
              React.createElement(
                'th',
                null,
                'level'
              ),
              React.createElement(
                'th',
                null,
                'Plus'
              ),
              React.createElement(
                'th',
                null,
                'Over limit'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            rows
          )
        );
      }
      var characterConfigDOM = React.createElement(
        'form',
        { className: 'form-inline' },
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'button',
            { onClick: this.saveConfigToHash, className: 'btn btn-info', id: 'friend' },
            'Generate link/產生連結'
          ),
          React.createElement('input', { className: 'form-control link', ref: 'link', readonly: 'true', value: window.location.href })
        )
      );

      return React.createElement(
        'div',
        { className: 'planner' },
        React.createElement(
          'header',
          null,
          React.createElement(
            'nav',
            { className: 'navbar navbar-inverse' },
            React.createElement(
              'div',
              { className: 'container-fluid' },
              React.createElement(
                'div',
                { className: 'navbar-header' },
                React.createElement(
                  'a',
                  { className: 'navbar-brand', href: '#' },
                  React.createElement(
                    'sup',
                    null,
                    '@Cygames, Inc'
                  ),
                  'Granblue Fantasy Planner ',
                  React.createElement(
                    'sub',
                    null,
                    React.createElement(
                      'span',
                      { className: 'label label-warning label-sm' },
                      'v0.0.1BETA RC6'
                    )
                  )
                ),
                React.createElement(
                  'p',
                  { className: 'navbar-text' },
                  'by ',
                  React.createElement(
                    'a',
                    { href: 'http://github.com/alivedise' },
                    'alivedise'
                  )
                )
              )
            )
          )
        ),
        friendSummonDOM,
        React.createElement(
          'div',
          { className: 'cnt-index', onMouseOut: this.onMouseOut, onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onClick: this.onClick },
          React.createElement(
            'div',
            { className: 'cnt-weapon-list' },
            React.createElement(
              'div',
              { className: 'prt-total-weapon' },
              React.createElement(
                'div',
                { className: 'total-hp' },
                React.createElement('div', { className: 'ico-hp' }),
                React.createElement('div', { className: 'txt-hp' }),
                React.createElement(
                  'div',
                  { className: 'num', title: totalWeaponHp },
                  totalWeaponHp
                )
              ),
              React.createElement(
                'div',
                { className: 'total-atk' },
                React.createElement('div', { className: 'ico-atk' }),
                React.createElement('div', { className: 'txt-atk' }),
                React.createElement(
                  'div',
                  { className: 'num', title: totalWeaponAtk },
                  totalWeaponAtk
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'prt-weapon-list' },
              mainWeaponDOM,
              React.createElement(
                'div',
                { className: 'cnt-weapon-sub' },
                subWeaponDOM
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'cnt-summon-list' },
            React.createElement(
              'div',
              { className: 'prt-total-summon' },
              React.createElement(
                'div',
                { className: 'total-hp' },
                React.createElement('div', { className: 'ico-hp' }),
                React.createElement('div', { className: 'txt-hp' }),
                React.createElement(
                  'div',
                  { className: 'num', title: totalSummonHp },
                  totalSummonHp
                )
              ),
              React.createElement(
                'div',
                { className: 'total-atk' },
                React.createElement('div', { className: 'ico-atk' }),
                React.createElement('div', { className: 'txt-atk' }),
                React.createElement(
                  'div',
                  { className: 'num', title: totalSummonAtk },
                  totalSummonAtk
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'prt-summon-list' },
              mainSummonDOM,
              React.createElement(
                'div',
                { className: 'cnt-summon-sub' },
                subSummonDOM
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'container' },
          amountDOM,
          characterConfigDOM,
          weaponConfigDOM,
          summonConfigDOM
        ),
        React.createElement(WeaponSelector, { ref: 'weapon', weapons: window.SSR_WEAPON_RAW }),
        React.createElement(SummonSelector, { summons: window.SSR_SUMMON_LIMIT_BREAK })
      );
    }
  });
})(window);