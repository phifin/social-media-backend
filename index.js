// index.js
import app from './src/app.js'
import databaseService from './src/services/database.services.js'

const PORT = process.env.PORT || 3000

databaseService.connect()

app.listen(PORT, () => {
  console.log('hello world~~ !')
  console.log(`Server is listening on port ${PORT}`)
})
