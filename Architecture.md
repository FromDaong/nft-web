## Log

I have started to notice the drawbacks of running serverless architecture for backend and I'm rewriting the backend in a serverfull architecture lol. Looking at Go or ExpressJS, but I have more experience with ExpressJS. This in its won will bring new complexity, especially scaling and load balancing, but this is only when most of the architecture patterns can be taken advantage of. Hence I am moving the backend up into the monorepo services packages, net it will bring advantages and allow to scale huge. The biggest challenge faced is

1. Running Neo4J GraphQL
2. Tying up Neo4J and MongoDB to form polyglot
3. Running jobs to generate user & home timeline
4. Router service that listens on the event bus and updates databases as required, chain events + Kafka
5. Serving realtime notifications, messaging & probably livestreaming too
6. Most importantly, I strongly believe due to the nature of the content, we might start facing issues with hosting services and migrating serverless Next.js and solutions to our problems might not be an easy task. However migrating a custom backend is a matter of just buying servers and hosting in-house.
