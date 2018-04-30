import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CafeAppSharedModule } from '../shared';

import { WALL_ROUTE, WallComponent, ItemResolvePagingParams, } from './';

@NgModule({
    imports: [
      CafeAppSharedModule,
      RouterModule.forRoot([ WALL_ROUTE ], { useHash: true })
    ],
    declarations: [
      WallComponent,
    ],
    entryComponents: [
    ],
    providers: [
      ItemResolvePagingParams,
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CafeAppWallModule {}
