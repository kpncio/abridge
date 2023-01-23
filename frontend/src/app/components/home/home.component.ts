import { FetchService } from 'src/app/services/fetch.service';
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  success: boolean = false;
  message: string = '';
  url: string = '';

  constructor(private router: Router, private ngZone: NgZone, private fetch: FetchService) {}

  routerLink(route: any[]): void {
    this.ngZone.run(() => this.router.navigate(route)).then();
  }

  changed(control: any): void {
    this.url = control.value;
  }

  clicked(): void {
    this.message = '';

    interface shorten {
      success: boolean;
      message: string;
    }

    const url = 'https://app.kpnc.io/shorten/' + encodeURIComponent(this.url);

    this.fetch.request(url).subscribe((response: shorten) => {
      console.log(response);

      this.success = response.success;
      this.message = response.message;
    });
  }
}
