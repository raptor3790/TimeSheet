import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  appLoading = false;
  constructor(
    private _router: Router
  ) {
    this._router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.appLoading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.appLoading = false;
          break;
        }

        default: {
          break;
        }
      }
    });
  }

  ngOnInit() {
    /* this.router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
        // this.guardRoute(event);
      }
    }); */
  }

  // https://stackoverflow.com/questions/46805117/angular-run-canactivate-on-each-route-change?rq=1
  /* private guardRoute(event: RoutesRecognized): void {
    if (this.isPublic(event)) {
      return;
    }

    if (!this.callCanLoad(event, this.authGuard)) {
      console.log('role guard called');
      return;
    }
  }

  private callCanLoad(event: RoutesRecognized, guard: CanLoad) {

  }

  private isPublic(event: RoutesRecognized) {
    return event.state.root.firstChild.data.isPublic;
  } */
}
