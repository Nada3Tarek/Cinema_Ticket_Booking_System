import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  template: `
    <div class="container">
      <h1>Admin Panel</h1>
      <nav mat-tab-nav-bar>
        <a mat-tab-link routerLink="/admin/movies" routerLinkActive="active">Movies</a>
        <a mat-tab-link routerLink="/admin/shows" routerLinkActive="active">Shows</a>
        <a mat-tab-link routerLink="/admin/halls" routerLinkActive="active">Halls</a>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
    }
    nav {
      margin-bottom: 24px;
    }
  `]
})
export class AdminComponent {}

