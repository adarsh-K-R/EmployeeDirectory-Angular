import { Component, HostBinding } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { SideNavBarComponent } from './Components/Common/side-nav-bar/side-nav-bar.component';
import { ContentComponent } from './Components/Common/content/content.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SideNavBarComponent, ContentComponent, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Employee-Directory-Angular';
  isClass1 = false;

  @HostBinding('class.side-nav-collapse') get sideNavCollapse() {
    return this.isClass1;
  }
  
  onToggle() {
    this.isClass1 = !this.isClass1;
  }
}
