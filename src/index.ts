import { Server } from "@/config/server";

export const initializeServer = async () => {
  const server = new Server('boilerplate', '', '', '3000');
  await server.listen();
  return server;
}

initializeServer();
