import { Component } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  template: `
    
  `,
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {
  isLoading = this.LoadingService.loading$;

  constructor(private LoadingService: LoadingService) {}
}