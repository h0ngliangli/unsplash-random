import express from "express"
import process from "process"

const app = express()
const port = process.env.PORT || 3000

app.use(express.static("dist"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
