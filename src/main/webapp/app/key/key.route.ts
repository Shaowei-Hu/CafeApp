import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { KeyComponent } from './key.component';

export const KEY_ROUTE: Route = {
  path: 'key',
  component: KeyComponent,
  data: {
    authorities: [],
    pageTitle: 'key.title'
  },
  canActivate: [UserRouteAccessService]
};
