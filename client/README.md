# Frontend

## nginx

- serves compiled static assets [nginx](http://nginx.org/) from the `./dist` folder
- proxies to various worker end points for uploads. Right now the containers are hard coded 😕 

## Vue.js

The user interfacing applicaiton. Try somethig different. There's more than Angular and React. Ok, I wanted to play with single state trees like flux or Vuex.

### 1. Build / Setup

Run **inside** the `./vuejs` folder:

``` bash
# install modules
yarn install

# compile to ./../dist for development
yarn run webpack:watch

# compile to ./../dist for production
yarn run build
```

Note: npm is lame. Use [yarn](http://yarnpkg.com) instead. 

### 2. State Management with [Vuex](https://vuex.vuejs.org/en/getting-started.html)

- application state stored in root `store`
- actions can be asynchronous
- mutations *must* be synchronous
- using mutation types, the modules kind of just _"react"_ to events (well, that's the goal)

| Mutation Type / Event | Chunks Reaction | Uploads Reaction |
| ---- | ---- | ---- |
| `NEW_UPLOAD` | | add to uploads array|
| `CHUNK_BEGIN` | add to chunks array | sets `upload.status` to 'uploading' |
| `CHUNK_DONE` | sets `chunk.done` to true |  |
| `UPLOAD_CREATED` | housekeeping - remove chunks | sets `upload.status` to 'uploading' and copies any new attributes |

![Vuex State Flow](https://vuex.vuejs.org/en/images/vuex.png "Vuex State Flow")

### 3. vue-devtools

Debug Vue.js apps in the browser.

[https://github.com/vuejs/vue-devtools](https://github.com/vuejs/vue-devtools) 👌🏻
