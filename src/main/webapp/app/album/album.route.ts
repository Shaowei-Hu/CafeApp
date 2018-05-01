import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { AlbumComponent } from './';

export const ALBUM_ROUTE: Route = {
  path: 'album',
  component: AlbumComponent,
  data: {
    authorities: [],
    pageTitle: 'album.title'
  },
  canActivate: [UserRouteAccessService]
};
