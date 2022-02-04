import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { HttpClient } from '@angular/common/http';
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) {
    this.buildConnection();
    //this.startConnection();
  }

  public buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl("https://localhost:44352/ticketHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      //.withAutomaticReconnect([0,1000,5000,6000,7000,8000,10000,15000])
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.elapsedMilliseconds < 60000) {
            // If we've been reconnecting for less than 60 seconds so far,
            // wait between 0 and 10 seconds before the next reconnect attempt.

            return Math.random() * 10000;
          } else {
            // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
            return null;
          }
        }
      })
      .build();
  };

  public startConnection = (onMessageCallback: Function,onIncomingConnectionCallback: Function,onErrorCallback: Function) => {
    this.hubConnection
      .start()
      .then(() => {
        console.log("Connection Started...");
        this.ListeningConnections();
        this.ListeningIncomeMessages(onMessageCallback);
        this.ListeningIncomingConnection(onIncomingConnectionCallback);
        this.ListeningError(onErrorCallback);
      })
      .catch(err => {
        /*console.log("Error while starting connection: " + err);
        setTimeout(() => {
          this.startConnection();
        }, 3000);*/
      });
  };

  private ListeningConnections() {
    this.hubConnection.on("ReceiveConnID", function (connid) {
      console.log("ConnID: " + connid);
    });
  }

  public addTogroup(room: any, user: any) {
    this.hubConnection.invoke("AddToGroup", room, user);
  }

  public EmitirAPerfilesPorTicket(room: any) {
    console.log('room ' + room);
    this.hubConnection.invoke("EmitirAPerfilesPorTicket", room)
      .catch(function (err) {
        return console.error(err.toString());
      });
  }

  public ListeningIncomeMessages(onMessageCallback: Function) {
    this.hubConnection.on("ReceiveTicket", (ticket) => {
      console.log('recibiendo ' + ticket);
      onMessageCallback({ mensaje: ticket });
    });
  }

  public ListeningIncomingConnection(onIncomingConnectionCallback: Function) {
    this.hubConnection.on("IncomingConnection", (message) => {
      onIncomingConnectionCallback({ mensaje: message });
    });
  }

  public ListeningUserConnected(onMessageCallback: Function) {
    this.hubConnection.on("ReceiveMessageUserConnected", (user, message) => {
      onMessageCallback({ mensaje: message, user: user });
    });
  }

  public ListeningError(onErrorCallback: Function) {
    this.hubConnection.on("onError", (message) => {
      onErrorCallback({ mensaje: message });
    });
  }


}
