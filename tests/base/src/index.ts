import express from 'express'

const app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3987, () => console.log('Server is running on http://localhost:3987'))
