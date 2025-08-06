# Testing Multi-User Chat in Crypta

## How to Test with Multiple Users

Since Crypta is a real-time chat application, you can test the multi-user functionality easily:

### Method 1: Multiple Browser Windows/Tabs
1. Open your Crypta app in the current browser tab
2. Open a new incognito/private browser window
3. Navigate to the same URL in the incognito window
4. Generate different anonymous identities in each window
5. Both users will join the same "Main Terminal" chat room

### Method 2: Different Browsers
1. Open Crypta in Chrome
2. Open Crypta in Firefox/Safari/Edge
3. Generate different usernames in each browser
4. Test messaging between browsers

### Method 3: Different Devices
1. Access Crypta from your computer
2. Access Crypta from your phone/tablet using the same URL
3. Generate different usernames on each device

## What to Test

### Real-time Features
- Send messages from one user - they appear instantly for the other user
- Start typing in one window - typing indicator appears for other users
- Test self-destructing messages with different timers (5s, 30s, 1min, etc.)
- Try the panic mode (Ctrl+Shift+X) - should clear data and redirect

### File Sharing
- Upload files from one user
- Download files as the other user
- Test file size limits (10MB max)

### Voice Notes
- Record voice notes from one user
- Play voice notes as the other user
- Test voice quality and playback

### Security Features
- Messages are end-to-end encrypted
- Each user has their own encryption keys
- Anonymous usernames are generated randomly

## Expected Behavior

1. **User Join/Leave**: When a user joins or leaves, all other users see notifications
2. **Message Sync**: All messages appear in real-time for all users
3. **Message Expiration**: When messages expire, they disappear for all users simultaneously
4. **Typing Indicators**: When someone types, others see "[username] is typing..."
5. **Encryption**: Each message is encrypted with the recipient's public key

## Troubleshooting

If users don't see each other:
- Make sure both are using the same chat URL
- Check that both generated anonymous identities successfully
- Refresh the page if WebSocket connection fails
- Check browser console for any connection errors

The app supports unlimited concurrent users in the same chat room!