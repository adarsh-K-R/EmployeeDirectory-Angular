import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { InstallUpdatesComponent } from '../install-updates/install-updates.component';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [InstallUpdatesComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.css'
})
export class SideNavBarComponent implements OnInit {
  @Output() toggleEvent = new EventEmitter<void>();
  toggleSideNav() {
    this.toggleEvent.emit();
  }
  
  currentRoute: string = "";

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit(): void {}

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }
}
