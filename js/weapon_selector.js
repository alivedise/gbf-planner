'use strict';

(function (exports) {
  exports.WeaponSelector = React.createClass({
    displayName: 'WeaponSelector',

    name: 'WeaponSelector',
    getInitialProps: function getInitialProps() {
      return {
        weapons: []
      };
    },
    getInitialState: function getInitialState() {
      return {
        attributes: ['1', '2', '3', '4', '5', '6']
      };
    },
    componentDidMount: function componentDidMount() {
      Service.register('open', this);
    },
    open: function open() {
      return new Promise((function (resolve) {
        $(this.getDOMNode()).modal();
        this.resolve = resolve;
      }).bind(this));
    },
    onClick: function onClick(evt) {
      var activeNow = this.refs.table.getDOMNode().querySelector('tr.info');
      if (activeNow) {
        activeNow.classList.remove('info');
      }
      var tr = $(evt.target).closest('tr')[0];
      tr.classList.add('info');
    },
    onSaveClick: function onSaveClick() {
      var activeNow = this.refs.table.getDOMNode().querySelector('tr.info');
      if (!activeNow) {
        this.resolve && this.resolve();
        $(this.getDOMNode()).modal('hide');
        return;
      }
      this.resolve && this.resolve(activeNow.dataset.id + ':' + activeNow.dataset.limit);
      $(this.getDOMNode()).modal('hide');
    },
    render: function render() {
      var dom = this.props.weapons.map(function (weapon) {
        var starDOM = '';
        if (weapon[14] !== '') {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-ultimate-star-on' })
          );
        }
        return React.createElement(
          'tr',
          { className: 'list-item', 'data-id': weapon[0], 'data-name': weapon[1], 'data-limit': weapon[14] === '' ? 0 : 4 },
          React.createElement(
            'td',
            null,
            React.createElement('img', { src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/weapon/m/" + weapon[0] + ".jpg" })
          ),
          React.createElement(
            'td',
            null,
            weapon[1]
          ),
          React.createElement(
            'td',
            null,
            weapon[6]
          ),
          React.createElement(
            'td',
            null,
            starDOM
          )
        );
      });
      return React.createElement(
        'div',
        { className: 'modal fade', tabindex: '-1', role: 'dialog' },
        React.createElement(
          'div',
          { className: 'modal-dialog' },
          React.createElement(
            'div',
            { className: 'modal-content' },
            React.createElement(
              'div',
              { className: 'modal-header' },
              React.createElement(
                'button',
                { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
                React.createElement(
                  'span',
                  { 'aria-hidden': 'true' },
                  '×'
                )
              ),
              React.createElement(
                'h4',
                { className: 'modal-title' },
                'Select Weapon'
              )
            ),
            React.createElement(
              'div',
              { className: 'modal-body' },
              React.createElement(
                'table',
                { ref: 'table', className: 'table table-condensed table-striped table-hover', onClick: this.onClick },
                dom
              )
            ),
            React.createElement(
              'div',
              { className: 'modal-footer' },
              React.createElement(
                'button',
                { type: 'button', className: 'btn btn-default', 'data-dismiss': 'modal' },
                'Close'
              ),
              React.createElement(
                'button',
                { type: 'button', className: 'btn btn-primary', onClick: this.onSaveClick },
                'Save changes'
              )
            )
          )
        )
      );
    }
  });
})(window);