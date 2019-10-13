import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Category } from './category.model';
import { createRequestOption } from '../../shared';
import { KeyService } from '../../key/key.service';

export type EntityResponseType = HttpResponse<Category>;

@Injectable()
export class CategoryService {

    private resourceUrl =  SERVER_API_URL + 'api/categories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/categories';

    constructor(private http: HttpClient, private keyService: KeyService) { }

    create(category: Category): Observable<EntityResponseType> {
        const copy = this.convert(category);
        return this.http.post<Category>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(category: Category): Observable<EntityResponseType> {
        const copy = this.convert(category);
        return this.http.put<Category>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Category>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Category[]>> {
        const options = createRequestOption(req);
        return this.http.get<Category[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Category[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Category[]>> {
        const options = createRequestOption(req);
        return this.http.get<Category[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Category[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Category = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Category[]>): HttpResponse<Category[]> {
        const jsonResponse: Category[] = res.body;
        const body: Category[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Category.
     */
    private convertItemFromServer(category: Category): Category {
        let copy: Category = Object.assign({}, category);
        copy = this.decryptCategory(copy);
        return copy;
    }

    /**
     * Convert a Category to a JSON which can be sent to the server.
     */
    private convert(category: Category): Category {
        let copy: Category = Object.assign({}, category);
        copy = this.encryptCategory(copy);
        return copy;
    }

    updateCurrentPage(req?: any) {
        const options = createRequestOption(req);
        this.http.get<Category[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Category[]>) => this.convertEncryptArrayResponse(res))
            .subscribe(
                (res: HttpResponse<Category[]>) => {
                    console.log('ready to update');
                    res.body.forEach((element) => {
                        this.update(element).subscribe((result: HttpResponse<Category>) => {},
                        (result: any) => {});
                    });
                },
                (res: any) => {}
        );
    }

    private convertEncryptArrayResponse(res: HttpResponse<Category[]>): HttpResponse<Category[]> {
        const jsonResponse: Category[] = res.body;
        const body: Category[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            let item = this.convertItemFromServer(jsonResponse[i]);
            item = this.encryptCategory(item);
            body.push(item);
        }
        return res.clone({body});
    }

    private encryptCategory(category) {
        category.name = this.keyService.encrypt(category.name);
        category.information = this.keyService.encrypt(category.information);
        category.description = this.keyService.encrypt(category.description);
        return category;
    }

    private decryptCategory(category) {
        category.name = this.keyService.decrypt(category.name);
        category.information = this.keyService.decrypt(category.information);
        category.description = this.keyService.decrypt(category.description);
        return category;
    }
}
