import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container header-inner">
        <a class="brand" routerLink="/">
          <span class="brand-icon">⚡</span>
          <span class="brand-text">FullStack App</span>
        </a>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
          <a routerLink="/users" routerLinkActive="active">Users</a>
        </nav>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <router-outlet />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <span>Maven Fullstack &mdash; Angular + Spring Boot</span>
      </div>
    </footer>
  `,
  styles: [`
    .header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }
    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text);
    }
    .brand-icon { font-size: 1.3rem; }
    .nav {
      display: flex;
      gap: 6px;
    }
    .nav a {
      padding: 6px 16px;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s;
      font-size: 0.95rem;
    }
    .nav a:hover { background: var(--bg); color: var(--text); }
    .nav a.active { background: var(--primary-light); color: var(--primary); }
    .main { min-height: calc(100vh - 120px); padding: 36px 0; }
    .footer {
      text-align: center;
      padding: 20px;
      color: var(--text-muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--border);
    }
  `]
})
export class AppComponent {
  title = 'frontend';
}
