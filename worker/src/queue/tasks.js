const max = 5

class Tasks {
  constructor () {
    this.tasks = {}
  }

  add (id, message) {
    this.tasks[id] = message
  }

  get (id) {
    return this.tasks[id]
  }

  remove (id) {
    delete this.tasks[id]
  }

  hasCapacity () {
    return this.count() < max
  }

  count () {
    return Object.keys(this.tasks).length
  }

  ids () {
    return Object.keys(this.tasks)
  }
}

let tasks = new Tasks()

export { tasks as Tasks }
