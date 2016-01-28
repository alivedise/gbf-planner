'use strict';

(function (exports) {
  exports.SummonSelector = React.createClass({
    displayName: 'SummonSelector',

    name: 'SummonSelector',
    getInitialProps: function getInitialProps() {
      return {
        summons: []
      };
    },
    getInitialState: function getInitialState() {
      return {
        attributes: []
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
    onFilterChange: function onFilterChange() {
      var attributes = [];

      $("input[name='attributes']:checked").each(function () {
        attributes.push($(this).val());
      });
      this.setState({
        attributes: attributes
      });
    },
    onFilterClick: function onFilterClick(evt) {
      var label = $(evt.target).closest('label')[0];
      var input = label.querySelector('input');
      if (input) {
        $(input).trigger('change');
        this.onFilterChange();
      }
    },
    render: function render() {
      var dom = this.props.summons.map(function (summon) {
        var starDOM = '';
        if (+summon[13] === 4) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-ultimate-star-on' })
          );
        } else if (+summon[13] === 3) {
          starDOM = React.createElement(
            'div',
            { className: 'prt-evolution-star-s' },
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' }),
            React.createElement('div', { className: 'prt-star-on' })
          );
        }
        if (this.state.attributes.length) {
          if (this.state.attributes.indexOf('' + SummonStore.getElementAttribute(summon[2])) < 0) {
            return '';
          }
        }
        return React.createElement(
          'tr',
          { className: 'list-item', 'data-id': summon[0], 'data-name': summon[1], 'data-limit': +summon[13] },
          React.createElement(
            'td',
            null,
            React.createElement('img', { src: "http://gbf.game-a.mbga.jp/assets/img/sp/assets/summon/party_sub/" + summon[0] + ".jpg" })
          ),
          React.createElement(
            'td',
            null,
            summon[1]
          ),
          React.createElement(
            'td',
            null,
            summon[7]
          ),
          React.createElement(
            'td',
            null,
            starDOM
          )
        );
      }, this);

      dom.unshift(React.createElement(
        'tr',
        { key: 'summon-deselect', className: 'list-item', 'data-id': '', 'data-limit': '0' },
        React.createElement('td', null),
        React.createElement(
          'td',
          null,
          'Cancel Choose/取消目前選擇'
        ),
        React.createElement('td', null),
        React.createElement('td', null)
      ));
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
                'Select Summon'
              ),
              React.createElement(
                'form',
                null,
                React.createElement(
                  'div',
                  { className: 'btn-group', 'data-toggle': 'buttons', onClick: this.onFilterClick },
                  React.createElement(
                    'label',
                    { className: 'btn btn-info', htmlFor: 'attribute-1' },
                    React.createElement('input', { type: 'checkbox', id: 'attribute-1', name: 'attributes', value: '1', autocomplete: 'off', onChange: this.onFilterChange }),
                    '火'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info', htmlFor: 'attribute-2' },
                    React.createElement('input', { type: 'checkbox', id: 'attribute-2', name: 'attributes', value: '2', autocomplete: 'off', onChange: this.onFilterChange }),
                    '水'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info', htmlFor: 'attribute-3' },
                    React.createElement('input', { type: 'checkbox', id: 'attribute-3', name: 'attributes', value: '3', autocomplete: 'off', onChange: this.onFilterChange }),
                    '土'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info', htmlFor: 'attribute-4' },
                    React.createElement('input', { type: 'checkbox', id: 'attribute-4', name: 'attributes', value: '4', autocomplete: 'off', onChange: this.onFilterChange }),
                    '風'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info', htmlFor: 'attribute-5' },
                    React.createElement('input', { type: 'checkbox', id: 'attribute-5', name: 'attributes', value: '5', autocomplete: 'off', onChange: this.onFilterChange }),
                    '光'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info', htmlFor: 'attribute-6' },
                    React.createElement('input', { type: 'checkbox', id: 'attribute-6', name: 'attributes', value: '6', autocomplete: 'off', onChange: this.onFilterChange }),
                    '闇'
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'modal-body' },
              React.createElement(
                'table',
                { ref: 'table', onClick: this.onClick, className: 'table table-condensed table-striped' },
                React.createElement(
                  'tbody',
                  null,
                  dom
                )
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