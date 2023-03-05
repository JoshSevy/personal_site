import { Component, Input } from '@angular/core';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
	@Input() loading$: Observable<boolean> = of(false);
}
