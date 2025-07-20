import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  bSidebar= false;
  bShowMenu= true;
  currentTime?: string;
  private timer: any;


  ngOnInit() {
    this.configReloj();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  configReloj() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  configMovil() {
    const width = window.innerWidth;
    this.bSidebar = width > 768;
    this.bShowMenu= !this.bSidebar;
  }

  toggleSidebar() {
    this.bSidebar = !this.bSidebar; // Alternar el estado
  }

  updateTime() {
    const now = new Date();
    this.currentTime = (now.getDay() +"/"+ now.getMonth() +"/"+ now.getFullYear()) +" - "+ now.toLocaleTimeString(); // Cambia el formato según tus necesidades
  }

  logOut() {
    localStorage.removeItem("token");
    location.reload();
  }
}
