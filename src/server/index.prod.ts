import { initExpressServer, startListening } from "./express";

initExpressServer().then(startListening);