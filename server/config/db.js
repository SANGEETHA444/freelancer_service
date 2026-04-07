import mongoose from 'mongoose'
import { mongoURI } from './constants.js'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`)
    process.exit(1)
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
    console.log('✅ MongoDB disconnected')
  } catch (error) {
    console.error(`❌ Database disconnection error: ${error.message}`)
    process.exit(1)
  }
}

