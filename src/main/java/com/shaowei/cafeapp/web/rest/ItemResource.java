package com.shaowei.cafeapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.shaowei.cafeapp.service.ItemService;
import com.shaowei.cafeapp.web.rest.errors.BadRequestAlertException;
import com.shaowei.cafeapp.web.rest.util.HeaderUtil;
import com.shaowei.cafeapp.web.rest.util.PaginationUtil;
import com.shaowei.cafeapp.service.dto.ItemDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;


/**
 * REST controller for managing Item.
 */
@RestController
@RequestMapping("/api")
public class ItemResource {

    private final Logger log = LoggerFactory.getLogger(ItemResource.class);

    private static final String ENTITY_NAME = "item";

    private final ItemService itemService;

    public ItemResource(ItemService itemService) {
        this.itemService = itemService;
    }

    /**
     * POST  /items : Create a new item.
     *
     * @param itemDTO the itemDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new itemDTO, or with status 400 (Bad Request) if the item has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/items")
    @Timed
    public ResponseEntity<ItemDTO> createItem(@RequestBody ItemDTO itemDTO) throws URISyntaxException {
        log.debug("REST request to save Item : {}", itemDTO);
        if (itemDTO.getId() != null) {
            throw new BadRequestAlertException("A new item cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItemDTO result = itemService.save(itemDTO);
        return ResponseEntity.created(new URI("/api/items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /items : Updates an existing item.
     *
     * @param itemDTO the itemDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated itemDTO,
     * or with status 400 (Bad Request) if the itemDTO is not valid,
     * or with status 500 (Internal Server Error) if the itemDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/items")
    @Timed
    public ResponseEntity<ItemDTO> updateItem(@RequestBody ItemDTO itemDTO) throws URISyntaxException {
        log.debug("REST request to update Item : {}", itemDTO);
        if (itemDTO.getId() == null) {
            return createItem(itemDTO);
        }
        ItemDTO result = itemService.save(itemDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, itemDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /items : get all the items.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of items in body
     */
    @GetMapping("/items")
    @Timed
    public ResponseEntity<List<ItemDTO>> getAllItems(Pageable pageable) {
        log.debug("REST request to get a page of Items");
        Page<ItemDTO> page = itemService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/items");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /items/:id : get the "id" item.
     *
     * @param id the id of the itemDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the itemDTO, or with status 404 (Not Found)
     */
    @GetMapping("/items/byCategory/{id}")
    @Timed
    public ResponseEntity<List<ItemDTO>> getItemByCategoryId(@PathVariable Long id, Pageable pageable) {
        log.debug("REST request to get Item by Category: {}", id);
        Page<ItemDTO> page = itemService.findAllByCategoryId(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/items");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /items/:id : get the "id" item.
     *
     * @param id the id of the itemDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the itemDTO, or with status 404 (Not Found)
     */
    @GetMapping("/items/image-not-null")
    @Timed
    public ResponseEntity<List<ItemDTO>> getItemByImageNotNull(Pageable pageable) {
        log.debug("REST request to get Item by image not null: {}");
        Page<ItemDTO> page = itemService.findAllByImageNotNull(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/items");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


    /**
     * GET  /items/:id : get the "id" item.
     *
     * @param id the id of the itemDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the itemDTO, or with status 404 (Not Found)
     */
    @GetMapping("/items/{id}")
    @Timed
    public ResponseEntity<ItemDTO> getItem(@PathVariable Long id) {
        log.debug("REST request to get Item : {}", id);
        ItemDTO itemDTO = itemService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(itemDTO));
    }

    /**
     * DELETE  /items/:id : delete the "id" item.
     *
     * @param id the id of the itemDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/items/{id}")
    @Timed
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        log.debug("REST request to delete Item : {}", id);
        itemService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/items?query=:query : search for the item corresponding
     * to the query.
     *
     * @param query the query of the item search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/items")
    @Timed
    public ResponseEntity<List<ItemDTO>> searchItems(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Items for query {}", query);
        Page<ItemDTO> page = itemService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/items");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
