# App

The Business Logic is separated into two layers:

## 1. Backend Logic

The most important parts:

| File | Description |
| :--- | :--- | 
| [`app.js`](src/app.js) | Has RabbitMQ (broker) and browser (client) connections |
| [`routes/broker.routes.js`](src/routes/broker.routes.js) | Message routing. Tracks chunks per upload, etc. |
| [`routes/client.routes.js`](src/routes/client.routes.js) | Message routing. Queues chunk uploads. |

#### Structure

```
├── app.js
├── lib
│   ├── index.js
│   ├── messaging
│   │   ├── index.js
│   │   ├── message.js
│   │   └── subscriptions.js
│   ├── stomp
│   │   ├── connections
│   │   │   ├── broker.connection.js
│   │   │   ├── client.connections.js
│   │   │   ├── client.js
│   │   │   └── tcp.connection.js
│   │   ├── frame.js
│   │   ├── heartbeats.js
│   │   └── index.js
│   └── uploads
│       ├── chunk.js
│       ├── chunks.js
│       ├── file.js
│       ├── files.js
│       ├── index.js
│       └── mongo-schema.js
├── routes
│   ├── broker.routes.js
│   └── client.routes.js
```

## 2. User Interfacing Logic

Process frontend commands and control the http interface exposed to frontend:

- login
- logout
- sets sessions
- frontend gets id for new uploads at `/api/upload/new` (which should be smarter)
- handles downloads, stream chunks back into single file for user

#### Structure

```
├── web
    ├── authentication.js
    ├── index.js
    └── sessions.js
```
