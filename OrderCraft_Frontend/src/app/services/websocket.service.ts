import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient!: Client;
  public stockUpdates$ = new BehaviorSubject<any[]>([]);
  private isConnected = false;

  connect(): void {
    this.stompClient = new Client({
      // Switch to native WebSocket (no SockJS)
      brokerURL: 'ws://localhost:4200/ws',

      reconnectDelay: 5000,
      heartbeatIncoming: 20000, // Match backend configuration
      heartbeatOutgoing: 10000, // Match backend configuration

      // Enable debug logs (remove in production)
      debug: (str) => {
        console.log('STOMP Debug:', str);
      }
    });

    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket connected', frame);
      this.isConnected = true;

      this.stompClient.subscribe('/topic/stock-updates', (msg: IMessage) => {
        if (msg.body) {
          try {
            const products = JSON.parse(msg.body);
            this.stockUpdates$.next(products);
          } catch (error) {
            console.error('Error parsing stock update message:', error);
          }
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Details:', frame.body);
      this.isConnected = false;
    };

    // Add WebSocket error handler
    this.stompClient.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    };

    // Add disconnect handler
    this.stompClient.onDisconnect = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    };

    // Activate the client with error handling
    try {
      this.stompClient.activate();
    } catch (err) {
      console.error('WebSocket failed to start:', err);
      this.isConnected = false;
    }
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      this.isConnected = false;
      console.log('WebSocket disconnected');
    }
  }

  // Helper method to check connection status
  isWebSocketConnected(): boolean {
    return this.isConnected && this.stompClient?.connected;
  }

  // Method to send messages to backend (if needed in the future)
  sendMessage(destination: string, body: any): void {
    if (this.isWebSocketConnected()) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body)
      });
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }
}
