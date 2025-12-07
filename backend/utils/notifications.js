const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
});

/**
 * Send push notification to a user
 * @param {string} pushToken - Expo push token
 * @param {object} notification - Notification data
 */
const sendPushNotification = async (pushToken, notification) => {
    // Check if the push token is valid
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
    }

    const message = {
        to: pushToken,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        badge: notification.badge || 1,
    };

    try {
        const ticket = await expo.sendPushNotificationsAsync([message]);
        console.log('Push notification sent:', ticket);
        return ticket;
    } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
};

/**
 * Send push notifications to multiple users
 * @param {Array<object>} notifications - Array of {pushToken, notification}
 */
const sendBatchNotifications = async (notifications) => {
    const messages = [];

    for (const { pushToken, notification } of notifications) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not valid`);
            continue;
        }

        messages.push({
            to: pushToken,
            sound: 'default',
            title: notification.title,
            body: notification.body,
            data: notification.data || {},
            badge: notification.badge || 1,
        });
    }

    try {
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }

        console.log(`Sent ${tickets.length} notifications`);
        return tickets;
    } catch (error) {
        console.error('Error sending batch notifications:', error);
        throw error;
    }
};

/**
 * Notification templates
 */
const NotificationTemplates = {
    newInquiry: (productTitle, buyerName) => ({
        title: 'New Inquiry',
        body: `${buyerName} is interested in your "${productTitle}"`,
        data: { type: 'inquiry' }
    }),

    inquiryResponse: (productTitle, sellerName) => ({
        title: 'Inquiry Response',
        body: `${sellerName} responded to your inquiry about "${productTitle}"`,
        data: { type: 'inquiry_response' }
    }),

    productSold: (productTitle) => ({
        title: 'Product Sold',
        body: `Your "${productTitle}" has been marked as sold`,
        data: { type: 'product_sold' }
    }),

    priceUpdate: (productTitle, newPrice) => ({
        title: 'Price Updated',
        body: `Price for "${productTitle}" updated to ₹${newPrice}`,
        data: { type: 'price_update' }
    })
};

module.exports = {
    sendPushNotification,
    sendBatchNotifications,
    NotificationTemplates
};
