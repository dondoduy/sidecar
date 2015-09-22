import React from 'react';
import { connect } from 'react-redux';

import stripIndent from '../utility/strip-indent-tag';
import $ from '../utility/dom-utility';
import * as domUtility from '../utility/dom-utility';

import CopySnippetBlock from './CopySnippetBlock';
import Arrow from './Arrow';
import { setRoomName } from '../actions/MicrositeActions';


class MicrositeApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      arrowStartPoint: {
        x: 0,
        y: 0
      },
      arrowEndPoint: {
        x: 0,
        y: 0
      }
    };
  }

  componentDidMount() {
    domUtility.on(document, 'gitter-sidecar-instance-started', this.updateArrowPosition.bind(this));
    domUtility.on(window, 'resize', this.updateArrowPosition.bind(this));
    domUtility.on(React.findDOMNode(this.refs.primaryPanel), 'scroll DOMMouseScroll', this.updateArrowPosition.bind(this));
  }

  componentWillUnmount() {
    domUtility.off(document, 'gitter-sidecar-instance-started', this.updateArrowPosition.bind(this));
    domUtility.off(window, 'resize', this.updateArrowPosition.bind(this));
    domUtility.off(React.findDOMNode(this.refs.primaryPanel), 'scroll DOMMouseScroll', this.updateArrowPosition.bind(this));
  }

  render() {
    // Injected by connect() call:
    const { dispatch, roomName, documentation } = this.props;

    let sidecarBootstrapOptionsCopySnippet = stripIndent`
      <script>
        ((window.gitter = {}).chat = {}).options = {
          room: '${roomName}'
        };
      </script>
      <script src="https://sidecar.gitter.im/dist/sidecar.v0.js" async defer></script>
    `;

    return (
      <div className="panel-wrapper">
        <section className="documentation-panel">

          <div className="documentation-panel-getting-started">
            <h1 className="documentation-panel-primary-header">
              Sidecar
            </h1>

            <div className="documentation-panel-getting-started-body">
              <p>
                Please type the name of the room you want to load into your sidecar. E.g. gitterHQ/sidecar
              </p>

              <input
                className="primary-input"
                type="text"
                placeholder="Enter Room Name"
                value={this.props.roomName}
                onChange={this.onRoomNameChange.bind(this)}
              />

              <p>
                Just copy and paste it into your site.
              </p>

              <CopySnippetBlock
                value={sidecarBootstrapOptionsCopySnippet}
                annotation="A little snippet in your website"
              />
            </div>
          </div>


          <div className="documentation-panel-docs">
            <h2 className="documentation-panel-secondary-header">
              Documentation
            </h2>

            <section
              className="documentation-panel-docs-body use-markdown"
              dangerouslySetInnerHTML={{__html: documentation}}
            ></section>
          </div>
        </section>

        <section
          ref="primaryPanel"
          className="primary-panel"
        >
          <div className="primary-panel-gitter-logo-title">
            <div className="gitter-logo-holder">
              <div className="logo-left-arm" />
              <div className="logo-body-left" />
              <div className="logo-body-right" />
              <div className="logo-right-arm" />
            </div>
            <h1 className="gitter-logo-name">Gitter</h1>
          </div>

          <img
            className="sidecar-diagram"
            src="images/sidecar-diagram.svg"
          />

          <h2 className="primary-panel-secondary-header">Add some Gitter to your site</h2>

          <p>
            Sidecar is a (mostly) code-free way of embedding Gitter into your website with a simple JavaScript snippet.
          </p>

          <p>
            It works out of the box with no customization, or you can control its behaviour with some basic configuration.
          </p>

          <div
            className="see-action-text-wrapper"
          >
            <img
              ref="seeActionText"
              className="see-action-text"
              src="images/see-it-in-action-text.svg"
            />
          </div>
          <Arrow
            startPoint={this.state.arrowStartPoint}
            endPoint={this.state.arrowEndPoint}
          />
        </section>
      </div>
    );
  }


  onRoomNameChange(e) {
    // Injected by connect() call:
    const { dispatch } = this.props;

    var name = e.target.value;
    dispatch(setRoomName(name));
  }

  updateArrowPosition() {
    console.log('asdf', arguments);
    let seeActionTextElement = React.findDOMNode(this.refs.seeActionText);
    let sidecarActivationElement = $('.gitter-open-chat-button')[0];

    let seeActionTextBounds = seeActionTextElement.getBoundingClientRect();
    let activationElementBounds = sidecarActivationElement.getBoundingClientRect();

    //console.log(seeActionTextBounds, activationElementBounds);
    console.log(seeActionTextBounds.bottom);

    let padding = 15;
    this.setState({
      arrowStartPoint: {
        x: seeActionTextBounds.left + (seeActionTextBounds.width / 2),
        y: seeActionTextBounds.bottom + padding
      },
      arrowEndPoint: {
        x: activationElementBounds.left + (activationElementBounds.width / 2),
        y: activationElementBounds.top - padding
      }
   });
  }


}

MicrositeApp.propTypes = {
  // react-redux injected
  dispatch: React.PropTypes.func,

  roomName: React.PropTypes.string
};


// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(state) {
  return {
    roomName: state.roomName,
    documentation: state.documentation
  };
}



// Wrap the component to inject dispatch and state into it
export default connect(
  mapStateToProps
)(MicrositeApp);
