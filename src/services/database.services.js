import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()
const uri = process.env.MONGODB_URI

class DatabaseService {
  constructor() {
    this.client = new MongoClient(uri)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }
}

// Create object
const databaseService = new DatabaseService()
export default databaseService
