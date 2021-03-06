package com.shaowei.cafeapp.service.impl;

import com.shaowei.cafeapp.domain.Item;
import com.shaowei.cafeapp.repository.ItemRepository;
import com.shaowei.cafeapp.service.CategoryService;
import com.shaowei.cafeapp.service.ItemService;
import com.shaowei.cafeapp.service.dto.ItemDTO;
import com.shaowei.cafeapp.service.mapper.ItemMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing Item.
 */
@Service
@Transactional
public class ItemServiceImpl implements ItemService {

    private final Logger log = LoggerFactory.getLogger(ItemServiceImpl.class);

    private final ItemRepository itemRepository;

    private final ItemMapper itemMapper;

    public ItemServiceImpl(ItemRepository itemRepository, ItemMapper itemMapper, CategoryService categoryService) {
        this.itemRepository = itemRepository;
        this.itemMapper = itemMapper;
    }

    /**
     * Save a item.
     *
     * @param itemDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public ItemDTO save(ItemDTO itemDTO) {
        log.debug("Request to save Item : {}", itemDTO);
        Item item = itemMapper.toEntity(itemDTO);
        item = itemRepository.save(item);
        ItemDTO result = itemMapper.toDto(item);
//        itemSearchRepository.save(item);
        return result;
    }

    /**
     * Get all the items.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ItemDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Items");
        return itemRepository.findAll(pageable)
            .map(itemMapper::toDto);
    }

    /**
     * Get all the items by category id.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
	@Override
	@Transactional(readOnly = true)
	public Page<ItemDTO> findAllByCategoryId(Long id, Pageable pageable) {
        log.debug("Request to get all Items by category");
        return itemRepository.findByCategories_Id(id, pageable)
            .map(itemMapper::toDto);
	}

    /**
     * Get a page of the items where image url is not null.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
	@Override
	@Transactional(readOnly = true)
	public Page<ItemDTO> findAllByImageNotNull(Pageable pageable) {
        log.debug("Request to get all Items by category");
        return itemRepository.findByImageNotNull(pageable)
            .map(itemMapper::toDto);
	}

    /**
     * Get one item by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public ItemDTO findOne(Long id) {
        log.debug("Request to get Item : {}", id);
        Item item = itemRepository.findOne(id);
        return itemMapper.toDto(item);
    }

    /**
     * Delete the item by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Item : {}", id);
        itemRepository.delete(id);
//        itemSearchRepository.delete(id);
    }

    /**
     * Search for the item corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ItemDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Items for query {}", query);
        Page<Item> result = null;
        return result.map(itemMapper::toDto);
    }

}
