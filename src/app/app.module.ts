import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SocketService } from './services/socket.service';
import { ApiService } from './services/api.service';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';

import { routing } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    SocketService,
    ApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
