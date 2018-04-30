import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Item } from './item.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Item>;

@Injectable()
export class ItemService {

    private resourceUrl =  SERVER_API_URL + 'api/items';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/items';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(item: Item): Observable<EntityResponseType> {
        const copy = this.convert(item);
        return this.http.post<Item>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(item: Item): Observable<EntityResponseType> {
        const copy = this.convert(item);
        return this.http.put<Item>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Item>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Item[]>> {
        const options = createRequestOption(req);
        return this.http.get<Item[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Item[]>) => this.convertArrayResponse(res));
    }

    queryByCategoryId(id: number, req?: any): Observable<HttpResponse<Item[]>> {
        const options = createRequestOption(req);
        return this.http.get<Item[]>(this.resourceUrl + '/byCategory/' + id, { params: options, observe: 'response' })
            .map((res: HttpResponse<Item[]>) => this.convertArrayResponse(res));
    }

    queryByImageNotNull(req?: any): Observable<HttpResponse<Item[]>> {
        const options = createRequestOption(req);
        return this.http.get<Item[]>(this.resourceUrl + '/image-not-null', { params: options, observe: 'response' })
            .map((res: HttpResponse<Item[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Item[]>> {
        const options = createRequestOption(req);
        return this.http.get<Item[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Item[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Item = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Item[]>): HttpResponse<Item[]> {
        const jsonResponse: Item[] = res.body;
        const body: Item[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Item.
     */
    private convertItemFromServer(item: Item): Item {
        const copy: Item = Object.assign({}, item);
        copy.date = this.dateUtils
            .convertDateTimeFromServer(item.date);
        return copy;
    }

    /**
     * Convert a Item to a JSON which can be sent to the server.
     */
    private convert(item: Item): Item {
        const copy: Item = Object.assign({}, item);

        copy.date = this.dateUtils.toDate(item.date);
        return copy;
    }
}
