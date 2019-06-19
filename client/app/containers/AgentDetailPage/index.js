import React from 'react';
import Helmet from 'react-helmet';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/json';
import 'brace/theme/terminal';

import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';

import { Col, Row } from 'react-materialize';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Content from '../../components/Content';
import DeleteModal from '../../components/DeleteModal';
import Form from '../../components/Form';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';

import ContentSubHeader from '../../components/ContentSubHeader';
import Preloader from '../../components/Preloader';
import SliderInput from '../../components/SliderInput';
import InputLabel from '../../components/InputLabel';
import EditDeleteButton from '../../components/EditDeleteButton';
import ExportAgentButton from '../../components/ExportAgentButton/index';
import Toggle from '../../components/Toggle';

import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';

import { deleteAgent } from '../App/actions';
import {
  makeSelectError,
  makeSelectLoading,
  makeSelectCurrentAgent,
  makeSelectSettingsData
} from '../App/selectors';

import Responses from './Components/Responses';

import messages from './messages';
import {
  makeSelectAgentData,
  makeSelectWebhookData,
  makeSelectPostFormatData,
  makeSelectAgentSettingsData
} from './selectors';
import { loadAgent, loadWebhook, loadPostFormat, loadAgentSettings } from './actions';

export class AgentDetailPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.onDeletePrompt = this.onDeletePrompt.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDeleteDismiss = this.onDeleteDismiss.bind(this);
    this.onExportAction = this.onExportAction.bind(this);
  }

  state = {
    deleteModalOpen: false,
    webhookLoaded: false
  };

  componentWillMount() {
    const { currentAgent, agent } = this.props;
    if (!currentAgent) {
      this.props.onComponentWillMount(this.props);
    } else {
      if (currentAgent.id !== agent.id) {
        this.props.onComponentWillMount(this.props);
      } else {
        if (!this.state.webhookLoaded) {
          const justWebhook = true;
          this.props.onComponentWillMount(this.props, justWebhook);
        }
      }
    }
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if (currentAgent && this.props.currentAgent && currentAgent.id !== this.props.currentAgent.id) {
      this.props.onComponentWillMount(nextProps);
    }
    if (currentAgent && !this.props.currentAgent) {
      if (!this.state.webhookLoaded) {
        const justWebhook = true;
        this.props.onComponentWillMount(nextProps, justWebhook);
      }
    }
  }

  componentDidUpdate() {
    if (this.props.error) {
      Alert.error(this.props.error.message, {
        position: 'bottom'
      });
    }
  }

  onExportAction() {
    const { currentAgent } = this.props;
    this.props.onExportAgent(currentAgent);
  }

  onDeletePrompt() {
    this.setState({
      deleteModalOpen: true
    });
  }

  onDelete() {
    const { currentAgent } = this.props;
    this.props.onDeleteAgent(currentAgent);
    this.onDeleteDismiss();
  }

  onDeleteDismiss() {
    this.setState({
      deleteModalOpen: false
    });
  }

  render() {
    const {
      loading,
      error,
      currentAgent,
      webhook,
      postFormat,
      globalSettings,
      agentSettings
    } = this.props;

    const agentProps = {
      loading,
      error,
      currentAgent
    };

    let breadcrumbs = [];

    if (!currentAgent) {
      return <div>&nbsp;</div>;
    } else {
      breadcrumbs = [{ label: 'Agent' }, { label: `${currentAgent.agentName}` }];
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {agentProps.loading ? <Preloader color="#00ca9f" size="big" /> : null}
        </Col>
        <Helmet
          title={`Agent: ${currentAgent.agentName}`}
          meta={[
            { name: 'description', content: `Details for NLU Agent ${currentAgent.agentName}` }
          ]}
        />
        <Header
          breadcrumbs={breadcrumbs}
          actionButtons={
            <div className="btn-edit-delete">
              <EditDeleteButton
                label={messages.editButton}
                iconName="edit"
                onClick={() => {
                  this.props.onChangeUrl(`/agent/${this.props.currentAgent.id}/edit`);
                }}
              />
              <EditDeleteButton
                label={messages.deleteButton}
                iconName="delete"
                onClick={this.onDeletePrompt}
              />
              <ExportAgentButton
                label={messages.exportButton}
                iconName=""
                agent={currentAgent}
              />
            </div>
          }
        />
        <Content>
          <Row>
            <header className="main-title">
              <h1>
                <span>
                  {messages.detailTitle.defaultMessage}
                  {currentAgent.agentName}
                </span>
              </h1>
              <p>
                <span>{currentAgent.description}</span>
              </p>
            </header>
          </Row>
          <Row>
            <Form>
              <FormTextInput label={messages.agentName} value={currentAgent.agentName} disabled />
              <FormTextInput
                label={messages.description}
                placeholder={messages.descriptionPlaceholder.defaultMessage}
                value={currentAgent.description}
                disabled
              />
            </Form>
          </Row>

          <Row>
            <br />
            <SliderInput
              label={messages.domainClassifierThreshold}
              tooltip={messages.domainClassifierThresholdDescription.defaultMessage}
              min="0"
              max="100"
              value={(currentAgent.domainClassifierThreshold * 100).toString()}
              onChange={() => {}}
              disabled
            />
          </Row>

          <Row>
            <Form style={{ marginTop: '0px' }}>
              <InputLabel s={12} text={messages.agentFallbackTitle} />
            </Form>
          </Row>

          {currentAgent.fallbackResponses.length > 0 ? (
            <TableContainer id="fallbackResponsesTable" quotes>
              <Table>
                <Responses fallbackResponses={currentAgent.fallbackResponses} />
              </Table>
            </TableContainer>
          ) : null}

          <Form>
            <Row>
              <Accordion>
                <AccordionItem>
                  <AccordionItemTitle>
                    {messages.agentTrainingSettingsTitle.defaultMessage}
                    <div className="accordion_arrow_inverted" />
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <p style={{ marginLeft: '-10px' }}>
                      {messages.agentTrainingSettingsDescription.defaultMessage}
                    </p>
                    <Form style={{ marginTop: '30px' }}>
                      <Row>
                        <Toggle
                          disabled
                          inline
                          strongLabel={false}
                          label={messages.expandedTrainingData.defaultMessage}
                          checked={currentAgent.extraTrainingData}
                          onChange={() => {}}
                        />
                      </Row>
                      <Row style={{ marginTop: '15px' }}>
                        <Toggle
                          disabled
                          inline
                          strongLabel={false}
                          label={messages.enableModelsPerDomain.defaultMessage}
                          checked={currentAgent.enableModelsPerDomain}
                          onChange={() => {}}
                        />
                      </Row>
                    </Form>
                  </AccordionItemBody>
                </AccordionItem>
              </Accordion>
            </Row>
          </Form>
        </Content>
        <DeleteModal
          isOpen={this.state.deleteModalOpen}
          onDelete={this.onDelete}
          onDismiss={this.onDeleteDismiss}
          contentBody={messages.deleteModal.text}
        />
      </div>
    );
  }
}

AgentDetailPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.bool]),
  onComponentWillMount: React.PropTypes.func,
  onDeleteAgent: React.PropTypes.func,
  onChangeUrl: React.PropTypes.func,
  onExportAgent: React.PropTypes.func
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: (props, justWebhook) => {
      if (!justWebhook) {
        dispatch(loadAgent(props.params.id));
        dispatch(loadAgentSettings(props.params.id));
      }
      if (props.currentAgent && props.currentAgent.useWebhook) {
        dispatch(loadWebhook(props.params.id));
      }
      if (props.currentAgent && props.currentAgent.usePostFormat) {
        dispatch(loadPostFormat(props.params.id));
      }
    },
    onDeleteAgent: agent => dispatch(deleteAgent(agent.id)),
    onChangeUrl: url => dispatch(push(url)),
    onExportAgent: agent => dispatch(exportAgent(agent.id))
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  currentAgent: makeSelectCurrentAgent(),
  agent: makeSelectAgentData(),
  webhook: makeSelectWebhookData(),
  postFormat: makeSelectPostFormatData(),
  globalSettings: makeSelectSettingsData(),
  agentSettings: makeSelectAgentSettingsData()
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgentDetailPage);
