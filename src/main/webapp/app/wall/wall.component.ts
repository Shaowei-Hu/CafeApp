import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { Item } from '../entities/item/item.model';
import { ItemService } from '../entities/item/item.service';
import { Category } from '../entities/category/category.model';
import { CategoryService } from '../entities/category/category.service';
import { ITEMS_PER_PAGE, Principal } from '../shared';

@Component({
  selector: 'jhi-wall',
  templateUrl: './wall.component.html',
  styleUrls: [
    'wall.scss'
  ]
})
export class WallComponent implements OnInit, OnDestroy {

  currentAccount: any;
  items: Item[];
  categories: Category[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  currentFilter: number;
  routeData: any;
  links: any;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  constructor(
      private itemService: ItemService,
      private categoryService: CategoryService,
      private parseLinks: JhiParseLinks,
      private jhiAlertService: JhiAlertService,
      private principal: Principal,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private eventManager: JhiEventManager
  ) {
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.routeData = this.activatedRoute.data.subscribe((data) => {
          this.page = data.pagingParams.page;
          this.previousPage = data.pagingParams.page;
          this.reverse = data.pagingParams.ascending;
          this.predicate = data.pagingParams.predicate;
      });
      this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
          this.activatedRoute.snapshot.params['search'] : '';
      this.currentFilter = 0;
  }

  loadAll() {
      this.itemService.queryByImageNotNull({
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort()}).subscribe(
              (res: HttpResponse<Item[]>) => this.onSuccess(res.body, res.headers),
              (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  clear() {
      this.page = 0;
      this.currentSearch = '';
      this.router.navigate(['/item', {
          page: this.page,
          sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }]);
      this.loadAll();
  }

  ngOnInit() {
      this.loadAll();
      this.principal.identity().then((account) => {
          this.currentAccount = account;
      });
      this.registerChangeInItems();
  }

  ngOnDestroy() {
      this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: Item) {
      return item.id;
  }
  registerChangeInItems() {
      this.eventSubscriber = this.eventManager.subscribe('itemListModification', (response) => this.loadAll());
  }

  sort() {
      const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
      if (this.predicate !== 'id') {
          result.push('id');
      }
      return result;
  }

  private onSuccess(data, headers) {
      this.links = this.parseLinks.parse(headers.get('link'));
      this.totalItems = headers.get('X-Total-Count');
      this.queryCount = this.totalItems;
      // this.page = pagingParams.page;
      this.items = data;
  }

  private onError(error) {
      this.jhiAlertService.error(error.message, null, null);
  }
}
