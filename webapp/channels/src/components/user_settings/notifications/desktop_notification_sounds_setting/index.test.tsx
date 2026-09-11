// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {renderWithContext, screen, fireEvent} from 'tests/react_testing_utils';
import * as NotificationSounds from 'utils/notification_sounds';

import DesktopNotificationSoundsSettings, {type Props} from './index';

describe('DesktopNotificationSoundsSettings', () => {
    const baseProps: Props = {
        active: true,
        updateSection: jest.fn(),
        onSubmit: jest.fn(),
        onCancel: jest.fn(),
        saving: false,
        error: '',
        setParentState: jest.fn(),
        areAllSectionsInactive: false,
        desktopSound: 'true',
        desktopNotificationSound: 'Bing',
        dmNotificationSound: 'default',
        isCallsRingingEnabled: false,
        callsDesktopSound: 'true',
        callsNotificationSound: 'Calm',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(NotificationSounds, 'tryNotificationSound').mockImplementation(() => {});
        jest.spyOn(NotificationSounds, 'stopTryNotificationRing').mockImplementation(() => {});
    });

    test('should render message and direct message notification sound options when active', () => {
        renderWithContext(<DesktopNotificationSoundsSettings {...baseProps}/>);

        expect(screen.getByText('Message notification sound')).toBeInTheDocument();
        expect(screen.getByText('Use a different sound for direct messages')).toBeInTheDocument();
    });

    test('should have DM sound checkbox and select disabled when message sound is disabled', () => {
        const props: Props = {
            ...baseProps,
            desktopSound: 'false',
            dmNotificationSound: 'Crackle',
        };
        renderWithContext(<DesktopNotificationSoundsSettings {...props}/>);

        const dmCheckbox = screen.getByTestId('dmNotificationSoundCheckbox');
        expect(dmCheckbox).toBeDisabled();
    });

    test('should enable DM sound when DM checkbox is checked', () => {
        const setParentState = jest.fn();
        const props: Props = {
            ...baseProps,
            setParentState,
            dmNotificationSound: 'default',
        };
        renderWithContext(<DesktopNotificationSoundsSettings {...props}/>);

        const dmCheckbox = screen.getByTestId('dmNotificationSoundCheckbox');
        expect(dmCheckbox).not.toBeChecked();

        fireEvent.click(dmCheckbox);

        expect(setParentState).toHaveBeenCalledWith('dmNotificationSound', 'Bing');
        expect(NotificationSounds.tryNotificationSound).toHaveBeenCalledWith('Bing');
    });

    test('should reset DM sound to default when DM checkbox is unchecked', () => {
        const setParentState = jest.fn();
        const props: Props = {
            ...baseProps,
            setParentState,
            dmNotificationSound: 'Crackle',
        };
        renderWithContext(<DesktopNotificationSoundsSettings {...props}/>);

        const dmCheckbox = screen.getByTestId('dmNotificationSoundCheckbox');
        expect(dmCheckbox).toBeChecked();

        fireEvent.click(dmCheckbox);

        expect(setParentState).toHaveBeenCalledWith('dmNotificationSound', 'default');
    });

    test('should display collapsed text with DM sound when DM sound is configured', () => {
        const props: Props = {
            ...baseProps,
            active: false,
            dmNotificationSound: 'Crackle',
        };
        renderWithContext(<DesktopNotificationSoundsSettings {...props}/>);

        expect(screen.getByText('"Bing" for messages, "Crackle" for direct messages')).toBeInTheDocument();
    });

    test('should display collapsed text with DM sound and calls sound when both configured', () => {
        const props: Props = {
            ...baseProps,
            active: false,
            isCallsRingingEnabled: true,
            dmNotificationSound: 'Crackle',
            callsDesktopSound: 'true',
            callsNotificationSound: 'Dynamic',
        };
        renderWithContext(<DesktopNotificationSoundsSettings {...props}/>);

        expect(screen.getByText('"Bing" for messages, "Crackle" for direct messages, "Dynamic" for calls')).toBeInTheDocument();
    });

    test('should display default collapsed text when DM sound is not configured', () => {
        const props: Props = {
            ...baseProps,
            active: false,
            dmNotificationSound: 'default',
        };
        renderWithContext(<DesktopNotificationSoundsSettings {...props}/>);

        expect(screen.getByText('"Bing" for messages')).toBeInTheDocument();
    });
});
