import React from 'react';
import {View, Text} from 'react-native';
import AudioCardView from 'react-native-audio-card-view';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {connect} from 'react-redux';

import { LocalizationContext } from '../Translations';
import ProposedIndicatorRaisedIndicatorBottomSheet from './ProposedIndicatorRaisedIndicatorBottomSheet';
import ProposedIndicatorConfirmDeleteModal from './ProposedIndicatorConfirmDeleteModal';
import ParticipantListItemInfo from '../Share/ParticipantListItemInfo';
import SwipeLeftButton from '../Share/SwipeLeftButton';
import Color from '../../themes/color';
import Participant from '../../models/Participant';
import ProposedIndicator from '../../models/ProposedIndicator';
import { getDeviceStyle } from '../../utils/responsive_util';
import { bodyFontSize, getMobileFontSizeByPixelRatio } from '../../utils/font_size_util';
import {navigationRef} from '../../navigators/app_navigator';
import {saveParticipant} from '../../actions/participantAction';
import {proposedInfoModaSnapPoints} from '../../constants/modal_constant';
import cardItemTabletStyles from '../../styles/tablet/ProposedIndicatorCardComponentStyle';
import cardItemMobileStyles from '../../styles/mobile/ProposedIndicatorCardComponentStyle';

const styles = getDeviceStyle(cardItemTabletStyles, cardItemMobileStyles);

class ProposedIndicatorRaisedParticipantList extends React.Component {
  static contextType = LocalizationContext;
  constructor(props) {
    super(props)
    this.state = {
      visibleModal: false,
      selectedParticipant: null
    }
    this.prevOpenedRow = null;
  }

  showRaisedParticipant = (participant) => {
    this.props.formModalRef.current?.setSnapPoints(proposedInfoModaSnapPoints)
    this.props.formModalRef.current?.setBodyContent(<ProposedIndicatorRaisedIndicatorBottomSheet participant={participant} scorecardUuid={this.props.scorecardUuid}/>)
    this.props.participantModalRef.current?.present();
  }

  goToEdit = (participant, swipeableMethods) => {
    swipeableMethods?.close();
    navigationRef.current?.navigate('ProposeNewIndicator', {scorecard_uuid: this.props.scorecardUuid, participant_uuid: participant.uuid, is_edit: true})
  }

  showConfirmModal = (participant, swipeableMethods) => {
    this.setState({visibleModal: true, selectedParticipant: participant})
    swipeableMethods?.close();
  }

  renderRightButtons = (participant, swipeableMethods) => {
    const {translations} = this.context;
    const btnStyles = getDeviceStyle({ height: 94, marginTop: 8, width: 90 }, { height: 83, marginTop: 8 })
    return (
      <View style={{flexDirection: 'row'}}>
        <SwipeLeftButton label={translations.edit} backgroundColor={Color.lightBlue} customStyle={btnStyles} onPress={() => this.goToEdit(participant, swipeableMethods)} />
        <SwipeLeftButton label={translations.delete} customStyle={btnStyles} onPress={() => this.showConfirmModal(participant, swipeableMethods)} />
      </View>
    );
  }

  handleCloseRow = (swipeableMethods) => {
    if (this.prevOpenedRow && this.prevOpenedRow !== swipeableMethods) {
      this.prevOpenedRow.close();
    }
    this.prevOpenedRow = swipeableMethods;
  }

  renderParticipantList = () => {
    const mobileFontSize = getMobileFontSizeByPixelRatio(14.2, 14);
    const fontSize = getDeviceStyle(bodyFontSize(), mobileFontSize);

    return Participant.getRaisedParticipants(this.props.scorecardUuid).map((participant) => {
      return (
        <Swipeable key={participant.uuid}
          renderRightActions={(progress, translation, swipeableMethods) => 
            this.renderRightButtons(participant, swipeableMethods)
          }
          containerStyle={{paddingBottom: 6, paddingHorizontal: 2}}
          onSwipeableOpen={(direction, swipeableMethods) => this.handleCloseRow(swipeableMethods)}
          enabled={!this.props.isIndicatorBase}
        >
          <AudioCardView containerStyle={styles.participantCardContainer} hideAudioPlayer={true} titleStyle={[{marginTop: 0}, styles.label]}
            onPress={() => this.showRaisedParticipant(participant)}
          >
            <View style={{flex: 1}}>
              <ParticipantListItemInfo participant={participant} fontSize={fontSize} containerStyle={styles.participantInfoContainer} onPress={() => this.showRaisedParticipant(participant)} anonymousStyle={{alignItems: 'flex-end'}} />
              <Text style={[styles.subLabel, styles.participantInfoSubLabel]}>
                {this.context.translations.numberOfIndicator} {ProposedIndicator.find(this.props.scorecardUuid, participant.uuid).length}
              </Text>
            </View>
          </AudioCardView>
        </Swipeable>
      )
    })
  }

  confirmDelete = () => {
    ProposedIndicator.deleteByParticipant(this.props.scorecardUuid, this.state.selectedParticipant.uuid)
    this.setState({selectedParticipant: null, visibleModal: false})
    const participants = JSON.parse(JSON.stringify(Participant.getAllByScorecard(this.props.scorecardUuid)));
    this.props.saveParticipant(participants, this.props.scorecardUuid);         //call saveParticipant to make the switcher info update after deletion
  }

  render() {
    return (
      <View style={{marginTop: 12}}>
        {this.renderParticipantList()}
        <ProposedIndicatorConfirmDeleteModal
          visible={this.state.visibleModal}
          participant={this.state.selectedParticipant}
          onDismiss={() => this.setState({visibleModal: false, selectedParticipant: null})}
          onConfirm={() => this.confirmDelete()}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    participants: state.participantReducer.participants,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveParticipant: (participants, scorecardUUID) => dispatch(saveParticipant(participants, scorecardUUID)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProposedIndicatorRaisedParticipantList);