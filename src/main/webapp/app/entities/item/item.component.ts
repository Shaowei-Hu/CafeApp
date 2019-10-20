import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { Item } from './item.model';
import { ItemService } from './item.service';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';

@Component({
    selector: 'jhi-item',
    templateUrl: './item.component.html',
    styleUrls: [
        'item.scss'
    ]
})
export class ItemComponent implements OnInit, OnDestroy {

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
        if (this.currentSearch) {
            this.itemService.search({
                page: this.page - 1,
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()}).subscribe(
                    (res: HttpResponse<Item[]>) => this.onSuccess(res.body, res.headers),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        if (this.currentFilter) {
            this.itemService.queryByCategoryId(this.currentFilter, {
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()}).subscribe(
                    (res: HttpResponse<Item[]>) => this.onSuccess(res.body, res.headers),
                    (res: HttpErrorResponse) => this.onError(res.message)
            );
            return;
        }
        this.itemService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
                (res: HttpResponse<Item[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    encryptCurrentPage() {
        this.itemService.updateCurrentPage({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()});
    }

    encrypt() {
        this.items.forEach((item) => this.itemService.encryptItemWithNewKey(item));
    }

    decrypt() {
        this.items.forEach((item) => this.itemService.decryptItemWithNewKey(item));
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/item'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
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
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate(['/item', {
            search: this.currentSearch,
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.loadCategories();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInItems();
    }

    loadCategories() {
        this.categoryService.query({
            page: 0,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: HttpResponse<Category[]>) => this.onCategorySuccess(res.body),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    getCurrentCategory(currentCategoryId: number) {
        this.currentFilter = currentCategoryId;
        this.page = 1;
        this.loadAll();
        // this.categoryService.find(currentCategoryId).subscribe(
        //     (res: HttpResponse<Category>) => {
        //         this.items = res.body.items;
        //     },
        //     (res: HttpErrorResponse) => this.onError(res.message)
        // );
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

    private onCategorySuccess(data, headers?: any) {
        // this.links = this.parseLinks.parse(headers.get('link'));
        // this.totalItems = headers.get('X-Total-Count');
        this.categories = data;
        // for (let i = 0; i < data.length; i++) {
        //     this.categories.push(data[i]);
        // }
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
