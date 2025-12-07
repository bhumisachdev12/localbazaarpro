import { Alert, Platform } from 'react-native';

interface ConfirmationOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
}

/**
 * Cross-platform confirmation helper.
 * - Native: wraps Alert.alert and resolves a promise with the selected option.
 * - Web: falls back to window.confirm so buttons actually work.
 */
export const showConfirmation = ({
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    destructive = false,
}: ConfirmationOptions): Promise<boolean> => {
    if (Platform.OS === 'web') {
        const confirmFn = typeof (globalThis as any)?.confirm === 'function'
            ? (globalThis as any).confirm
            : undefined;

        if (!confirmFn) {
            return Promise.resolve(true);
        }

        return Promise.resolve(confirmFn(`${title}\n\n${message}`));
    }

    return new Promise<boolean>((resolve) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: cancelText,
                    style: 'cancel',
                    onPress: () => resolve(false),
                },
                {
                    text: confirmText,
                    style: destructive ? 'destructive' : 'default',
                    onPress: () => resolve(true),
                },
            ],
            {
                cancelable: true,
                onDismiss: () => resolve(false),
            }
        );
    });
};


