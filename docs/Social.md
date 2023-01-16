## Definitions

- Home Timeline: includes posts from all people user has followed.(posts of people user has followed)
- User Timeline: displays all posts user has made(activity from user)
- Search Timeline: all posts related to the keyword searched by user

## Requirements

- User able to create post
- User able to choose type of post from
  - Subscription Content
  - Collectible
  - Passport NFT
- User able to attach media to post from
  - Image
  - Video
- User able to set price for collectible post
- Service able to push collectibles and passport NFTs to followers, send push notifications
- Service able to push subscription content to subscribers
- User able to view the personalized home timeline
- User able to search keywords
- User able to search for creators

## Capacity Estimation

- Expecting a surge in user base, capacity estimated to 100,000 daily active users
- Targeting a gradual growth to 300,000 daily active users in 3 months
- Platform is more read-heavy, optimize for fast read of trits
- Smart contracts more write-heavy so optimize for gas(Layer 2? State Channels?)

### Assumptions

- 1k posts per second
- 10k reads per second
- Posts should be available to all followers with latency of max 5.0s
- Up to 400 feeds can appear on user's timeline

```
    Size per post = 10kb
    Size of post per month = 10Kb * 300,000 = 3GB per month
```

## Components

- User Service: user interaction, blocking, notifications, etc
- Treat Service: creates posts and writes activity to the blockchain and listens for blockchain events
- Feed Service: Retrieves the posts to show the user on their feed, enforces privacy options, strip reply to, remove image_url for sub content etc.
- Timeline Service: should show all the follower's most recent posts.
  - To render them in realtime is bad slow, instead, constantly generate the timeline and store it in memory. When user navigates to page they will be served from cache.
  - Timeline Updates: Followers of a creator with 1000 followers will be notified immediatly. if greater they will see updates when they request

## Design

### User timeline

All posts are saved in Redis Cache. Gives faster access to user's post via UserID in chronological order.

### Home Timeline

We use fanout technique. This is whereby we take all posts and spread out to all followers. We do this by caching the home timeline posts in Redis linked to their userID. This cache is updated everytime a creators makes a post.

If creator has many followers, the follower will have a cached home timeline minus posts from the celebs. The follower will have a cached table of all the celebs they follow. When user requests home timeline, we look up the cache for celebs and pull their posts(from their personal timeline cache) and merge with the cached home timeline posts then display in chronological order.

## Optimization

Since redis mantains and updates home timelines for all users, we should not allocate space for user who do not log in frequently. We will cache user's posts back into Redis the next time they log in meaning there will be some delay that time.

Keep only a few hundred posts in memory cache. Inactive users, querying the User Service to find the people they follow and then querying the Feed Service to get the posts from those people, and rebuild their timeline at build time and merge with their user timeline obtained from MySQL DB.

## Post generation

1. Post created
2. Post is sent to Fanout Service and pushed to Redis cache of home timelines
3. Copy of the post is sent to Apache Storm to generate trending topics(or #tags)
4. Same post is sent to Search Service to generate search index (first extracts users and hashtags from post)
5. _Post is sent to Chain Service to generate trits - should be the second step_

## Feed and Searches

When searching the query goes to timeline service which queries the search service. The search service returns the list of posts that match the query. The timeline service then queries the feed service to get the posts from the list of postIDs. The feed service then returns the posts in chronological order.

When user requests home or user timeline, the timeline services queries Redis and returns user's Feed in chronological order.

## Write Journey

- Create NFT with Treat Service
- Store media in Object Storage
- Write to chain with Chain Service and store in Redis CacheUser Timeline
- Treat Service sends post to Fanout Service
- Fanout Service queries User Service to get list of followers stored in Cache
- Fanout Service sends post to Redis Cache of each follower(Home Timeline) _[condition: followers < 1000]_
- Fanout Service sends post to Apache Storm to generate trending topics
- Fanout Service sends post to Search Service to generate search index
- Calls User Service to send notification to followers using a Queue

## Home Timeline Read Journey

- User requests Home Timeline
- Timeline Service queries Redis Cache for Home Timeline
- Query user's celeb IDs and get their posts from the celeb User Timeline
- Merge celeb's timeline and user Home Timeline in chronological order and display to user

## User Timeline Read Journey

- User requests User Timeline
- Timeline Service queries Redis Cache for User Timeline
- Display posts in chronological order

## Search Timeline Read Journey

- User requests Search Timeline
- Timeline Service queries Search Service for post IDs
- Timeline Service queries Feed Service for posts
