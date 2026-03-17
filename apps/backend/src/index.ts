import { createApp } from './app.js'
import { config } from './config/index.js'

const app = createApp()

app.listen(config.port, () => {
  console.log(`BookEasy API running on http://localhost:${config.port}`)
  console.log(`Health check: http://localhost:${config.port}/health`)
})
