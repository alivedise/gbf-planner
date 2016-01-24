'use strict';

(function(exports) {
  exports.App = React.createClass({
    getInitialState: function() {
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
      }
      return {
        weapons: ['', '', '', '', '', '', '', '', '', ''],
        summons: ['', '', '', '', ''],
        weaponConfig: [Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig),
                       Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig),
                       Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig),
                       Object.assign({}, baseWeaponConfig)],
        summonConfig: [Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig),
                       Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig)],
        characterConfig: {}
      }
    },
    onPlusChange: function(evt) {
      console.log(evt);
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
      this.setState(function(previuosState) {
        if (type === 'weapon') {
          var weaponConfig = previuosState.weaponConfig;
          weaponConfig[+slot].plus = value;
          return {
            weaponConfig: weaponConfig
          }
        } else {
          var summonConfig = previuosState.summonConfig;
          summonConfig[+slot].plus = value;
          return {
            summonConfig: summonConfig
          }
        }
      });
    },
    componentDidMount: function() {
      this.ref = new Firebase('https://gbf-item-database.firebaseio.com');
      this.weaponRef = this.ref.child('weapon');
      this.summonRef = this.ref.child('summon');
      this.parseHash();
      window.Appp = this;
    },
    parseHash: function() {
      var config = window.location.hash;
    },
    onClick: function(evt) {
     // console.log(evt.type, evt.target);
      if (evt.target.className.indexOf('weapon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        console.log(slot);
        Service.request('WeaponSelector:open').then(function(id) {
          console.log(id);
          if (!id) {
            return;
          }
          this.setState(function(currentState) {
            var weapons = currentState.weapons;
            weapons[slot] = id;
            return {
              weapons: weapons
            };
          });
        }.bind(this)).catch(function() {

        });
      } else if (evt.target.className.indexOf('summon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        Service.request('SummonSelector:open').then(function(id) {
          console.log(id);
          if (!id) {
            return;
          }
          this.setState(function(currentState) {
            var summons = currentState.summons;
            summons[slot] = id;
            return {
              summons: summons
            };
          });
        }.bind(this)).catch(function() {

        });
      }
    },
    onMouseOut: function(evt) {
      //console.log(evt.type, evt.target);
      if (evt.target.tagName === 'DIV') {
        evt.target.classList.remove('on');
      }
    },
    onMouseDown: function(evt) {
     // console.log(evt.type, evt.target);
      if (evt.target.tagName === 'IMG') {
        evt.target.parentNode.classList.add('on');
      } else if (evt.target.classList.contains('img-blank')) {
        evt.target.classList.add('on');
      }
    },
    onMouseUp: function(evt) {
     // console.log(evt.type, evt.target);
      if (evt.target.tagName === 'IMG') {
        evt.target.parentNode.classList.remove('on');
      } else if (evt.target.classList.contains('img-blank')) {
        evt.target.classList.add('on');
      }
    },
    getWeaponState: function(id) {
      var result;
      window.SSR_WEAPON_RAW.some(function(weapon) {
        if (weapon[0] === id) {
          result = weapon;
          return true;
        } else {
          return false;
        }
      });
      return result;
    },
    getSummonState: function(id) {
      var result;
      window.SSR_SUMMON_RAW.some(function(summon) {
        if (summon[0] === id) {
          result = summon;
          return true;
        } else {
          return false;
        }
      });
      return result;
    },
    getAttackBlade: function(weaponData) {
      var ab = [{

      }, {

      }, {

      }, {

      }, {

      }, {

      }]
      var skill1 = weaponData[6];
      var skill2 = weaponData[7];
    },
    calculateRealAtk: function(config) {
      var weaponData = this.getWeaponState(config.id);
      var isFinalEvo = (weaponData[14] !== '');
      if (isFinalEvo) {
        var diff = Math.ceil((weaponData[11] - weaponData[9]) / 100);
        var diff2 = Math.ceil((weaponData[11] - weaponData[9]) / 100);
        if (+diff === 1) {
          return {
            attack: weaponData[9] + 5 * config.plus,
            hp: weaponData[8] + 1 * config.plus
          }
        } else if (+diff === 100) {
          return {
            attack: weaponData[11] + 5 * config.plus,
            hp: weaponData[10] + 1 * config.plus
          }
        } else if (+config.level === 2) {
          return {
            attack: weaponData[9] + diff * 2 + 5 * config.plus,
            hp: weaponData[8] + diff * 2 + config.plus
          }
        } else {
          return {
            attack: weaponData[9] + diff * config.level + 5 * config.plus,
            hp: weaponData[8] + diff * config.level + config.plus
          }
        }
      } else {
        var diff = Math.ceil((weaponData[11] - weaponData[9]) / 100);
        if (+diff === 1) {
          return {
            attack: weaponData[9] + 5 * config.plus,
            hp: weaponData[8] + 1 * config.plus
          }
        } else if (+diff === 100) {
          return {
            attack: weaponData[11] + 5 * config.plus,
            hp: weaponData[10] + 1 * config.plus
          }
        } else if (+config.level === 2) {
          return {
            attack: weaponData[9] + diff * 2 + 5 * config.plus,
            hp: weaponData[8] + diff * 2 + config.plus
          }
        } else {
          return {
            attack: weaponData[9] + diff * config.level + 5 * config.plus,
            hp: weaponData[8] + diff * config.level + config.plus
          }
        }
      }
    },
    calculateRealHp: function() {

    },
    render: function() {
      var totalWeaponHp = 0;
      var totalWeaponAtk = 0;
      var totalSummonAtk = 0;
      var totalSummonHp = 0;
      var subWeaponDOM = this.state.weapons.map(function(weapon, index) {
        if (index === 0) {
          return '';
        } else if (weapon) {
          var weaponData = this.getWeaponState(weapon);
          var realAtk = +weaponData[11] + 5 * this.state.weaponConfig[index].plus;
          var realHp = +weaponData[10] + this.state.weaponConfig[index].plus;
          totalWeaponAtk += realAtk;
          totalWeaponHp += realHp;
          return  <div className="lis-weapon-sub" data-slot={index}>
              <div className="btn-weapon rarity-4">
                <img className="img-weapon-sub" src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/"+weapon+".jpg"} />
                <div className="shining-1"></div>
                <div className="shining-2"></div>
                <div className="prt-quality">{this.state.weaponConfig[index].plus  ? '+' + this.state.weaponConfig[index].plus : ''}</div>
              </div>
              <div className="prt-weapon-sub-status">
                <div className="prt-hp">
                  <div className="ico-hp"></div>
                  
                  <div className="txt-hp-value" title={realHp}>
                    {realHp}
                  </div>
                </div>
                <div className="prt-attack">
                  <div className="ico-atk"></div>
                  
                  <div className="txt-atk-value" title={realAtk}>
                    {realAtk}
                  </div>
                </div>
              </div>
            </div>
        } else {
          return <div className="lis-weapon-sub blank" data-slot={index}>
              <div className="btn-weapon-blank img-blank"></div>
              <div className="prt-weapon-sub-status">
                <div className="prt-hp"></div>
                <div className="prt-attack"></div>
              </div>
            </div>
        }
      }, this);
      var mainWeaponDOM = '';
      if (!this.state.weapons[0]) {
        mainWeaponDOM = 
          <div className="cnt-weapon-main blank" data-slot="0">
            <div className="prt-main-bg">
              <div className="prt-weapon-icon">
                <div className="ico-weapon-s1"></div>
                
                  <div className="ico-weapon-s4"></div>
                
              </div>
              <div className="btn-weapon">
                <img className="img-weapon-main" src="http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/ls/1999999999.jpg" />
              </div>
            </div>
            <div className="prt-weapon-main-status">
              <div className="prt-hp"></div>
              <div className="prt-attack"></div>
            </div>
          </div>
      } else {
        var weaponData = this.getWeaponState(this.state.weapons[0]);
        var realAtk = +weaponData[11] + 5 * this.state.weaponConfig[0].plus;
        var realHp = +weaponData[10] + this.state.weaponConfig[0].plus;
        totalWeaponAtk += realAtk;
        totalWeaponHp += realHp;
        mainWeaponDOM = 
          <div className="cnt-weapon-main" data-slot="0">
            <div className="prt-main-bg">
              <div className="prt-weapon-icon">
                <div className="ico-weapon-s1"></div>
                
                  <div className="ico-weapon-s4"></div>
                
              </div>
              <div className="btn-weapon">
                <img className="img-weapon-main" src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/ls/"+this.state.weapons[0]+".jpg"} />
                <div className="prt-quality">{this.state.weaponConfig[0].plus  ? '+' + this.state.weaponConfig[0].plus : ''}</div>
              </div>
            </div>
            <div className="prt-weapon-main-status">
              <div className="prt-hp">
                <div className="ico-hp"></div>
                <div className="txt-hp-value" title={realHp}>
                  {realHp}
                </div>
              </div>
              <div className="prt-attack">
                <div className="ico-atk"></div>
                <div className="txt-atk-value" title={realAtk}>
                  {realAtk}
                </div>
              </div>
            </div>
          </div>
      }
      var mainSummonDOM = '';
      if (this.state.summons[0]) {
        var summonData = this.getSummonState(this.state.summons[0]);
        var realAtk =  +summonData[11] + 5 * this.state.summonConfig[0].plus;
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
        mainSummonDOM = <div className="cnt-summon-main">
                <div className="prt-main-bg">
                  <div className="btn-summon rarity-2" data-slot="0">
                    <img className="img-summon-main" src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_main/"+this.state.summons[0]+".jpg"} />
                    <div className="prt-attr-icon">
                      <div className={"icon_type_b_" + attribute}></div>
                    </div>
                    <div className="shining-1"></div>
                    <div className="shining-2"></div>
                    <div className="prt-quality">{this.state.summonConfig[0].plus  ? '+' + this.state.summonConfig[0].plus : ''}</div>
                  </div>
                </div>
                <div className="prt-summon-main-status">
                  <div className="prt-hp">
                    <div className="ico-hp"></div>
                    <div className="txt-hp-value" title={realHp}>
                      {realHp}
                    </div>
                  </div>
                  <div className="prt-attack">
                    <div className="ico-atk"></div>
                    <div className="txt-atk-value" title={realAtk}>
                      {realAtk}
                    </div>
                  </div>
                </div>
              </div>
      } else {
        mainSummonDOM = <div className="cnt-summon-main blank">
                          <div className="prt-main-bg">
                            <div className="btn-summon rarity-2" data-slot="0">
                              <img className="img-summon-main" src="http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_main/2030002000.jpg" />
                              <div className="prt-attr-icon">
                                <div className="icon_type_b_2"></div>
                              </div>
                              <div className="shining-1"></div>
                              <div className="shining-2"></div>                
                              
                            </div>
                          </div>
                          <div className="prt-summon-main-status">
                            <div className="prt-hp">
                              <div className="ico-hp"></div>
                              <div className="txt-hp-value">
                              </div>
                            </div>
                            <div className="prt-attack">
                              <div className="ico-atk"></div>
                              <div className="txt-atk-value">
                              </div>
                            </div>
                          </div>
                        </div>
      }
      var subSummonDOM = this.state.summons.map(function(summon, index) {
        if (index === 0) {
          return '';
        } else if (summon) {
          var summonData = this.getSummonState(summon);
          var realHp = +summonData[10] + this.state.summonConfig[index].plus;
          var realAtk = +summonData[11] + 5 * this.state.summonConfig[index].plus;
          totalSummonHp += realHp;
          totalSummonAtk += realAtk;
          return <div className="lis-summon-sub">
                  <div className="btn-summon rarity-3" data-slot={index}>
                    <img className="img-summon-sub" src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/"+summon+".jpg"} />
                    <div className="prt-attr-icon">
                      <div className="icon_type_6"></div>
                    </div>
                    <div className="shining-1"></div>
                    <div className="shining-2"></div>
                    <div className="prt-quality">{this.state.summonConfig[index].plus  ? '+' + this.state.summonConfig[index].plus : ''}</div>
                  </div>
                  <div className="prt-summon-sub-status">
                    <div className="prt-hp">
                      <div className="ico-hp"></div>
                      <div className="txt-hp-value" title={realHp}>
                        {realHp}
                      </div>
                    </div>
                    <div className="prt-attack">
                      <div className="ico-atk"></div>
                      <div className="txt-atk-value" title={realAtk}>
                        {realAtk}
                      </div>
                    </div>
                  </div>
                </div>
        } else {
          return <div className="lis-summon-sub">
                    <div className="btn-summon img-blank blank" data-slot={index}></div>
                    <div className="prt-summon-sub-status">
                      <div className="prt-hp"></div>
                      <div className="prt-attack"></div>
                    </div>
                  </div>
        }
      }, this);
      var weaponConfigDOM = '';
      if (totalWeaponAtk) {
        var from150 = [], from15=[], from100 = [];
        for (var i = 1; i <= 150; i++) {
          from150.push(<option value={i}>{i}</option>);
        }
        for (var i = 1; i <= 15; i++) {
          from15.push(<option value={i}>{i}</option>);
        }
        for (var i = 0; i < 100; i++) {
          from100.push(<option value={i}>{i}</option>);
        }
        var rows = [];
        this.state.weapons.forEach(function(weapon, index) {
          if (weapon) {
            var weaponData = this.getWeaponState(weapon);
            rows.push(<tr data-type="weapon" data-slot={index} key={"weapon-config-" + index}>
                      <td className="list-item"><img src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/"+weapon+".jpg"} />
                </td>
                      <td>{index + 1}</td>
                      <td>{weaponData[1]}</td>
                      <td><select className="level">{from150}</select></td>
                      <td><select className="plus" onChange={this.onPlusChange}>{from100}</select></td>
                      <td><select className="skillLevel">{from15}</select></td>
                   </tr>);
          } else {
          }
        }, this);
        weaponConfigDOM = <table className="table table-condensed table-striped table-hover">
                            <thead><tr><th></th><th>Slot</th><th>Name</th><th>level</th><th>Plus</th><th>Skill level</th><th>Over limit</th></tr></thead>
                            <tbody>{rows}</tbody>
                          </table>
      }
      var summonConfigDOM = '';
      if (totalSummonAtk) {
        var from150 = [], from15=[], from100 = [];
        for (var i = 1; i <= 150; i++) {
          from150.push(<option value={i}>{i}</option>);
        }
        for (var i = 0; i < 100; i++) {
          from100.push(<option value={i}>{i}</option>);
        }
        var rows = [];
        this.state.summons.forEach(function(summon, index) {
          if (summon) {
            var summonData = this.getSummonState(summon);
            rows.push(<tr data-type="summon" data-slot={index} key={"summon-config-" + index}>
                      <td className="list-item"><img src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/"+summon+".jpg"} />
                </td>
                      <td>{index + 1}</td>
                      <td>{summonData[1]}</td>
                      <td><select className="level">{from150}</select></td>
                      <td><select className="plus" onChange={this.onPlusChange}>{from100}</select></td>
                   </tr>);
          } else {
          }
        }, this);
        summonConfigDOM = <table className="table table-condensed table-striped table-hover">
                            <thead><tr><th></th><th>Slot</th><th>Name</th><th>level</th><th>Plus</th><th>Over limit</th></tr></thead>
                            <tbody>{rows}</tbody>
                          </table>
      }
      return  <div className="cnt-index" onMouseOut={this.onMouseOut}  onMouseDown={this.onMouseDown}  onMouseUp={this.onMouseUp} onClick={this.onClick}>
                <div className="cnt-weapon-list">
                  <div className="prt-total-weapon">
                    <div className="total-hp">
                      <div className="ico-hp"></div>
                      <div className="txt-hp"></div>
                      <div className="num" title={totalWeaponHp}>{totalWeaponHp}</div>
                    </div>
                    <div className="total-atk">
                      <div className="ico-atk"></div>
                      <div className="txt-atk"></div>
                      <div className="num" title={totalWeaponAtk}>{totalWeaponAtk}</div>
                    </div>
                  </div>
                  <div className="prt-weapon-list">
                    {mainWeaponDOM}
                    <div className="cnt-weapon-sub">
                      {subWeaponDOM}
                    </div>
                  </div>
                </div>
                <div className="cnt-summon-list">
                  <div className="prt-total-summon">
                    <div className="total-hp">
                      <div className="ico-hp"></div>
                      <div className="txt-hp"></div>
                      <div className="num" title={totalSummonHp}>{totalSummonHp}</div>
                    </div>
                    <div className="total-atk">
                      <div className="ico-atk"></div>
                      <div className="txt-atk"></div>
                      <div className="num" title={totalSummonAtk}>{totalSummonAtk}</div>
                    </div>
                  </div>
                  <div className="prt-summon-list">
                    {mainSummonDOM}
                    <div className="cnt-summon-sub">
                      {subSummonDOM}
                    </div>
                  </div>
                </div>
                {weaponConfigDOM}
                {summonConfigDOM}
                <WeaponSelector weapons={window.SSR_WEAPON_RAW} />
                <SummonSelector summons={window.SSR_SUMMON_RAW} />
              </div>
    }
  });
}(window));
