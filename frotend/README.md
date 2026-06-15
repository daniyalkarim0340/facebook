🔐 AUTH APIs
POST   /api/auth/register        → create user + send OTP
POST   /api/auth/login           → login user
POST   /api/auth/logout          → logout user
POST   /api/auth/verify-otp      → verify OTP
POST   /api/auth/resend-otp      → resend OTP

<!-- Auth api comleteted -->

👤 USER APIs
GET    /api/users/me             → get logged-in user
GET    /api/users/:id            → get user profile
PUT    /api/users/update         → update profile
DELETE /api/users/delete         → delete account
GET    /api/users/search?q=name  → search users
📝 POST APIs (MAIN FACEBOOK FEATURE)
POST   /api/posts                → create post
GET    /api/posts                → get all posts (feed)
GET    /api/posts/:id           → get single post
PUT    /api/posts/:id           → update post
DELETE /api/posts/:id           → delete post
❤️ LIKE APIs
POST   /api/posts/:id/like       → like/unlike post
GET    /api/posts/:id/likes      → get likes count/users
💬 COMMENT APIs
POST   /api/posts/:id/comment    → add comment
GET    /api/posts/:id/comments   → get comments
DELETE /api/comments/:id         → delete comment
👥 FRIEND SYSTEM APIs (Facebook core)
POST   /api/friends/request/:id   → send friend request
POST   /api/friends/accept/:id    → accept request
POST   /api/friends/reject/:id    → reject request
DELETE /api/friends/remove/:id    → remove friend
GET    /api/friends               → get friends list
GET    /api/friends/requests      → get friend requests
🔔 NOTIFICATION APIs
GET    /api/notifications         → get notifications
PUT    /api/notifications/read    → mark as read
DELETE /api/notifications         → clear notifications
🖼️ MEDIA UPLOAD APIs
POST   /api/upload/image          → upload image
POST   /api/upload/video          → upload video
💬 CHAT / MESSAGING APIs (advanced)
POST   /api/messages              → send message
GET    /api/messages/:userId      → get chat messages
GET    /api/conversations         → get all chats
DELETE /api/messages/:id          → delete message
🔐 OTP / SECURITY FLOW APIs (your current system)
POST   /api/auth/register         → register + send OTP
POST   /api/auth/verify-otp       → verify account
POST   /api/auth/login            → login after verification
⭐ OPTIONAL ADVANCED APIs (like Facebook)
POST   /api/posts/:id/share       → share post
POST   /api/posts/:id/save        → save post
GET    /api/posts/saved           → saved posts
🧠 SIMPLE FACEBOOK ARCHITECTURE

Facebook =

Auth + Users + Posts + Likes + Comments + Friends + Notifications + Chat