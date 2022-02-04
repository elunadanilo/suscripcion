
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignalrService } from '../services/signalr.service';
import { HttpClient } from '@angular/common/http';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ticket-ui';
  listTickets: any[] = [];
  messages: string[] = [];
  message: string = "";
  user: string = "";
  ticket: string = "";
  perfil: string = "";
  currentFiles: any = [];
  myimg: any = "";

  constructor(public signalrService: SignalrService, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.signalrService.startConnection((message: any) => {
      this.listTickets.push({ mensaje: message.mensaje});
    }, (incomingConnection: any) => {
      console.log(incomingConnection);
    }, (error:any) => {
      console.log(error);
    });
  }

  addRoom() {
    this.signalrService.addTogroup(this.perfil, this.user);
  }

  async sendTicket() {
    console.log(this.ticket);
      this.signalrService.EmitirAPerfilesPorTicket(this.ticket);
  }

}

