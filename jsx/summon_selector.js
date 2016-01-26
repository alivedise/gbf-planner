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
        attributes: ['1', '2', '3', '4', '5', '6']
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
        return <tr className="list-item" data-id={summon[0]} data-name={summon[1]} data-limit={+summon[13]}>
                <td><img src={"http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/"+summon[0]+".jpg"} /></td>
                <td>{summon[1]}</td>
                <td>{summon[7]}</td>
                <td>{starDOM}</td>
              </tr>
      });
      return <div className="modal fade" tabindex="-1" role="dialog">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 className="modal-title">Select Summon</h4>
      </div>
      <div className="modal-body">
        <table ref="table" onClick={this.onClick} className="table table-condensed table-striped">{dom}</table>
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
