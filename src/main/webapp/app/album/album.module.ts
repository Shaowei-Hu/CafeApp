import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CafeAppSharedModule } from '../shared';

import { ALBUM_ROUTE, AlbumComponent } from './';

@NgModule({
    imports: [
      CafeAppSharedModule,
      RouterModule.forRoot([ ALBUM_ROUTE ], { useHash: true })
    ],
    declarations: [
      AlbumComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CafeAppAlbumModule {}
