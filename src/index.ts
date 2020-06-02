import * as http from "http"

import app from './app'

import { normalizePort, onListening, onError } from './utils/utils'

const server = http.createServer(app)

const port = normalizePort(process.env.HTTP_PORT || 3000)


server.listen(port)
server.on('error', onError(server))
server.on('listening', onListening(server))
