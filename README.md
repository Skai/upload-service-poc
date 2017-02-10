# Upload Service 

A ___message___ and ___worker___ based upload service (proof of concept)

- chunked uploads on frontend *and* backend.
- uploads stored as chunked blobs on disk.
- downloads are streamed from individual chunks back to browser.
- workers handle uploads via http `POST` requests to dynamically generated end points.

![Demo Preview](https://s3-eu-west-1.amazonaws.com/jng/misc/service-demo-screenshot.png "Demo Preview")

### Table of Contents

- [Running](#running)
- [Architecture](#architecture)
- [Messaging Design and Patterns](#messaging)
  - [Principles](#principles)
  - [Resources](#resources)
  - [Events](#events)
  - [IDs and Keys](#ids-and-keys)
    - [Headers and Correlation IDs](#headers-and-correlation-ids)
    - [Subscription IDs](#subscription-ids)
  - [Routing](#routing)
    - [Vue.js](#vuejs)
    - [App](#app)
    - [Worker](#worker)
- [Thoughts and Learnings](#thoughts--learnings)

### Todo

- encrypt/decrypt on-the-fly? Streams FTW.
- backend protocols: ditch STOMP for AMPQ? See [Thoughts/Learnings below](#not-a-fan-of-stomp-in-the-backend).
- workers keep dying - RabbitMQ configuration issue?
- dynamically spin up workers. I gave up on sharding because I figured a better and more complete solution existed in something like [Swarm](https://www.docker.com/products/docker-swarm) or [Rancher](http://rancher.com/).

### Quirks

- the worker `/tmp` folders are currently mapped to `/workspace/uploads/` in Docker. Theoretically the worker should listen for a `create` event and then move the chunk from `/tmp` into a permanent location.
- the [`broker.routes.js`](./app/src/routes/broker.routes.js) and [`client.routes.js`](./app/src/routes/client.routes.js) files are quick-and-dirty exports. Need to think of a neater way to organize messaging and routing.
- session authentication is disabled for faster development. Otherwise need to "log in" everytime the app crashes.
- need to send STOMP heart beats so that Chrome keeps the web socket open over non-secured http.

---

## Running

```
docker-compose up --build
```

Then open [http://localhost/](http://localhost/) in a browser.

In case of changes to Vue.js, run inside the `./client/vuejs/` folder:

```
yarn run webpack:watch
```

---

## Architecture

#### Main Containers

| Module   | Description |
|:---------|:----|
| App      | Here lives the business logic.|
| Client   | The [nginx](http://nginx.org) container that serves static [Vue.js](https://vuejs.org) HTML, CSS and JavaScript. |
| RabbitMQ | Message broker with [stomp](https://www.rabbitmq.com/stomp.html) and [web management console](https://www.rabbitmq.com/management.html) plugins installed. |
| Worker   | Does the heavy lifting of receiving uploads. |


#### Other Containers

| Container | Description |
|:---|:---|
| Redis | Persists sessions, so worker and app instances can authenticate users. |
| Mongo | Upload information is persisted here so we can stream chunks back into single file. |

---

## Messaging

### Principles

1. Only consume events you can handle. Do not filter messages that come into a particular subscription.
2. Design messages based on resources and events, not CRUD.
3. No correlation IDs in destinations. (Code smell to use [direct reply-to](https://www.rabbitmq.com/direct-reply-to.html)s instead?)

### Resources

- `chunk`: the upload sliced into 1 MB blobs.
- `upload`: the file itself, incl. filename, content-type, etc.

### Events

A `chunk` and an `upload` have the same states/events:

- `ready`
- `begin`
- ~~`progress`~~ 
- `done`
- `create` 

## IDs and Keys

### Headers and Correlation IDs

Custom headers use the `x-` prefix in messages, like so:

- `x-chunk-event`
- `x-chunk-id`
- `x-upload-event`
- `x-upload-id`

### Subscription IDs

Subscription IDs use the following pattern:

```
<resource-event>@<resource-id>
```

The resource name is not used (although can be inferred from ID type), for example:

```
create@ac2c86aa312774ac5ab07a651c506dbd
new@b5c427f5-2d82-4fdf-a0fb-7daf1e4b31f5
```

## Routing

- `SUBSCRIBE` for consuming messages.
- `SEND` for producing messages.
- Topic destinations follow `/topic/<resource-type>.<resource-event>` pattern.

### Vue.js

| Command   | Destination      | Description                                             |
|:----------|:-----------------|:--------------------------------------------------------|
| SEND      | `/upload/new`    | send file details to backend |
| SUBSCRIBE | `/upload/ready`  | receive chunk upload end points |
| SUBSCRIBE | `/upload/create` | receive download url after upload is created on backend |

### App

| Command   | Destination            | Description                                                         |
|:----------|:-----------------------|:--------------------------------------------------------------------|
| ~~SEND~~  | ~~`/topic/new`~~       | ~~forwards `SEND` from frontend~~ |
| SEND      | `/queue/upload`        | queue chunks for workers |
| SEND      | `/topic/upload.done`   | all chunks are upload |
| SEND      | `/topic/upload.create` | persisted in DB |
| SUBSCRIBE | `/topic/upload.#`      | blindly forwarded message to frontend |
| SUBSCRIBE | `/topic/upload.done`   | persist upload details to DB and send `upload.create` message |
| SUBSCRIBE | `/topic/chunk.ready`   | transform into `upload/ready` message for frontend |
| SUBSCRIBE | `/topic/chunk.done`    | check if all chunks are done. If so, send `upload.done` message |

À la [principle #1](#principles) above, app produces and consumes to `/topic/upload.done`. It seemed like extra messaging. But stuffing everything into the `/topic/chunk.done` callback is worse.


### Worker

| Command   | Destination          | Description                                          |
|:----------|:---------------------|:-----------------------------------------------------|
| SEND      | `/topic/chunk.ready` | worker HTTP endpoint ready to receive `POST` request |
| SEND      | `/topic/chunk.begin` | chunk uploading started  |
| SEND      | `/topic/chunk.done`  | chunk uploading finished |
| SUBSCRIBE | `/queue/upload`      | gimme work |

#### Notes

- there were more events that got lost in refactoring or disabled for noise. 
- `create` feels like it should be `created` in past tense instead.
- `create` feels like it should be named something else. It just means it's ready for download.

---

## Thoughts / Learnings

RabbitMQ is so much cooler than MQTT

- I like the temporary queues for RPCs.
- I like the [dead letter exchange](https://www.rabbitmq.com/dlx.html) concept. I thought about setting it up for the dying workers. Alas, no time.
- Awesome that Rabbit manages sessions, who's subscribed to what - multiple workers do not receive copies of same message.

#### Not a fan of STOMP in the backend

There is no perfect JavaScript library for STOMP, esp. if you want to be a server, not just a client. 

- The ancient [stompjs](https://www.npmjs.com/package/stompjs) library seemed to drop connections. 
- [webstomp-client](https://www.npmjs.com/package/webstomp-client) doesn't offer connect over TCP, so that needed to be hacked.
- JS libraries can only connect via web sockets. Wasn't as stable as TCP - but might be me....
- Too simple for the backend?
