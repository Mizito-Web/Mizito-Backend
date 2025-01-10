import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log('Received message:', message);
    this.server.emit('message', message);
  }
}
