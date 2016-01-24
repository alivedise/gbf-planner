'use strict';

(function (exports) {
  exports.App = React.createClass({
    displayName: 'App',

    getInitialState: function getInitialState() {
      return {
        search: '',
        weapons: ['', '', '', '', '', '', '', '', '', ''],
        summons: ['', '', '', '', ''],
        weaponConfig: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        summonConfig: [{}, {}, {}, {}, {}],
        characterConfig: {}
      };
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
          totalWeaponAtk += +weaponData[11];
          totalWeaponHp += +weaponData[10];
          return React.createElement(
            'div',
            { className: 'lis-weapon-sub', 'data-slot': index },
            React.createElement(
              'div',
              { className: 'btn-weapon rarity-4' },
              React.createElement('img', { className: 'img-weapon-sub', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/" + weapon + ".jpg" }),
              React.createElement('div', { className: 'shining-1' }),
              React.createElement('div', { className: 'shining-2' })
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
                  { className: 'txt-hp-value', title: weaponData[10] },
                  weaponData[10]
                )
              ),
              React.createElement(
                'div',
                { className: 'prt-attack' },
                React.createElement('div', { className: 'ico-atk' }),
                React.createElement(
                  'div',
                  { className: 'txt-atk-value', title: weaponData[11] },
                  weaponData[11]
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
        totalWeaponAtk += +weaponData[11];
        totalWeaponHp += +weaponData[10];
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
              React.createElement('img', { className: 'img-weapon-main', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/ls/" + this.state.weapons[0] + ".jpg" })
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
                { className: 'txt-hp-value', title: weaponData[10] },
                weaponData[10]
              )
            ),
            React.createElement(
              'div',
              { className: 'prt-attack' },
              React.createElement('div', { className: 'ico-atk' }),
              React.createElement(
                'div',
                { className: 'txt-atk-value', title: weaponData[11] },
                weaponData[11]
              )
            )
          )
        );
      }
      var mainSummonDOM = '';
      if (this.state.summons[0]) {
        var summonData = this.getSummonState(this.state.summons[0]);
        totalSummonHp += +summonData[10];
        totalSummonAtk += +summonData[11];
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
              React.createElement(
                'div',
                { className: 'txt-hp-value', title: summonData[10] },
                summonData[10]
              )
            ),
            React.createElement(
              'div',
              { className: 'prt-attack' },
              React.createElement('div', { className: 'ico-atk' }),
              React.createElement(
                'div',
                { className: 'txt-atk-value', title: summonData[11] },
                summonData[11]
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
          totalSummonHp += +summonData[10];
          totalSummonAtk += +summonData[11];
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
              React.createElement('div', { className: 'shining-2' })
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
                  { className: 'txt-hp-value', title: summonData[10] },
                  summonData[10]
                )
              ),
              React.createElement(
                'div',
                { className: 'prt-attack' },
                React.createElement('div', { className: 'ico-atk' }),
                React.createElement(
                  'div',
                  { className: 'txt-atk-value', title: summonData[11] },
                  summonData[11]
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
              null,
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
                  { className: 'plus' },
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
        React.createElement(WeaponSelector, { weapons: window.SSR_WEAPON_RAW }),
        React.createElement(SummonSelector, { summons: window.SSR_SUMMON_RAW })
      );
    }
  });
})(window);