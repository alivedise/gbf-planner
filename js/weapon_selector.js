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
        attributes: [],
        types: []
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
      var types = [];
      var attributes = [];
      $("input[name='types']:checked").each(function () {
        types.push($(this).val());
      });

      $("input[name='attributes']:checked").each(function () {
        attributes.push($(this).val());
      });
      this.setState({
        types: types,
        attributes: attributes
      });
    },
    getWeaponType: function getWeaponType(type) {
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
    onFilterClick: function onFilterClick(evt) {
      var label = $(evt.target).closest('label')[0];
      var input = label.querySelector('input');
      if (input) {
        //input.checked = label.classList.contains('active');
        $(input).trigger('change');
        this.onFilterChange();
      }
    },
    render: function render() {
      var dom = this.props.weapons.map(function (weapon, index) {
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
          return React.createElement(
            'tr',
            { key: 'weapon-' + index, className: 'list-item', 'data-id': weapon[0], 'data-name': weapon[1], 'data-limit': weapon[14] === '' ? 0 : 4 },
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
              weapon[6] + " " + weapon[7]
            ),
            React.createElement(
              'td',
              null,
              starDOM
            )
          );
        }
      }, this);
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
                ),
                React.createElement(
                  'div',
                  { className: 'btn-group', 'data-toggle': 'buttons', onClick: this.onFilterClick },
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-0', name: 'types', value: '0', autocomplete: 'off', onChange: this.onFilterChange }),
                    '劍'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-1', name: 'types', value: '1', autocomplete: 'off', onChange: this.onFilterChange }),
                    '短劍'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-2', name: 'types', value: '2', autocomplete: 'off', onChange: this.onFilterChange }),
                    '槍'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-3', name: 'types', value: '3', autocomplete: 'off', onChange: this.onFilterChange }),
                    '斧'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-4', name: 'types', value: '4', autocomplete: 'off', onChange: this.onFilterChange }),
                    '杖'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-5', name: 'types', value: '5', autocomplete: 'off', onChange: this.onFilterChange }),
                    '銃'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-6', name: 'types', value: '6', autocomplete: 'off', onChange: this.onFilterChange }),
                    '格鬥'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-7', name: 'types', value: '7', autocomplete: 'off', onChange: this.onFilterChange }),
                    '弓'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-8', name: 'types', value: '8', autocomplete: 'off', onChange: this.onFilterChange }),
                    '樂器'
                  ),
                  React.createElement(
                    'label',
                    { className: 'btn btn-info' },
                    React.createElement('input', { type: 'checkbox', id: 'type-9', name: 'types', value: '9', autocomplete: 'off', onChange: this.onFilterChange }),
                    '刀'
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'modal-body' },
              React.createElement(
                'table',
                { ref: 'table', className: 'table table-condensed table-striped table-hover', onClick: this.onClick },
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