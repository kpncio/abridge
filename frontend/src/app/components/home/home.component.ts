import { FetchService } from 'src/app/services/fetch.service';
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loading: boolean = false;
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
    this.loading = true;
    this.message = '';

    interface shorten {
      success: boolean;
      message: string;
    }

    const url = 'https://app.kpnc.io/shorten/' + encodeURIComponent(this.url);

    this.fetch.request(url).subscribe((response: shorten) => {
      this.loading = false;

      this.success = response.success;
      this.message = response.message;

      if (this.success) {
        this.copying('https://' + this.message.slice(-13));
      }
    });
  }

  copying(text: string): void {
    navigator.clipboard.writeText(text).then(function() {
      console.log(`Copied "${text}" to the clipboard...`);
    }, function(err) {
      console.error('Error: Cannot copy text to clipboard: ', err);
    });
  }
}
