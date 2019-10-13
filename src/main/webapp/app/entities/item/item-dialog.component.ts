import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Item } from './item.model';
import { ItemPopupService } from './item-popup.service';
import { ItemService } from './item.service';
import { Category, CategoryService } from '../category';
import { ITEMS_PER_PAGE, Principal } from '../../shared';

@Component({
    selector: 'jhi-item-dialog',
    templateUrl: './item-dialog.component.html'
})
export class ItemDialogComponent implements OnInit {

    item: Item;
    isSaving: boolean;

    categories: Category[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private itemService: ItemService,
        private categoryService: CategoryService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.categoryService.query({
            page: 0,
            size: ITEMS_PER_PAGE
        }).subscribe((res: HttpResponse<Category[]>) => { this.categories = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.item.id !== undefined) {
            this.subscribeToSaveResponse(
                this.itemService.update(this.item));
        } else {
            this.subscribeToSaveResponse(
                this.itemService.create(this.item));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Item>>) {
        result.subscribe((res: HttpResponse<Item>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Item) {
        this.eventManager.broadcast({ name: 'itemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackCategoryById(index: number, item: Category) {
        return item.id;
    }

    checkSelected(id: number) {
        const result: number = this.item.categories.findIndex((element) => {
            return element.split('/')[0] === id.toString();
        });

        if (result > -1) {
            return 'btn btn-primary';
        } else {
            return 'btn btn-outline-primary';
        }
    }

    setCurrentCategory(id: number, name: string) {
        const result: number = this.item.categories.findIndex((element) => {
            return element.split('/')[0] === id.toString();
        });

        if (result > -1) {
            this.item.categories.splice(result, 1);
        } else {
            this.item.categories.push(id + '/' + name);
        }
    }

    getSelected(selectedVals: Array<String>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].split('/')[0]) {
                    return selectedVals[i];
                }
            }
        }
        return option.id + '/' + option.name;
    }
}

@Component({
    selector: 'jhi-item-popup',
    template: ''
})
export class ItemPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private itemPopupService: ItemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.itemPopupService
                    .open(ItemDialogComponent as Component, params['id']);
            } else {
                this.itemPopupService
                    .open(ItemDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
