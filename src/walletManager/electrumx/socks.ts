import net from 'net'

const SOCKS_HOST = '127.0.0.1'
const SOCKS_PORT = 9999

const writeBuffer = (socket: net.Socket, buffer: Buffer) => new Promise<void>((resolve, reject) => {
  socket.write(buffer, error => {
    if (error) {
      reject(error)
      return
    }

    resolve()
  })
})

const readOnce = (socket: net.Socket) => new Promise<Buffer>((resolve, reject) => {
  const cleanup = () => {
    socket.removeListener('data', onData)
    socket.removeListener('error', onError)
    socket.removeListener('close', onClose)
    socket.removeListener('end', onEnd)
  }

  const onData = (chunk: Buffer) => {
    cleanup()
    resolve(chunk)
  }

  const onError = (error: Error) => {
    cleanup()
    reject(error)
  }

  const onClose = () => {
    cleanup()
    reject(new Error('SOCKS connection closed unexpectedly'))
  }

  const onEnd = () => {
    cleanup()
    reject(new Error('SOCKS connection ended unexpectedly'))
  }

  socket.once('data', onData)
  socket.once('error', onError)
  socket.once('close', onClose)
  socket.once('end', onEnd)
})

export const connectViaTorSocks = async (host: string, port: number): Promise<net.Socket> => {
  const socket = net.connect({
    host: SOCKS_HOST,
    port: SOCKS_PORT
  })

  socket.setTimeout(12000)

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      socket.removeListener('connect', onConnect)
      socket.removeListener('error', onError)
    }

    const onConnect = () => {
      cleanup()
      resolve()
    }

    const onError = (error: Error) => {
      cleanup()
      reject(error)
    }

    socket.once('connect', onConnect)
    socket.once('error', onError)
  })

  try {
    await writeBuffer(socket, Buffer.from([0x05, 0x01, 0x00]))
    const greetingResponse = await readOnce(socket)

    if (greetingResponse.length < 2 || greetingResponse[0] !== 0x05 || greetingResponse[1] !== 0x00) {
      throw new Error('Tor SOCKS proxy rejected no-auth negotiation')
    }

    const hostBuffer = Buffer.from(host, 'utf8')
    const request = Buffer.alloc(7 + hostBuffer.length)
    request[0] = 0x05
    request[1] = 0x01
    request[2] = 0x00
    request[3] = 0x03
    request[4] = hostBuffer.length
    hostBuffer.copy(request, 5)
    request.writeUInt16BE(port, 5 + hostBuffer.length)

    await writeBuffer(socket, request)
    const connectResponse = await readOnce(socket)

    if (connectResponse.length < 2 || connectResponse[0] !== 0x05 || connectResponse[1] !== 0x00) {
      throw new Error(`Tor SOCKS connect failed with code ${connectResponse[1]}`)
    }

    return socket
  } catch (error) {
    socket.destroy()
    throw error
  }
}
