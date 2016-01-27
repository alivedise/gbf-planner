'use strict';

(function(exports) {
  exports.WeaponSelector = React.createClass({
    name: 'WeaponSelector',
    getInitialProps: function() {
      return {
        weapons: []
      }
    },
    getInitialState: function() {
      return {
        attributes: [],
        types: []
      }
    },
    componentDidMount: function() {
      Service.register('open', this);
    },
    open: function() {
      return new Promise(function(resolve) {
        $(this.getDOMNode()).modal();
        this.resolve = resolve;
      }.bind(this));
    },
    onClick: function(evt) {
      var activeNow = this.refs.table.getDOMNode().querySelector('tr.info');
      if (activeNow) {
        activeNow.classList.remove('info');
      }
      var tr = $(evt.target).closest('tr')[0];
      tr.classList.add('info');
    },
    onSaveClick: function() {
      var activeNow = this.refs.table.getDOMNode().querySelector('tr.info');
      if (!activeNow) {
        this.resolve && this.resolve();
        $(this.getDOMNode()).modal('hide');
        return;
      }
      this.resolve && this.resolve(activeNow.dataset.id + ':' + activeNow.dataset.limit);
      $(this.getDOMNode()).modal('hide');
    },
    onFilterChange: function() {
      var types = [];
      var attributes = [];
      $("input[name='types']:checked").each( function () {
        types.push($(this).val());
      });

      $("input[name='attributes']:checked").each( function () {
        attributes.push($(this).val());
      });
      this.setState({
        types: types,
        attributes: attributes
      })
    },
    getWeaponType: function(type) {
      switch (type) {
        case '剣':
          return 0;
        case '短剣':
          return 1;
        case '槍':
          return 2;
        case '斧':
          return 3;
        case '杖':
          return 4;
        case '銃':
          return 5;
        case '格闘':
          return 6;
        case '弓':
          return 7;
        case '楽器':
          return 8;
        case '刀':
          return 9;
      }
    },
    onFilterClick: function(evt) {
      var label = $(evt.target).closest('label')[0];
      var input = label.querySelector('input');
      if (input) {
        $(input).trigger('change');
        this.onFilterChange();
      }
    },
    render: function() {
      var dom = this.props.weapons.map(function(weapon, index) {
        var starDOM = '';
        if (weapon[14] !== '') {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-ultimate-star-on"></div>
                      </div>;
        }
        var ignore = false;
        if (this.state.attributes.length) {
          if (this.state.attributes.indexOf('' + WeaponStore.getElementAttribute(weapon[2])) < 0) {
            ignore = true;
          }
        }
        if (this.state.types.length) {
          if (this.state.types.indexOf('' + this.getWeaponType(weapon[3])) < 0) {
            ignore = true;
          }
        }

        if (ignore) {
          return '';
        } else {
          return <tr key={'weapon-' + index} className="list-item" data-id={weapon[0]} data-name={weapon[1]} data-limit={weapon[14] === '' ? 0 : 4}>
                  <td><img src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/"+weapon[0]+".jpg"} /></td>
                  <td>{weapon[1]}</td>
                  <td>{weapon[6] + " " + weapon[7]}</td>
                  <td>{starDOM}</td>
                </tr>
        }
      }, this);
      dom.unshift(<tr key={'weapon-deselect'} className="list-item" data-id="" data-limit="0">
                  <td></td>
                  <td>Cancel Choose/取消目前選擇</td>
                  <td></td>
                  <td></td>
                </tr>)
      return <div className="modal fade" tabindex="-1" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Select Weapon</h4>
                    
                    <form>
                      <div className="btn-group" data-toggle="buttons"  onClick={this.onFilterClick} >
                        <label className="btn btn-info" htmlFor="attribute-1">
                          <input type="checkbox" id="attribute-1" name="attributes" value="1" autocomplete="off" onChange={this.onFilterChange} />火
                        </label>
                        <label className="btn btn-info" htmlFor="attribute-2">
                          <input type="checkbox" id="attribute-2"  name="attributes" value="2" autocomplete="off" onChange={this.onFilterChange}  />水
                        </label>
                        <label className="btn btn-info" htmlFor="attribute-3">
                          <input type="checkbox" id="attribute-3"  name="attributes" value="3" autocomplete="off" onChange={this.onFilterChange}  />土
                        </label>
                        <label className="btn btn-info" htmlFor="attribute-4">
                          <input type="checkbox" id="attribute-4"  name="attributes" value="4" autocomplete="off" onChange={this.onFilterChange}  />風
                        </label>
                        <label className="btn btn-info" htmlFor="attribute-5">
                          <input type="checkbox" id="attribute-5"  name="attributes" value="5" autocomplete="off" onChange={this.onFilterChange}  />光
                        </label>
                        <label className="btn btn-info" htmlFor="attribute-6">
                          <input type="checkbox" id="attribute-6"  name="attributes" value="6" autocomplete="off" onChange={this.onFilterChange}  />闇
                        </label>
                      </div>

                      <div className="btn-group" data-toggle="buttons"   onClick={this.onFilterClick} >
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-0" name="types" value="0" autocomplete="off" onChange={this.onFilterChange}  />劍
                        </label>
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-1"  name="types" value="1" autocomplete="off" onChange={this.onFilterChange}  />短劍
                        </label>
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-2"  name="types" value="2" autocomplete="off" onChange={this.onFilterChange}  />槍
                        </label>
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-3"  name="types" value="3" autocomplete="off" onChange={this.onFilterChange}  />斧
                        </label>
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-4"  name="types" value="4" autocomplete="off" onChange={this.onFilterChange}  />杖
                        </label>
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-5"  name="types" value="5" autocomplete="off" onChange={this.onFilterChange}  />銃
                        </label>
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-6"  name="types" value="6" autocomplete="off" onChange={this.onFilterChange}  />格鬥
                        </label>
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-7"  name="types" value="7" autocomplete="off" onChange={this.onFilterChange}  />弓
                        </label>
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-8"  name="types" value="8" autocomplete="off" onChange={this.onFilterChange}  />樂器
                        </label>
                        <label className="btn btn-info">
                          <input type="checkbox" id="type-9"  name="types" value="9" autocomplete="off" onChange={this.onFilterChange}  />刀
                        </label>
                      </div>
                    </form>
                  </div>
                  <div className="modal-body">
                    <table ref="table" className="table table-condensed table-striped table-hover" onClick={this.onClick}><tbody>{dom}</tbody></table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={this.onSaveClick}>Save changes</button>
                  </div>
                </div>
              </div>
            </div>
    }
  });
}(window));
