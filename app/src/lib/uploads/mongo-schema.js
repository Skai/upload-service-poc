import mongoose from 'mongoose'
import timestampsPlugin from 'mongoose-timestamp'

const host = process.env.MONGO_HOST
const port = process.env.MONGO_PORT

let mongoUrl = `mongodb://${host}:${port}/`
let Schema = mongoose.Schema
let uploadSchema = new Schema({
  id: {
    type: String,
    index: true
  },
  name: String,
  contentType: String,
  size: Number,
  lastModifiedDate: String,
  chunks: {
    type: String, // quick and dirty :#
    default: ''
  }
})
uploadSchema.plugin(timestampsPlugin)

mongoose.connect(mongoUrl)

let Upload = mongoose.model('Upload', uploadSchema)
export { Upload }
