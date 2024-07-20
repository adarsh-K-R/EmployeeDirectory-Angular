import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  @Input() message: string = '';
  @Input() toastType: string = 'info';
  @Input() duration: number = 5000;
  @Input() show: boolean = false;

  icon: string = '';

  private toastIcon: { [key: string]: string } = {
      success: '<img alt="Done Icon" src="../../../../assets/images/interface/done.svg">'
  };

  ngOnInit(): void {
      if (this.toastType in this.toastIcon) {
          this.icon = this.toastIcon[this.toastType];
      }

      setTimeout(() => {
          this.show = false;
      }, this.duration);
  }
}
