import net from "net";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number | string;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    const message: string = msg.toString();

    console.log(`Received: ${message}`);

    const data: VehicleData = JSON.parse(message);
    const temp = parseFloat(data.battery_temperature.toString());
    
    // Send JSON over WS to frontend clients
    websocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (!Number.isNaN(temp)) client.send(message);
      }
    });

    // Safe range warning
    let warningThreshhold = 0;

    // Only run temp check if real values are recieved
    if (!Number.isNaN(temp)) {
      if (temp < 20 || temp > 80) {
        warningThreshhold++;
      } else {
        warningThreshhold = 0;
      }

      if (warningThreshhold > 3) {
        console.warn(`Battery Temperature Exceeding Safe limit at ${data.timestamp}`);
      }
    }


  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
