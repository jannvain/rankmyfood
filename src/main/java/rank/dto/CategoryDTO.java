package rank.dto;

import java.util.List;
import java.util.stream.Collectors;

//import org.apache.log4j.Category;

import rank.models.Category;

/**
 *
 * JSON-serializable DTO containing user data
 *
 */
public class CategoryDTO {

    private String name;
    private String description;

    public CategoryDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getname() {
        return name;
    }

    public void setname(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public static CategoryDTO mapFromCategoryEntity(Category category) {
        return new CategoryDTO(category.getName(), category.getDescription());
    }

    public static List<CategoryDTO> mapFromCategoryEntities(List<Category> categories) {
    	
    	return categories.stream().map((category) -> mapFromCategoryEntity(category)).collect(Collectors.toList());
    }    
    
    
    
}
