import React from 'react';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Header from '../../components/Header';

import image404 from '../../img/missing-api.svg';

import messages from './messages';


export default class MissingAPIPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>
        <Header breadcrumbs={[]}/>
        <Content>
          <ContentHeader headerStyle={{textAlign: 'center'}} title={messages.missingAPITitle} subTitle={messages.missingAPIDescription}>
            <img className="error-img" src={image404} alt="" />
            <p className="error-paragraph">{messages.missingAPIParagraph.defaultMessage}</p>
          </ContentHeader>
        </Content>
      </div>
    );
  }
}
