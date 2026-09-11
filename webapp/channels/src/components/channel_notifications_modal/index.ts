// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import type {ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import type {Dispatch} from 'redux';

import type {Channel} from '@mattermost/types/channels';

import {updateChannelNotifyProps} from 'mattermost-redux/actions/channels';
import {getChannel, getMyChannelMember, getMyCurrentChannelMembership} from 'mattermost-redux/selectors/entities/channels';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {
    isCollapsedThreadsEnabled,
} from 'mattermost-redux/selectors/entities/preferences';

import type {GlobalState} from 'types/store/index';

import ChannelNotificationsModal from './channel_notifications_modal';

const mapStateToProps = (state: GlobalState, ownProps: {channel: Channel}) => ({
    collapsedReplyThreads: isCollapsedThreadsEnabled(state),
    channelMember: (ownProps.channel?.id ? getMyChannelMember(state, ownProps.channel.id) : undefined) || getMyCurrentChannelMembership(state),
    sendPushNotifications: getConfig(state).SendPushNotifications === 'true',
    channel: (ownProps.channel?.id ? getChannel(state, ownProps.channel.id) : undefined) || ownProps.channel,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    actions: bindActionCreators({
        updateChannelNotifyProps,
    }, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ChannelNotificationsModal);
