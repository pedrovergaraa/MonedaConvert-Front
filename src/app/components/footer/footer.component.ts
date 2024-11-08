// footer.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  buttonText: string;
  buttonLink: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateFooter();
    this.router.events.subscribe(() => {
      this.updateFooter();
    });
  }

  private updateFooter() {
    if (this.router.url === '/plans') {
      this.buttonText = 'Conversor';
      this.buttonLink = '/converter';
    } else {
      this.buttonText = 'Planes';
      this.buttonLink = '/plans';
    }
  }
}
