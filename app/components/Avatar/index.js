import React, { Component } from 'react';

import {
    Image,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';

import { PLACEHOLDER } from 'app/constants';

import ImagePicker from 'react-native-image-picker';

const AVATAR_OPTIONS = {
    title: 'Pick your image',
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take picture',
    chooseFromLibraryButtonTitle: 'Pick from Library',
    mediaType: 'photo',
    aspectX: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 1, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
    },
    maxWidth: 800,
    maxHeight: 800,
    cameraType: 'front',
};

const colors = {
    defaultBackgroundColor: 'transparent',
    defaultBorderColor: '#FFFFFF',
    defaultOverlayColor: '#FFFFFF',
};

const styles = StyleSheet.create({
    avatar: {
        backgroundColor: colors.defaultBackgroundColor,
    },
    miniAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    verySmallAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    smallAvatar: {
        width: 50,
        height: 50,
        borderRadius: 26,
    },
    mediumAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    defaultAvatar: {
        width: 125,
        height: 125,
        borderRadius: 63,
    },
    border: {
        borderColor: colors.defaultBorderColor,
        borderWidth: 2,
    },
});

export default class Avatar extends Component {
    static propTypes = {
        interactive: React.PropTypes.bool,
        onChange: React.PropTypes.func, // called on change when interactive is true
        onChangeFailed: React.PropTypes.func, // called on change failure when interactive is true
        onPress: React.PropTypes.func,
        overlayColor: React.PropTypes.string, // On android only, should be the same than the backgroundColor of the surrounding View
        pickerOptions: React.PropTypes.object, // TODO: Define better
        placeholderSource: React.PropTypes.number,
        placeholderURI: React.PropTypes.string,
        resizeMode: Image.propTypes.resizeMode,
        size: React.PropTypes.oneOf([
            'default',
            'mini',
            'verySmall',
            'small',
            'medium',
        ]),
        source: Image.propTypes.source,
        style: Image.propTypes.style,
        uri: React.PropTypes.string,
        withBorder: React.PropTypes.bool,
    };

    static defaultProps = {
        overlayColor: colors.defaultOverlayColor,
        resizeMode: 'cover',
    };

    state = {};

    handleInteractivePress = () => {
        ImagePicker.showImagePicker(
            {
                ...AVATAR_OPTIONS,
                ...this.props.pickerOptions,
            },
            (response) => {
                if (response.error) {
                    this.setState({
                        failed: true,
                    });
                    if (this.props.onChangeFailed) {
                        this.props.onChangeFailed();
                    }
                } else if (response.didCancel) {
                    this.setState({
                        failed: false,
                    });
                    // Do something on cancel ?
                } else {
                    const source = response;

                    source.data = `data:image/jpeg;base64,${response.data}`;
                    this.setState({
                        source,
                        failed: false,
                    });
                    if (this.props.onChange) {
                        this.props.onChange(response);
                    }
                }
            }
        );
    };

    getAppropriateSource = () => {
        let source = this.props.source;

        if (this.props.uri) {
            source = { uri: this.props.uri };
        }

        if (Platform.OS === 'android' && !source) {
            source = this.getPlaceholder();
        }

        return source;
    }

    getPlaceholder = () => {
        let placeholder = this.props.placeholderSource;

        if (!placeholder) {
            placeholder = PLACEHOLDER;
        }

        return placeholder;
    }

    renderAvatarImage = () => (
        <Image
            style={[
                Platform.OS === 'ios'
                    ? {}
                    : { overlayColor: this.props.overlayColor },
                styles.avatar,
                styles[`${this.props.size}Avatar`],
                this.props.withBorder ? styles.border : {},
                this.props.style,
            ]}
            defaultSource={this.getPlaceholder()}
            resizeMode={this.props.resizeMode}
            source={this.state.source || this.getAppropriateSource()}
        />
    );

    render() {
        if (this.props.onPress) {
            return (
                <TouchableWithoutFeedback onPress={this.props.onPress}>
                    {this.renderAvatarImage()}
                </TouchableWithoutFeedback>
            );
        }
        if (this.props.interactive) {
            return (
                <TouchableWithoutFeedback onPress={this.handleInteractivePress}>
                    {this.renderAvatarImage()}
                </TouchableWithoutFeedback>
            );
        }

        return this.renderAvatarImage();
    }
}