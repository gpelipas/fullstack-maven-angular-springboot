import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="hero">
      <div class="hero-badge">Multi-Module Maven</div>
      <h1 class="hero-title">Angular + Spring Boot</h1>
      <p class="hero-sub">
        A production-ready fullstack template built with Angular 17 on the frontend
        and Spring Boot 3 REST API on the backend — all wired together as a
        multi-module Maven project.
      </p>
      <div class="hero-actions">
        <a routerLink="/users" class="btn btn-primary">Manage Users →</a>
        <a href="http://localhost:8080/h2-console" target="_blank" class="btn btn-outline">H2 Console ↗</a>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-icon">🌿</div>
        <h3>Spring Boot 3</h3>
        <p>REST API with JPA, H2, Lombok, validation, and a global exception handler. Swap H2 for PostgreSQL or MySQL in minutes.</p>
      </div>
      <div class="card">
        <div class="card-icon">🅰️</div>
        <h3>Angular 17</h3>
        <p>Standalone components, HttpClient, reactive forms, and Angular Router — all configured and ready to extend.</p>
      </div>
      <div class="card">
        <div class="card-icon">📦</div>
        <h3>Maven Multi-Module</h3>
        <p>Parent POM coordinates both modules. <code>frontend-maven-plugin</code> builds Angular inside the Maven lifecycle.</p>
      </div>
      <div class="card">
        <div class="card-icon">🔀</div>
        <h3>Dev Proxy</h3>
        <p><code>proxy.conf.json</code> forwards <code>/api</code> to Spring Boot during development — no CORS headaches.</p>
      </div>
    </div>

    <div class="endpoints">
      <h2>API Endpoints</h2>
      <table>
        <thead>
          <tr><th>Method</th><th>Path</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td class="method get">GET</td><td>/api/users</td><td>List all users</td></tr>
          <tr><td class="method get">GET</td><td>/api/users/:id</td><td>Get user by ID</td></tr>
          <tr><td class="method post">POST</td><td>/api/users</td><td>Create a user</td></tr>
          <tr><td class="method put">PUT</td><td>/api/users/:id</td><td>Update a user</td></tr>
          <tr><td class="method delete">DELETE</td><td>/api/users/:id</td><td>Delete a user</td></tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 56px 0 48px;
    }
    .hero-badge {
      display: inline-block;
      background: var(--primary-light);
      color: var(--primary);
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-title {
      font-size: 2.8rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    .hero-sub {
      max-width: 560px;
      margin: 0 auto 32px;
      color: var(--text-muted);
      font-size: 1.05rem;
      line-height: 1.7;
    }
    .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

    .btn {
      display: inline-flex;
      align-items: center;
      padding: 10px 24px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.15s;
      border: 2px solid transparent;
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
      &:hover { background: var(--primary-hover); text-decoration: none; }
    }
    .btn-outline {
      border-color: var(--border);
      color: var(--text);
      background: var(--surface);
      &:hover { border-color: var(--primary); color: var(--primary); text-decoration: none; }
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 20px;
      margin-bottom: 48px;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 28px 24px;
      transition: box-shadow 0.15s;
      &:hover { box-shadow: var(--shadow-md); }
    }
    .card-icon { font-size: 2rem; margin-bottom: 14px; }
    .card h3 { font-size: 1.05rem; font-weight: 600; margin-bottom: 8px; }
    .card p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; }
    code {
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 0.85em;
    }

    .endpoints {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 32px;
      margin-bottom: 40px;
    }
    .endpoints h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--border); font-size: 0.92rem; }
    th { font-weight: 600; color: var(--text-muted); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.04em; background: var(--bg); }
    td:nth-child(2) { font-family: monospace; font-size: 0.88rem; color: var(--primary); }

    .method {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.78rem;
      letter-spacing: 0.06em;
    }
    .method.get    { background: #dcfce7; color: #15803d; }
    .method.post   { background: #dbeafe; color: #1d4ed8; }
    .method.put    { background: #fef9c3; color: #a16207; }
    .method.delete { background: #fee2e2; color: #b91c1c; }
  `]
})
export class HomeComponent {}
