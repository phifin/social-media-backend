// index.js
import app from './src/app.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('hello world !')
  console.log(`Server is listening on port ${PORT}`)
})
