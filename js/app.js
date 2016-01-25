'use strict';

(function (exports) {
  exports.App = React.createClass({
    displayName: 'App',

    getInitialState: function getInitialState() {
      var baseWeaponConfig = {
        id: 0,
        plus: 0,
        name: '',
        level: 100,
        skillLevel: 10,
        finalLiberation: false,
        limit: 0
      };
      var baseSummonConfig = {
        id: 0,
        name: '',
        plus: 0,
        level: 100,
        finalLiberation: false,
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
    onLimitChange: function onLimitChange(evt) {
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
      this.setState(function (previuosState) {
        if (type === 'weapon') {
          var weaponConfig = previuosState.weaponConfig;
          weaponConfig[+slot].limit = value;
          return {
            weaponConfig: weaponConfig
          };
        } else {
          var summonConfig = previuosState.summonConfig;
          summonConfig[+slot].limit = value;
          return {
            summonConfig: summonConfig
          };
        }
      });
    },
    onLevelChange: function onLevelChange(evt) {
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
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
    },
    parseHash: function parseHash() {
      var config = window.location.hash;
    },
    onClick: function onClick(evt) {
      // console.log(evt.type, evt.target);
      if (evt.target.className.indexOf('weapon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        console.log(slot);
        Service.request('WeaponSelector:open').then((function (name, limit) {
          if (!name) {
            return;
          }
          this.setState(function (currentState) {
            var weaponConfig = currentState.weaponConfig[slot];
            weaponConfig.name = name;
            var data = WeaponStore.nameMap.get(name);
            weaponConfig.id = data.id;
            weaponConfig.limit = limit;
            return {
              weaponConfig: currentState.weaponConfig
            };
          });
        }).bind(this))['catch'](function () {});
      } else if (evt.target.className.indexOf('summon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        Service.request('SummonSelector:open').then((function (name, limit) {
          console.log(name);
          if (!name) {
            return;
          }
          this.setState(function (currentState) {
            var summonConfig = currentState.summonConfig[slot];
            summonConfig.name = name;
            var data = SummonStore.nameMap.get(name);
            summonConfig.limit = limit;
            summonConfig.id = data.id;
            return {
              summonConfig: currentState.summonConfig
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
    addAmount: function addAmount(total, add) {
      total.forEach(function (a, index) {
        a.magna += add[index].magna;
        a.normal += add[index].normal;
        a.unknown += add[index].unknown;
      });
    },
    render: function render() {
      var totalWeaponHp = 0;
      var totalWeaponAtk = 0;
      var totalSummonAtk = 0;
      var totalSummonHp = 0;
      var totalAmount = [{
        normal: 0,
        unknown: 0,
        magna: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0
      }, {
        normal: 0,
        unknown: 0,
        magna: 0
      }];
      var subWeaponDOM = this.state.weaponConfig.map(function (weapon, index) {
        if (index === 0) {
          return '';
        } else if (weapon.id) {
          var weaponData = WeaponStore.nameMap.get(weapon.name);
          var realData = WeaponStore.calculateRealData(weapon);
          console.log(realData);
          var realAtk = realData.attack;
          var realHp = realData.hp;
          totalWeaponAtk += realAtk;
          totalWeaponHp += realHp;
          this.addAmount(totalAmount, realData.amount);
          return React.createElement(
            'div',
            { className: 'lis-weapon-sub', 'data-slot': index },
            React.createElement(
              'div',
              { className: 'btn-weapon rarity-4' },
              React.createElement('img', { className: 'img-weapon-sub', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/" + weapon.id + ".jpg" }),
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
      if (!this.state.weaponConfig[0].name) {
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
        var weaponData = WeaponStore.nameMap.get(this.state.weaponConfig[0].name);
        var realData = WeaponStore.calculateRealData(this.state.weaponConfig[0]);
        var realAtk = realData.attack;
        var realHp = realData.hp;
        totalWeaponAtk += realAtk;
        totalWeaponHp += realHp;
        this.addAmount(totalAmount, realData.amount);
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
        var summonData = SummonStore.nameMap.get(this.state.summonConfig[0].name);
        var realData = SummonStore.calculateRealData(this.state.summonConfig[0]);
        var realAtk = realData.attack;
        var realHp = realData.hp;
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
              React.createElement('img', { className: 'img-summon-main', src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_main/" + this.state.summonConfig[0].id + ".jpg" }),
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
      var subSummonDOM = this.state.summonConfig.map(function (summon, index) {
        if (index === 0) {
          return '';
        } else if (summon.id) {
          var summonData = SummonStore.nameMap.get(summon.name);
          var realData = SummonStore.calculateRealData(summon);
          var realHp = realData.hp;
          var realAtk = realData.attack;
          totalSummonHp += realHp;
          totalSummonAtk += realAtk;
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
            from99 = [];
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
            var weaponData = WeaponStore.nameMap.get(weapon.name);
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
                weapon.name
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

        // Amount
        var rankAtk = 1000;
        if (this.state.characterConfig.rank === 2) {
          rankAtk += 80;
        } else if (this.state.characterConfig.rank > 2) {
          rankAtk += this.state.characterConfig.rank * 40;
        }
        var mainAttribute = this.state.weaponConfig[0].id ? WeaponStore.nameMap.get(this.state.weaponConfig[0].name).attribute : 1;
        var magnaPercentage = 1 + totalAmount[mainAttribute - 1].magna / 100;
        var normalPercentage = 1 + totalAmount[mainAttribute - 1].normal / 100;
        var unknownPercentage = 1 + totalAmount[mainAttribute - 1].unknown / 100;
        var calculatedAtk = (totalSummonAtk + totalWeaponAtk + rankAtk) * magnaPercentage * normalPercentage * unknownPercentage;
        amountDOM = React.createElement(
          'div',
          { className: 'emulator amount' },
          '基礎攻擊:(' + (totalWeaponAtk + totalSummonAtk),
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
          '一般:' + (100 + totalAmount[mainAttribute - 1].normal) + '%',
          React.createElement(
            'span',
            { className: 'operator' },
            ' X '
          ),
          'UN: ' + (100 + totalAmount[mainAttribute - 1].unknown) + '%',
          React.createElement(
            'span',
            { className: 'operator' },
            ' X '
          ),
          '方陣: ' + (100 + totalAmount[mainAttribute - 1].magna) + '%',
          React.createElement(
            'span',
            { className: 'operator' },
            ' = '
          ),
          React.createElement('br', null),
          '總合攻擊: ' + Math.round(calculatedAtk)
        );
      }
      var summonConfigDOM = '';
      if (totalSummonAtk) {
        var from150 = [],
            from15 = [],
            from100 = [],
            from4 = [],
            from99 = [];
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
        for (var i = 0; i < 100; i++) {
          from100.push(React.createElement(
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
            var summonData = SummonStore.nameMap.get(summon.name);
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
                summon.name
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'level', onChange: this.onLevelChange },
                  from150
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'plus', onChange: this.onPlusChange },
                  from99
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'select',
                  { className: 'limit', onChange: this.onLimitChange },
                  from4
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
      var characterConfigDOM = React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { 'for': 'rank' },
            'Rank'
          ),
          React.createElement('input', { id: 'rank', value: this.state.characterConfig.rank })
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { 'for': 'hp' },
            'HP %'
          ),
          React.createElement('input', { id: 'hp', value: this.state.characterConfig.hp })
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { 'for': 'attribute-bonus' },
            'Attribute Bonus'
          ),
          React.createElement(
            'button',
            { id: 'attribute-bonus' },
            'Attribute Bonus'
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { 'for': 'friend' },
            'Friend Summon'
          ),
          React.createElement(
            'button',
            { id: 'friend' },
            'Choose Summon'
          )
        )
      );
      return React.createElement(
        'div',
        { className: 'planner' },
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
        amountDOM,
        characterConfigDOM,
        weaponConfigDOM,
        summonConfigDOM,
        React.createElement(WeaponSelector, { weapons: window.SSR_WEAPON_RAW }),
        React.createElement(SummonSelector, { summons: window.SSR_SUMMON_RAW })
      );
    }
  });
})(window);