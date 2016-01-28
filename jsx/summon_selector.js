'use strict';

(function(exports) {
  exports.SummonSelector = React.createClass({
    name: 'SummonSelector',
    getInitialProps: function() {
      return {
        summons: []
      }
    },
    getInitialState: function() {
      return {
        attributes: []
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
      var attributes = [];

      $("input[name='attributes']:checked").each( function () {
        attributes.push($(this).val());
      });
      this.setState({
        attributes: attributes
      })
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
      var dom = this.props.summons.map(function(summon) {
        var starDOM = '';
        if (+summon[13] === 4) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-ultimate-star-on"></div>
                      </div>;
        } else if (+summon[13] === 3) {
            starDOM = <div className="prt-evolution-star-s">
                        <div className="prt-star-on"></div><div className="prt-star-on"></div><div className="prt-star-on"></div>
                      </div>;
        }
        if (this.state.attributes.length) {
          if (this.state.attributes.indexOf('' + SummonStore.getElementAttribute(summon[2])) < 0) {
            return '';
          }
        }
        return <tr className="list-item" data-id={summon[0]} data-name={summon[1]} data-limit={+summon[13]}>
                <td><img src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/"+summon[0]+".jpg"} /></td>
                <td>{summon[1]}</td>
                <td>{summon[7]}</td>
                <td>{starDOM}</td>
              </tr>
      }, this);

      dom.unshift(<tr key={'summon-deselect'} className="list-item" data-id="" data-limit="0">
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
                    <h4 className="modal-title">Select Summon</h4>

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
                    </form>
                  </div>
                  <div className="modal-body">
                    <table ref="table" onClick={this.onClick} className="table table-condensed table-striped">
                      <tbody>{dom}</tbody>
                    </table>
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
