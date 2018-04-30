package com.shaowei.cafeapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shaowei.cafeapp.domain.Item;


/**
 * Spring Data JPA repository for the Item entity.
 */
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

	Page<Item> findByCategories_Id(Long id, Pageable pageable);
	Page<Item> findByImageNotNull(Pageable pageable);
}
