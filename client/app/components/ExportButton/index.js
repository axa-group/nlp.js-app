import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'react-materialize';

export function ExportButton(props) { // eslint-disable-line react/prefer-stateless-function
  return (
    <div>
      <a style={{cursor: 'pointer'}} href={props.url}>
        <Icon className="edit-delete-icon">{props.iconName}</Icon>
        <FormattedMessage {...props.label} />
      </a>
    </div>
  );
}

ExportButton.propTypes = {
  label: PropTypes.object,
  link: PropTypes.string,
  iconName: PropTypes.string
};

export default ExportButton;
