'use strict';

(function(exports) {
  exports.App = React.createClass({
    getInitialState: function() {
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
      }
      return {
        weaponConfig: [Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig),
                       Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig),
                       Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig), Object.assign({}, baseWeaponConfig),
                       Object.assign({}, baseWeaponConfig)],
        summonConfig: [Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig),
                       Object.assign({}, baseSummonConfig), Object.assign({}, baseSummonConfig)],
        characterConfig: {
          rank: 1,
          hp: 100,
          'attribute-bonus': 0,
          'friend': Object.assign({}, baseSummonConfig)
        }
      }
    },
    onPlusChange: function(evt) {
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
      if (slot === 'f') {
        this.setState(function(previuosState) {
          var summonConfig = previuosState.characterConfig.friend;
          summonConfig.plus = value;
          return {
            friend: previuosState.characterConfig.friend
          }
        });
      } else {
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
      }
    },
    onLevelChange: function(evt) {
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
      if (slot === 'f') {
        this.setState(function(previuosState) {
          var summonConfig = previuosState.characterConfig.friend;
          summonConfig.level = value;
          return {
            friend: previuosState.characterConfig.friend
          }
        });
      } else {
        this.setState(function(previuosState) {
          if (type === 'weapon') {
            var weaponConfig = previuosState.weaponConfig;
            weaponConfig[+slot].level = value;
            return {
              weaponConfig: weaponConfig
            }
          } else {
            var summonConfig = previuosState.summonConfig;
            summonConfig[+slot].level = value;
            return {
              summonConfig: summonConfig
            }
          }
        });
      }
    },
    onWeaponSkillLevelChange: function(evt) {
      var tr = $(evt.target).closest('tr')[0];
      var type = tr.dataset.type;
      var slot = tr.dataset.slot;
      var value = +$(evt.target).find(':selected').text();
      console.log(slot, value);
      this.setState(function(previuosState) {
        var weaponConfig = previuosState.weaponConfig;
        weaponConfig[+slot].skillLevel = value;
        return {
          weaponConfig: weaponConfig
        }
      });
    },
    componentDidMount: function() {
      this.ref = new Firebase('https://gbf-item-database.firebaseio.com');
      this.weaponRef = this.ref.child('weapon');
      this.summonRef = this.ref.child('summon');
      this.parseHash();
      WeaponStore.start();
      SummonStore.start();
      window.Appp = this;
    },
    parseHash: function() {
      var config = window.location.hash;
      var strings = config.split(';');
      if (strings.length < 17) {
        console.error('invalid hash');
        return;
      }
      var pcString = strings[0].split(',');
      var frString = strings[1].split(',');
      var weaponString = [strings[2].split(','), strings[3].split(','), strings[4].split(','), strings[5].split(','), strings[6].split(','), 
                          strings[7].split(','), strings[8].split(','), strings[9].split(','), strings[10].split(','), strings[11].split(',')]; 
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
        weaponConfig: weaponString.map(function(weapon) {
          return {
            id: weapon[0].length === 10 ? weapon[0] : '',
            limit: +weapon[1] || 0,
            level: +weapon[2] || 100,
            skillLevel: +weapon[3] || 0,
            plus: +weapon[4] || 0
          }
        }),
        summonConfig: summonString.map(function(summon) {
          return {
            id: summon[0].length === 10 ? summon[0] : '',
            limit: +summon[1] || 0,
            level: +summon[2] || 100,
            plus: +summon[3] || 0
          }
        })
      });
    },
    onClick: function(evt) {
     // console.log(evt.type, evt.target);
      if (evt.target.className.indexOf('weapon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        console.log(slot);
        Service.request('WeaponSelector:open').then(function(result) {
          if (!result) {
            return;
          }
          var a = result.split(':');
          var id = a[0];
          var limit = a[1];
          console.log(id, limit);
          this.setState(function(currentState) {
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
        }.bind(this)).catch(function(err) {
          console.log(err);
        });
      } else if (evt.target.className.indexOf('summon') >= 0) {
        var slot = +$(evt.target).closest('[data-slot]')[0].dataset.slot;
        Service.request('SummonSelector:open').then(function(result) {
          if (!result) {
            return;
          }
          var a = result.split(':');
          var id = a[0];
          var limit = a[1];
          console.log(id, limit);
          this.setState(function(currentState) {
            var summonConfig = currentState.summonConfig[slot];
            summonConfig.id = id;
            summonConfig.limit = +limit;
            summonConfig.plus = 0;
            summonConfig.level = 100;
            return {
              summonConfig: currentState.summonConfig
            };
          });
        }.bind(this)).catch(function(err) {
          console.log(err);
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
    addAmount: function(total, add) {
      total.forEach(function(a, index) {
        a.magna += add[index].magna;
        a.normal += add[index].normal;
        a.unknown += add[index].unknown;
        a.baha += add[index].baha;
      });
    },
    addBonus: function(total, add) {
      total.forEach(function(a, index) {
        a.magna += add[index].magna;
        a.normal += add[index].normal;
        a.unknown += add[index].unknown;
        a.attribute += add[index].attribute;
        a.character += add[index].character;
      });
    },
    onRankChange: function(evt) {
      var value = isNaN(evt.target.value) ? 1 : evt.target.value;

      this.setState(function(currentState) {
        var characterConfig = currentState.characterConfig;
        characterConfig.rank = value;
        return {
          characterConfig: characterConfig
        };
      });
    },
    saveConfigToHash: function() {
      var charString = this.state.characterConfig.rank + ';';
      var friendString = this.state.characterConfig.friend.id + ',' + this.state.characterConfig.friend.limit + ',' + this.state.characterConfig.friend.level + ',' +
                          this.state.characterConfig.friend.plus + ';';
      var weaponString = '';
      this.state.weaponConfig.map(function(weapon) {
        weaponString += weapon.id + ',' + weapon.limit + ',' + weapon.level + ',' + weapon.skillLevel + ',' + weapon.plus + ';';
      });
      var summonString = '';
      this.state.summonConfig.map(function(summon) {
        summonString += summon.id + ',' + summon.limit + ',' + summon.level + ',' + summon.plus + ';';
      });
      window.location.hash = charString + friendString + weaponString + summonString;
      this.refs.link.getDOMNode().value = window.location.href;
    },
    chooseFriend: function() {
      Service.request('SummonSelector:open').then(function(result) {
        if (!result) {
          return;
        }
        var a = result.split(':');
        var id = a[0];
        var limit = a[1];
        console.log(id, limit);
        this.setState(function(currentState) {
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
      }.bind(this)).catch(function() {

      });
    },
    render: function() {
      var totalWeaponHp = 0;
      var totalWeaponAtk = 0;
      var totalSummonAtk = 0;
      var totalSummonHp = 0;
      var totalBonus = [
        {
          attribute: 100,
          character: 0,
          magna: 100,
          unknown: 100,
          normal: 100
        },
        {
          attribute: 100,
          character: 0,
          magna: 100,
          unknown: 100,
          normal: 100
        },
        {
          attribute: 100,
          character: 0,
          magna: 100,
          unknown: 100,
          normal: 100
        },
        {
          attribute: 100,
          character: 0,
          magna: 100,
          unknown: 100,
          normal: 100
        },
        {
          attribute: 100,
          character: 0,
          magna: 100,
          unknown: 100,
          normal: 100
        },
        {
          attribute: 100,
          character: 0,
          magna: 100,
          unknown: 100,
          normal: 100
        }
      ];
      var totalAmount = [
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          baha: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          baha: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          baha: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          baha: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          baha: 0
        },
        {
          normal: 0,
          unknown: 0,
          magna: 0,
          baha: 0
        }
      ];


      var friendSummonDOM = '';
      if (this.state.characterConfig.friend.id) {
        var data = SummonStore.getData(this.state.characterConfig.friend);
        var realData = SummonStore.calculateRealData(this.state.characterConfig.friend);
        var add = SummonStore.calculateSummonBonus(this.state.characterConfig.friend);
        this.addBonus(totalBonus, add);
        totalSummonAtk += realData.attack;
        totalSummonHp += realData.hp;
        friendSummonDOM =
        <div className="prt-deck-select" onClick={this.chooseFriend}>
        <div className="lis-deck">
          <div className="prt-supporter" data-summon-id={this.state.characterConfig.friend.id}>
            <div className="prt-supporter-name"><span className="txt-supporter-name">Friend Summon</span></div>
            <div className="prt-supporter-info">
              <div className="prt-summon-image" data-image={this.state.characterConfig.friend.id}>
                <img className="img-supporter-summon"
                  src={"http://gbf.game-a1.mbga.jp/assets/img/sp/assets/summon/m/"+this.state.characterConfig.friend.id+".jpg"}
                  alt={this.state.characterConfig.friend.id} draggable="false" />
                <div className="prt-supporter-quality">{"+" + this.state.characterConfig.friend.plus}</div>
              </div>
              <div className="prt-supporter-detail">
                <div className="prt-supporter-summon">
                  <span className="txt-summon-level">{"Lv " + this.state.characterConfig.friend.level}</span>
                  <span>{" " + data.name}</span>
                </div>
                <div className="prt-summon-skill  bless-rank1-style">{data.skill}</div>
                <div className="prt-supporter-info">
                
                </div>
              </div>
            </div>
            <div className="prt-supporter-thumb">
              <img className="img-supporter" src="http://gbf.game-a1.mbga.jp/assets/img/sp/assets/leader/a/150201_sw_1_01.png" alt="150201_sw_1_01" draggable="false" />
              </div>
          </div>
        </div>
        </div>
      } else {
        friendSummonDOM = 
        <div className="prt-deck-select" onClick={this.chooseFriend}>
          <div className="lis-deck">
            <div className="prt-supporter" data-summon-id={this.state.characterConfig.friend.id}>
              <div className="prt-supporter-name"><span className="txt-supporter-name">Friend Summon</span></div>
              <div className="prt-supporter-info">
                <div className="prt-summon-image blank">
                </div>
                <div className="prt-supporter-detail">
                  <div className="prt-supporter-summon">
                    Choose friend summon ..
                  </div>
                  <div className="prt-summon-skill  bless-rank1-style"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      var subWeaponDOM = this.state.weaponConfig.map(function(weapon, index) {
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
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-ultimate-star-on"></div>
                      </div>;
          } else if (weapon.level > 80) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div>
                      </div>;
          } else if (weapon.level > 80) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div>
                      </div>;
          } else if (weapon.level > 40) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div>
                      </div>;
          } 
          return  <div className="lis-weapon-sub" data-slot={index}>
              <div className="btn-weapon rarity-4">
                <img className="img-weapon-sub" src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/"+weapon.id+".jpg"} />
                <div className="shining-1"></div>
                <div className="shining-2"></div>
                {starDOM}
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
      if (!this.state.weaponConfig[0].id) {
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
          starDOM = <div className="prt-evolution-star-s">
                      <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-ultimate-star-on"></div>
                    </div>;
        } else if (weapon.level > 80) {
          starDOM = <div className="prt-evolution-star-s">
                      <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div>
                    </div>;
        } else if (weapon.level > 60) {
          starDOM = <div className="prt-evolution-star-s">
                      <div className="prt-star-on"></div><div className="prt-star-on"></div>
                    </div>;
        } else if (weapon.level > 40) {
          starDOM = <div className="prt-evolution-star-s">
                      <div className="prt-star-on"></div><div className="prt-star-on"></div>
                    </div>;
        }
        mainWeaponDOM = 
          <div className="cnt-weapon-main" data-slot="0">
            <div className="prt-main-bg">
              <div className="prt-weapon-icon">
                <div className="ico-weapon-s1"></div>
                
                  <div className="ico-weapon-s4"></div>
                
              </div>
              <div className="btn-weapon">
                <img className="img-weapon-main" src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/ls/"+this.state.weaponConfig[0].id+".jpg"} />
                {starDOM}
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
          starDOM = <div className="prt-evolution-star-s">
                      <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-ultimate-star-on"></div>
                    </div>;
        } else if (summonData.limit === 3) {
          starDOM = <div className="prt-evolution-star-s">
                      <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div>
                    </div>;
        } else if (summon.level > 60) {
          starDOM = <div className="prt-evolution-star-s">
                      <div className="prt-star-on"></div><div className="prt-star-on"></div>
                    </div>;
        } else if (summon.level > 40) {
          starDOM = <div className="prt-evolution-star-s">
                      <div className="prt-star-on"></div>
                    </div>;
        }
        mainSummonDOM = <div className="cnt-summon-main">
                <div className="prt-main-bg">
                  <div className="btn-summon rarity-2" data-slot="0">
                    <img className="img-summon-main" src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_main/"+this.state.summonConfig[0].id+".jpg"} />
                    <div className="prt-attr-icon">
                      <div className={"icon_type_b_" + attribute}></div>
                    </div>
                    <div className="shining-1"></div>
                    <div className="shining-2"></div>
                    {starDOM}
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
      var subSummonDOM = this.state.summonConfig.map(function(summon, index) {
        if (index === 0) {
          return '';
        } else if (summon.id) {
          var summonData = SummonStore.getData(summon);
          var realData = SummonStore.calculateRealData(summon);
          var realHp = realData.hp;
          var realAtk = realData.attack
          totalSummonHp += realHp;
          totalSummonAtk += realAtk;
          var starDOM = '';

          if (summonData.limit === 4) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-ultimate-star-on"></div>
                      </div>;
          } else if (summonData.limit === 3) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div>
                      </div>;
          } else if (summon.level > 60) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div>
                      </div>;
          } else if (summon.level > 40) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div>
                      </div>;
          }
          return <div className="lis-summon-sub">
                  <div className="btn-summon rarity-3" data-slot={index}>
                    <img className="img-summon-sub" src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/"+summon.id+".jpg"} />
                    <div className="prt-attr-icon">
                      <div className="icon_type_6"></div>
                    </div>
                    <div className="shining-1"></div>
                    <div className="shining-2"></div>
                    {starDOM}
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
      var amountDOM = '';
      if (totalWeaponAtk) {
        var from150 = [], from15=[], from100 = [], from99 = [], from10 = [];
        for (var i = 1; i <= 150; i++) {
          from150.push(<option value={i}>{i}</option>);
        }
        for (var i = 1; i <= 10; i++) {
          from10.push(<option value={i}>{i}</option>);
        }
        for (var i = 1; i <= 15; i++) {
          from15.push(<option value={i}>{i}</option>);
        }
        for (var i = 0; i < 100; i++) {
          from99.push(<option value={i}>{i}</option>);
        }
        for (var i = 1; i <= 100; i++) {
          from100.push(<option value={i}>{i}</option>);
        }
        var rows = [];
        this.state.weaponConfig.forEach(function(weapon, index) {
          if (weapon.id) {
            var weaponData = WeaponStore.getData(weapon);
            var starDOM = '';
            if (weaponData.limit === 4) {
              starDOM = <div className="prt-evolution-star-s">
                          <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-ultimate-star-on"></div>
                        </div>;
            }
            rows.push(<tr data-type="weapon" data-slot={index} key={"weapon-config-" + index}>
                      <td className="list-item"><img src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/"+weapon.id+".jpg"} />
                </td>
                      <td>{index + 1}</td>
                      <td>{weaponData.name}</td>
                      <td><select className="level" value={weapon.level} onChange={this.onLevelChange}>{weaponData.max_level === 100 ? from100 : from150}</select></td>
                      <td><select className="plus" value={weapon.plus} onChange={this.onPlusChange}>{from99}</select></td>
                      <td><select className="skillLevel" value={weapon.skillLevel} onChange={this.onWeaponSkillLevelChange}>{weaponData.limit === 4 ? from15 : from10}</select></td>
                      <td>
                        {starDOM}
                      </td>
                   </tr>);
          } else {
          }
        }, this);
        weaponConfigDOM = <table className="table table-condensed table-striped table-hover">
                            <thead><tr><th></th><th>Slot</th><th>Name</th><th>level</th><th>Plus</th><th>Skill level</th><th>Over limit</th></tr></thead>
                            <tbody>{rows}</tbody>
                          </table>

        // Amount
        var rankAtk = 1000;
        if (this.state.characterConfig.rank === 2) {
          rankAtk += 80;
        } else if (this.state.characterConfig.rank > 2) {
          rankAtk += this.state.characterConfig.rank * 40;
        }
        var mainAttribute = this.state.weaponConfig[0].id ?
            WeaponStore.getData(this.state.weaponConfig[0]).attribute : 1;
        var magnaPercentage = 1 + totalAmount[mainAttribute - 1].magna/100 * (totalBonus[mainAttribute - 1].magna / 100);
        var normalPercentage = 1 + (totalBonus[mainAttribute - 1].character + totalAmount[mainAttribute - 1].baha + totalAmount[mainAttribute - 1].normal * (totalBonus[mainAttribute - 1].normal / 100))/100 ;
        var attributePercentage = 1 * (totalBonus[mainAttribute - 1].attribute) / 100;
        var unknownPercentage = 1 + totalAmount[mainAttribute - 1].unknown/100 * (totalBonus[mainAttribute - 1].unknown / 100);
        var calculatedAtk = (totalSummonAtk + totalWeaponAtk + rankAtk) * attributePercentage * magnaPercentage * normalPercentage * unknownPercentage;
        
        amountDOM = <div className="emulator amount">
                      <sup>基礎攻擊</sup>
                      {'(' + (totalWeaponAtk + totalSummonAtk)}
                      <span className="operator"> + </span>
                      { (rankAtk) +')'}
                      <span className="operator"> X </span>
                      <sup>屬性</sup>
                      {'(' + (totalBonus[mainAttribute - 1].attribute) + '%)'}
                      <span className="operator"> X </span>
                      <sup>一般</sup>
                      {'(' + (100 + totalAmount[mainAttribute - 1].normal)}
                      %<sub>普刃</sub>+
                      {totalAmount[mainAttribute - 1].baha}
                      %<sub>巴哈</sub>+
                      {totalBonus[mainAttribute - 1].character + '%'}
                      <sub>角色</sub>)
                      <span className="operator"> X </span>
                      <sup>UN</sup>
                      {'(' + (100 + totalAmount[mainAttribute - 1].unknown) + '%)'}
                      <span className="operator"> X </span>
                      <sup>方陣</sup>
                      {'(' + (100 + totalAmount[mainAttribute - 1].magna) + '*' + (totalBonus[mainAttribute - 1].magna) + '%)'}
                      <span className="operator"> = </span>
                      <br/>
                      <sup>總合攻擊</sup>
                      {'' + Math.round(calculatedAtk)}
                    </div>
      }
      var summonConfigDOM = '';
      if (totalSummonAtk) {
        var from150 = [], from15=[], from100 = [], from4 = [], from99 = [], from80 = [];
        for (var i = 1; i <= 150; i++) {
          from150.push(<option value={i}>{i}</option>);
        }
        for (var i = 0; i < 100; i++) {
          from99.push(<option value={i}>{i}</option>);
        }
        for (var i = 1; i <= 100; i++) {
          from100.push(<option value={i}>{i}</option>);
        }
        for (var i = 1; i <= 80; i++) {
          from80.push(<option value={i}>{i}</option>);
        }
        for (var i = 0; i <= 4; i++) {
          from4.push(<option value={i}>{i}</option>);
        }
        var rows = [];
        this.state.summonConfig.forEach(function(summon, index) {
          if (summon.id) {
            var summonData = SummonStore.getData(summon);
            var starDOM = '';
            if (summonData.limit === 4) {
              starDOM = <div className="prt-evolution-star-s">
                          <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-ultimate-star-on"></div>
                        </div>;
            } else if (summonData.limit === 3) {
              starDOM = <div className="prt-evolution-star-s">
                          <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div>
                        </div>;
            }
            rows.push(<tr data-type="summon" data-slot={index} key={"summon-config-" + index}>
                      <td className="list-item"><img src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/"+summon.id+".jpg"} />
                </td>
                      <td>{index + 1}</td>
                      <td>{summonData.name}</td>
                      <td><select className="level" value={summon.level} onChange={this.onLevelChange}>{summonData.limit === 4 ? from150 : summonData.limit === 3 ? from100 : from80}</select></td>
                      <td><select className="plus" value={summon.plus} onChange={this.onPlusChange}>{from99}</select></td>
                      <td>{starDOM}</td>
                   </tr>);
          } else {
          }
        }, this);
        if (this.state.characterConfig.friend.id) {
          var summon = this.state.characterConfig.friend;
          var summonData = SummonStore.getData(this.state.characterConfig.friend);
          var starDOM = '';
          if (summonData.limit === 4) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-ultimate-star-on"></div>
                      </div>;
          } else if (summonData.limit === 3) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div>
                      </div>;
          }
          rows.push(<tr data-type="summon" data-slot='f' key={"summon-config-friend"}>
                    <td className="list-item"><img src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/"+summonData.id+".jpg"} />
              </td>
                    <td>Friend</td>
                    <td>{summonData.name}</td>
                    <td><select className="level" value={summon.level} onChange={this.onLevelChange}>{summonData.limit === 4 ? from150 : summonData.limit === 3 ? from100 : from80}</select></td>
                    <td><select className="plus" value={summon.plus} onChange={this.onPlusChange}>{from99}</select></td>
                    <td>{starDOM}</td>
                 </tr>);
        }
        summonConfigDOM = <table className="table table-condensed table-striped table-hover">
                            <thead><tr><th></th><th>Slot</th><th>Name</th><th>level</th><th>Plus</th><th>Over limit</th></tr></thead>
                            <tbody>{rows}</tbody>
                          </table>
      }
      var characterConfigDOM = 
        <form className="form-inline">
          <div className="form-group">
            <button onClick={this.saveConfigToHash} className="btn btn-info" id="friend">Generate link/產生連結</button><input className="form-control link"  ref="link" readonly="true" value={window.location.href} />
          </div>
        </form>

      return <div className="planner">
              <header>
                <nav className="navbar navbar-inverse">
                  <div className="container-fluid">
                    <div className="navbar-header">
                      <a className="navbar-brand" href="#">
                      <sup>@Cygames, Inc</sup>
                        Granblue Fantasy Planner <sub><span className="label label-warning label-sm">v0.0.1BETA RC4</span></sub>
                      </a>
                      <p className="navbar-text">by <a href="http://github.com/alivedise">alivedise</a></p>

                    </div>
                  </div>
                </nav>
              </header>
              {friendSummonDOM}
              <div className="cnt-index" onMouseOut={this.onMouseOut}  onMouseDown={this.onMouseDown}  onMouseUp={this.onMouseUp} onClick={this.onClick}>
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
              </div>
              <div className="container">
                {amountDOM}
                {characterConfigDOM}
                {weaponConfigDOM}
                {summonConfigDOM}
              </div>
              <WeaponSelector weapons={window.SSR_WEAPON_RAW} />
              <SummonSelector summons={window.SSR_SUMMON_LIMIT_BREAK} />
            </div>
    }
  });
}(window));
