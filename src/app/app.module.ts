import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import 'hammerjs';
import { ShareButtonsModule } from 'ng2-sharebuttons';

import { routing } from './app.routes';

import { SocketService } from './services/socket.service';
import { ApiService } from './services/api.service';
import { LuminateApi } from './services/luminate-api.service';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { ThankYouModalComponent } from './thank-you-modal/thank-you-modal.component';
import { DonateComponent } from './donate/donate.component';
import { DescriptionComponent } from './description/description.component';
import { TotalComponent } from './total/total.component';
import { InformationComponent } from './information/information.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ThankYouModalComponent,
    DonateComponent,
    DescriptionComponent,
    TotalComponent,
    InformationComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    routing,
    ShareButtonsModule
  ],
  providers: [
    SocketService,
    ApiService,
    LuminateApi
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }