package com.shaowei.cafeapp.service.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

//import com.shaowei.cafeapp.domain.*;
//import com.shaowei.cafeapp.service.dto.ItemDTO;
//
//import org.mapstruct.*;
//
///**
// * Mapper for the entity Item and its DTO ItemDTO.
// */
//@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
//public interface ItemMapper extends EntityMapper<ItemDTO, Item> {
//
//
//    @Mapping(source = "categoryDTOs", target = "categories")
//    Item toEntity(ItemDTO itemDTO);
//    
//    @Mapping(source = "categories", target = "categoryDTOs")
//    ItemDTO toDto(Item item); 
//
//    default Item fromId(Long id) {
//        if (id == null) {
//            return null;
//        }
//        Item item = new Item();
//        item.setId(id);
//        return item;
//    }
//}

import com.shaowei.cafeapp.domain.Category;
import com.shaowei.cafeapp.domain.Item;
import com.shaowei.cafeapp.repository.CategoryRepository;
import com.shaowei.cafeapp.service.dto.ItemDTO;

@Service
public class ItemMapper {

	private final CategoryRepository categoryRepository;

    public ItemMapper(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Item> toEntity(List<ItemDTO> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<Item> list = new ArrayList<Item>( dtoList.size() );
        for ( ItemDTO itemDTO : dtoList ) {
            list.add( toEntity( itemDTO ) );
        }

        return list;
    }

    public List<ItemDTO> toDto(List<Item> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<ItemDTO> list = new ArrayList<ItemDTO>( entityList.size() );
        for ( Item item : entityList ) {
            list.add( toDto( item ) );
        }

        return list;
    }

    public Item toEntity(ItemDTO itemDTO) {
        if ( itemDTO == null ) {
            return null;
        }

        Item item = new Item();

        item.setCategories( categoriesStringSetToCategoriesSet( itemDTO.getCategories() ) );
        item.setId( itemDTO.getId() );
        item.setUrl( itemDTO.getUrl() );
        item.setDescription( itemDTO.getDescription() );
        item.setName( itemDTO.getName() );
        item.setImage( itemDTO.getImage() );
        item.setTags( itemDTO.getTags() );
        item.setDate( itemDTO.getDate() );

        return item;
    }

    public ItemDTO toDto(Item item) {
        if ( item == null ) {
            return null;
        }

        ItemDTO itemDTO = new ItemDTO();

        itemDTO.setCategories( categorySetToCategoryStringSet( item.getCategories() ) );
        itemDTO.setId( item.getId() );
        itemDTO.setUrl( item.getUrl() );
        itemDTO.setDescription( item.getDescription() );
        itemDTO.setName( item.getName() );
        itemDTO.setImage( item.getImage() );
        itemDTO.setTags( item.getTags() );
        itemDTO.setDate( item.getDate() );

        return itemDTO;
    }

    protected Set<Category> categoriesStringSetToCategoriesSet(Set<String> strings) {
        if ( strings == null ) {
            return null;
        }
        
        return strings.stream().map(string -> {
        	return categoryRepository.findOne(Long.parseLong(string.split("/")[0], 10));
//            Category category = new Category();
//            category.setId(Long.parseLong(string.split("/")[0], 10));
//            return category;
        }).collect(Collectors.toSet());
    }

    protected Set<String> categorySetToCategoryStringSet(Set<Category> set) {
        if ( set == null ) {
            return null;
        }
        
        return set.stream().map(category -> {
            return category.getId()+"/"+category.getName();
        }).collect(Collectors.toSet());
    }
}
