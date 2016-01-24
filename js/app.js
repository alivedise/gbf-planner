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
        overLimit: 3
      };
      var baseSummonConfig = {
        id: 0,
        plus: 0,
        level: 100,
        overLimit: 3
      };
      return {
        weapons: ['', '', '', '', '', '', '', '', '', ''],
        summons: ['', '', '', '', ''],
        weaponConfig: [Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig)],
        summonConfig: [Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig)],
        characterConfig: {}
      };
    },
    onPlusChange: function onPlusChange(evt) {
      console.log(evt);
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
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
    },
    componentDidMount: function componentDidMount() {
      this.ref = new Firebase('https://gbf-item-database.firebaseio.com');
      this.weaponRef = this.ref.child('weapon');
      this.summonRef = this.ref.child('summon');
      this.parseHash();
      window.Appp = this;
    },
    parseHash: function parseHash() {
      var config = window.location.hash;
    },
    onClick: function onClick(evt) {
      // console.log(evt.type, evt.target);
      if (evt.target.className.indexOf('weapon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        console.log(slot);
        Service.request('WeaponSelector:open').then((function (id) {
          console.log(id);
          if (!id) {
            return;
          }
          this.setState(function (currentState) {
            var weapons = currentState.weapons;
            weapons[slot] = id;
            return {
              weapons: weapons
            };
          });
        }).bind(this))['catch'](function () {});
      } else if (evt.target.className.indexOf('summon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        Service.request('SummonSelector:open').then((function (id) {
          console.log(id);
          if (!id) {
            return;
          }
          this.setState(function (currentState) {
            var summons = currentState.summons;
            summons[slot] = id;
            return {
              summons: summons
            };
          });
        }).bind(this))['catch'](function () {});
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
    getWeaponState: function getWeaponState(id) {
      var result;
      window.SSR_WEAPON_RAW.some(function (weapon) {
        if (weapon[0] === id) {
          result = weapon;
          return true;
        } else {
          return false;
        }
      });
      return result;
    },
    getSummonState: function getSummonState(id) {
      var result;
      window.SSR_SUMMON_RAW.some(function (summon) {
        if (summon[0] === id) {
          result = summon;
          return true;
        } else {
          return false;
        }
      });
      return result;
    },
    getAttackBlade: function getAttackBlade(weaponData) {
      var ab = [{}, {}, {}, {}, {}, {}];
      var skill1 = weaponData[6];
      var skill2 = weaponData[7];
    },
    calculateRealAtk: function calculateRealAtk(config) {
      var weaponData = this.getWeaponState(config.id);
      var isFinalEvo = weaponData[14] !== '';
      if (isFinalEvo) {
        var diff = Math.ceil((weaponData[11] - weaponData[9]) / 100);
        var diff2 = Math.ceil((weaponData[11] - weaponData[9]) / 100);
        if (+diff === 1) {
          return {
            attack: weaponData[9] + 5 * config.plus,
            hp: weaponData[8] + 1 * config.plus
          };
        } else if (+diff === 100) {
          return {
            attack: weaponData[11] + 5 * config.plus,
            hp: weaponData[10] + 1 * config.plus
          };
        } else if (+config.level === 2) {
          return {
            attack: weaponData[9] + diff * 2 + 5 * config.plus,
            hp: weaponData[8] + diff * 2 + config.plus
          };
        } else {
          return {
            attack: weaponData[9] + diff * config.level + 5 * config.plus,
            hp: weaponData[8] + diff * config.level + config.plus
          };
        }
      } else {
        var diff = Math.ceil((weaponData[11] - weaponData[9]) / 100);
        if (+diff === 1) {
          return {
            attack: weaponData[9] + 5 * config.plus,
            hp: weaponData[8] + 1 * config.plus
          };
        } else if (+diff === 100) {
          return {
            attack: weaponData[11] + 5 * config.plus,
            hp: weaponData[10] + 1 * config.plus
          };
        } else if (+config.level === 2) {
          return {
            attack: weaponData[9] + diff * 2 + 5 * config.plus,
            hp: weaponData[8] + diff * 2 + config.plus
          };
        } else {
          return {
            attack: weaponData[9] + diff * config.level + 5 * config.plus,
            hp: weaponData[8] + diff * config.level + config.plus
          };
        }
      }
    },
    calculateRealHp: function calculateRealHp() {},
    render: function render() {
      var totalWeaponHp = 0;
      var totalWeaponAtk = 0;
      var totalSummonAtk = 0;
      var totalSummonHp = 0;
      var subWeaponDOM = this.state.weapons.map(function (weapon, index) {
        if (index === 0) {
          return '';
        } else if (weapon) {
          var weaponData = this.getWeaponState(weapon);
          var realAtk = +weaponData[11] + 5 * this.state.weaponConfig[index].plus;
          var realHp = +weaponData[10] + this.state.weaponConfig[index].plus;
          totalWeaponAtk += realAtk;
          totalWeaponHp += realHp;
          return React.createElement(
            'div',
            { className: 'lis-weapon-sub', 'data-slot': index },
            React.createElement(
              'div',
              { className: 'btn-weapon rarity-4' },
              React.createElement('img', { className: 'img-weapon-sub', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/" + weapon + ".jpg" }),
              React.createElement('div', { className: 'shining-1' }),
              React.createElement('div', { className: 'shining-2' }),
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
      if (!this.state.weapons[0]) {
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
        var weaponData = this.getWeaponState(this.state.weapons[0]);
        var realAtk = +weaponData[11] + 5 * this.state.weaponConfig[0].plus;
        var realHp = +weaponData[10] + this.state.weaponConfig[0].plus;
        totalWeaponAtk += realAtk;
        totalWeaponHp += realHp;
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
              React.createElement('img', { className: 'img-weapon-main', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/ls/" + this.state.weapons[0] + ".jpg" }),
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
      if (this.state.summons[0]) {
        var summonData = this.getSummonState(this.state.summons[0]);
        var realAtk = +summonData[11] + 5 * this.state.summonConfig[0].plus;
        var realHp = +summonData[10] + this.state.summonConfig[0].plus;
        totalSummonHp += realHp;
        totalSummonAtk += realAtk;
        var attribute = 2;
        switch (summonData[2]) {
          case '火':
            attribute = 1;
            break;
          case '水':
            attribute = 2;
            break;
          case '風':
            attribute = 3;
            break;
          case '土':
            attribute = 4;
            break;
          case '光':
            attribute = 5;
            break;
          case '闇':
            attribute = 6;
            break;
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
              React.createElement('img', { className: 'img-summon-main', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_main/" + this.state.summons[0] + ".jpg" }),
              React.createElement(
                'div',
                { className: 'prt-attr-icon' },
                React.createElement('div', { className: "icon_type_b_" + attribute })
              ),
              React.createElement('div', { className: 'shining-1' }),
              React.createElement('div', { className: 'shining-2' }),
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
      var subSummonDOM = this.state.summons.map(function (summon, index) {
        if (index === 0) {
          return '';
        } else if (summon) {
          var summonData = this.getSummonState(summon);
          var realHp = +summonData[10] + this.state.summonConfig[index].plus;
          var realAtk = +summonData[11] + 5 * this.state.summonConfig[index].plus;
          totalSummonHp += realHp;
          totalSummonAtk += realAtk;
          return React.createElement(
            'div',
            { className: 'lis-summon-sub' },
            React.createElement(
              'div',
              { className: 'btn-summon rarity-3', 'data-slot': index },
              React.createElement('img', { className: 'img-summon-sub', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/" + summon + ".jpg" }),
              React.createElement(
                'div',
                { className: 'prt-attr-icon' },
                React.createElement('div', { className: 'icon_type_6' })
              ),
              React.createElement('div', { className: 'shining-1' }),
              React.createElement('div', { className: 'shining-2' }),
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
      if (totalWeaponAtk) {
        var from150 = [],
            from15 = [],
            from100 = [];
        for (var i = 1; i <= 150; i++) {
          from150.push(React.createElement(
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
          from100.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        var rows = [];
        this.state.weapons.forEach(function (weapon, index) {
          if (weapon) {
            var weaponData = this.getWeaponState(weapon);
            rows.push(React.createElement(
              'tr',
              { 'data-type': 'weapon', 'data-slot': index, key: "weapon-config-" + index },
              React.createElement(
                'td',
                { className: 'list-item' },
                React.createElement('img', { src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/" + weapon + ".jpg" })
              ),
              React.createElement(
                'td',
                null,
                index + 1
              ),
              React.createElement(
                'td',
                null,
                weaponData[1]
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'level' },
                  from150
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'plus', onChange: this.onPlusChange },
                  from100
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'skillLevel' },
                  from15
                )
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
      }
      var summonConfigDOM = '';
      if (totalSummonAtk) {
        var from150 = [],
            from15 = [],
            from100 = [];
        for (var i = 1; i <= 150; i++) {
          from150.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        for (var i = 0; i < 100; i++) {
          from100.push(React.createElement(
            'option',
            { value: i },
            i
          ));
        }
        var rows = [];
        this.state.summons.forEach(function (summon, index) {
          if (summon) {
            var summonData = this.getSummonState(summon);
            rows.push(React.createElement(
              'tr',
              { 'data-type': 'summon', 'data-slot': index, key: "summon-config-" + index },
              React.createElement(
                'td',
                { className: 'list-item' },
                React.createElement('img', { src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/" + summon + ".jpg" })
              ),
              React.createElement(
                'td',
                null,
                index + 1
              ),
              React.createElement(
                'td',
                null,
                summonData[1]
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'level' },
                  from150
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'plus', onChange: this.onPlusChange },
                  from100
                )
              )
            ));
          } else {}
        }, this);
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
      return React.createElement(
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
        ),
        weaponConfigDOM,
        summonConfigDOM,
        React.createElement(WeaponSelector, { weapons: window.SSR_WEAPON_RAW }),
        React.createElement(SummonSelector, { summons: window.SSR_SUMMON_RAW })
      );
    }
  });
})(window);