import { Component } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {
	loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
	destroy$: Subject<void> = new Subject();

	tempData = {
		header: 'TestHeader',
		paragraph: 'TestParagraph',
		microCopy: 'TestMicroCopy',
	}

	constructor() {
		setTimeout(() => {
			this.loading$.next(false);
		}, 2000);
	}

	ngOnInit() {

	}

	ngOnDestroy() {
		this.loading$.complete();
		this.destroy$.next();
		this.destroy$.complete();
	}

}
