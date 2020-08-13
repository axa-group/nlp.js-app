import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'react-materialize';

export function ExportAgentButton(props) {
  // eslint-disable-line react/prefer-stateless-function

  const apiURL = process.env.API_URL || '';
  const exportUrl = `${apiURL}/api/agent/${props.agent.id}/export`;

  return (
    <div>
      <a style={{ cursor: 'pointer' }} href={exportUrl}>
        <Icon className="edit-delete-icon">{props.iconName}</Icon>
        <FormattedMessage {...props.label} />
      </a>
    </div>
  );
}

ExportAgentButton.propTypes = {
  label: PropTypes.object,
  iconName: PropTypes.string,
  agent: PropTypes.object
};

export default ExportAgentButton;
