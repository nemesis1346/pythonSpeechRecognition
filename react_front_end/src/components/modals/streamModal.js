import React from "react";
import { Modal, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { getUrlSoundAction } from "../../actions/SoundActions";
import AudioPlayer from "react-h5-audio-player";

const style = {
  marginLeft: "30%",
  padding: "16px"
};

class ObjectDetailModal extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "",
      open: false,
      size: ""
    };
  }


  componentWillReceiveProps() {
  
  }

  show = size => () => this.setState({ size });

  close = () => {
    this.props.objectDetailCloseCallback(false);
  };

  render() {
    const { objectDetailSize, 
        objectDetailOpen, 
        objectDetailData,
        audioUrl } = this.props;
    return (
      <Modal
        style={style}
        size={objectDetailSize}
        open={objectDetailOpen}
        onClose={this.close}
      >
        <Modal.Header>Stream Audio</Modal.Header>
        <Modal.Content>
          
          <AudioPlayer
            autoPlay
            src={audioUrl}
            onPlay={e => console.log("onPlay")}
            // other props here
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="Close"
            onClick={this.close}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToPropsStreamModal = state => {
  //In this case objects is gonna be applied to the props of the component
  return {
    audioUrl: state.databaseReducer.audioUrl,
  };
};

export default connect(
    mapStateToPropsStreamModal,
  { getUrlSoundAction }
)(ObjectDetailModal);