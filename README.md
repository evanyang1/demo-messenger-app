# demo-messenger-app

## Backend data model baseline (Messenger-style)

This project now includes a backend schema foundation for common messaging features:

- `User`
  - profile basics (`name`, `email`, `avatarUrl`)
  - presence (`status`, `lastSeenAt`)
  - timestamps and indexing for account lookups
- `Conversation`
  - supports both `direct` and `group` chats
  - participant-level metadata (role, join time, archive/mute state, last-read pointer)
  - tracks `latestMessage` for inbox sorting
- `Message`
  - conversation-linked messages with type support (`text`, `image`, `file`, `system`)
  - optional attachments metadata
  - delivery/read tracking and soft-delete/edit support

### Suggested next backend steps

1. Add conversation routes:
   - create direct/group conversation
   - list conversations for current user sorted by `updatedAt`
   - update participant settings (mute/archive)
2. Add message routes:
   - send message into a conversation
   - paginated message history for a conversation
   - mark delivered/read
3. Add socket events for realtime updates:
   - new message
   - typing indicators
   - presence changes
4. Add validation rules:
   - ensure sender is part of conversation
   - enforce direct-chat participant count = 2
   - check file attachment limits
