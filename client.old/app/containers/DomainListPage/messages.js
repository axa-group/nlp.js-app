import { defineMessages } from 'react-intl';

export default defineMessages({
  agent: {
    id: 'containers.DomainListPage.create_domain.agent',
    defaultMessage: 'Agent',
  },
  domainListTitle: {
    id: 'containers.DomainListPage.list.title',
    defaultMessage: 'Agent Domains',
  },
  domainListDescription: {
    id: 'containers.DomainListPage.list.description',
    defaultMessage: 'List of domains belonging to the selected agent',
  },
  actionButton: {
    id: 'containers.DomainListPage.list.action',
    defaultMessage: '+ Create Domain',
  },
  deleteModal: {
    text: 'Be cautious. Delete a Domain implies waterfall deletion of related Intents and Scenarios'
  }
});
