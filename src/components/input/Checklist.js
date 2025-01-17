import React from 'react';
import PropTypes from 'prop-types';
import {append, contains, without} from 'ramda';
import classNames from 'classnames';
import CustomInput from '../../private/CustomInput';

/**
 * Checklist is a component that encapsulates several checkboxes.
 * The values and labels of the checklist is specified in the `options`
 * property and the checked items are specified with the `value` property.
 * Each checkbox is rendered as an input with a surrounding label.
 */
class Checklist extends React.Component {
  constructor(props) {
    super(props);

    this.listItem = this.listItem.bind(this);
  }

  listItem(option) {
    const {
      id,
      inputClassName,
      inputStyle,
      labelClassName,
      labelCheckedClassName,
      labelStyle,
      labelCheckedStyle,
      setProps,
      inline,
      value,
      custom,
      switch: switches
    } = this.props;

    const checked = contains(option.value, value);

    const mergedLabelStyle = checked
      ? {...labelStyle, ...labelCheckedStyle}
      : labelStyle;

    if (id && custom) {
      return (
        <CustomInput
          id={`_${id}-${option.value}`}
          checked={checked}
          className={inputClassName}
          disabled={Boolean(option.disabled)}
          type={switches ? 'switch' : 'checkbox'}
          label={option.label}
          labelStyle={mergedLabelStyle}
          className={classNames(
            labelClassName,
            checked && labelCheckedClassName
          )}
          inline={inline}
          onChange={() => {
            let newValue;
            if (contains(option.value, value)) {
              newValue = without([option.value], value);
            } else {
              newValue = append(option.value, value);
            }
            setProps({value: newValue});
          }}
          key={option.value}
        />
      );
    } else {
      return (
        <div
          className={classNames('form-check', inline && 'form-check-inline')}
          key={option.value}
        >
          <input
            checked={checked}
            className={classNames('form-check-input', inputClassName)}
            disabled={Boolean(option.disabled)}
            style={inputStyle}
            type="checkbox"
            onChange={() => {
              let newValue;
              if (contains(option.value, value)) {
                newValue = without([option.value], value);
              } else {
                newValue = append(option.value, value);
              }
              setProps({value: newValue});
            }}
          />
          <label
            style={mergedLabelStyle}
            className={classNames(
              'form-check-label',
              labelClassName,
              checked && labelCheckedClassName
            )}
            key={option.value}
          >
            {option.label}
          </label>
        </div>
      );
    }
  }

  render() {
    const {className, id, options, style, key, loading_state} = this.props;

    const items = options.map(option => this.listItem(option));

    return (
      <div
        id={id}
        style={style}
        className={className}
        key={key}
        data-dash-is-loading={
          (loading_state && loading_state.is_loading) || undefined
        }
      >
        {items}
      </div>
    );
  }
}

Checklist.propTypes = {
  /**
   * The ID of this component, used to identify dash components in callbacks.
   * The ID needs to be unique across all of the components in an app.
   */
  id: PropTypes.string,

  /**
   * An array of options
   */
  options: PropTypes.arrayOf(
    PropTypes.exact({
      /**
       * The checkbox's label
       */
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,

      /**
       * The value of the checkbox. This value corresponds to the items
       * specified in the `value` property.
       */
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,

      /**
       * If true, this checkbox is disabled and can't be clicked on.
       */
      disabled: PropTypes.bool
    })
  ),

  /**
   * The currently selected value
   */
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),

  /**
   * The class of the container (div)
   */
  className: PropTypes.string,

  /**
   * The style of the container (div)
   */
  style: PropTypes.object,

  /**
   * A unique identifier for the component, used to improve
   * performance by React.js while rendering components
   * See https://reactjs.org/docs/lists-and-keys.html for more info
   */
  key: PropTypes.string,

  /**
   * The style of the <input> checkbox element. Only used if custom=False
   */
  inputStyle: PropTypes.object,

  /**
   * The class of the <input> checkbox element
   */
  inputClassName: PropTypes.string,

  /**
   * Inline style arguments to apply to the <label> element for each item.
   */
  labelStyle: PropTypes.object,

  /**
   * Additional inline style arguments to apply to <label> elements on checked
   * items.
   */
  labelCheckedStyle: PropTypes.object,

  /**
   * CSS classes to apply to the <label> element for each item.
   */
  labelClassName: PropTypes.string,

  /**
   * Additional CSS classes to apply to the <label> element when the
   * corresponding checkbox is checked.
   */
  labelCheckedClassName: PropTypes.string,

  /**
   * Dash-assigned callback that gets fired when the value changes.
   */
  setProps: PropTypes.func,

  /**
   * Arrange Checklist inline
   */
  inline: PropTypes.bool,

  /**
   * Set to True to render toggle-like switches instead of checkboxes. Ignored
   * if custom=False
   */
  switch: PropTypes.bool,

  /**
   * RadioItems uses custom radio buttons by default. To use native radios set
   * custom to False.
   */
  custom: PropTypes.bool,

  /**
   * Object that holds the loading state object coming from dash-renderer
   */
  loading_state: PropTypes.shape({
    /**
     * Determines if the component is loading or not
     */
    is_loading: PropTypes.bool,
    /**
     * Holds which property is loading
     */
    prop_name: PropTypes.string,
    /**
     * Holds the name of the component that is loading
     */
    component_name: PropTypes.string
  })
};

Checklist.defaultProps = {
  inputStyle: {},
  inputClassName: '',
  labelStyle: {},
  labelClassName: '',
  options: [],
  value: [],
  custom: true
};

export default Checklist;
