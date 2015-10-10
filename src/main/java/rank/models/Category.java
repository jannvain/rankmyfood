package rank.models;
import javax.persistence.Entity;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

/**
 *
 * The Category JPA entity
 *
 */
@Entity
//@Table(name = "CATEGORY")
@NamedQueries({
    @NamedQuery(
            name = Category.FIND_BY_NAME,
            query = "select c from Category c where name = :name"            
    ),
    @NamedQuery(
            name = Category.FIND_CATEGORIES,
            query = "select c from Category c"            
    )

})
public class Category extends AbstractEntity {

    private String name;
    private String description;

    public static final String FIND_BY_NAME = "category.findByName";
    public static final String FIND_CATEGORIES = "category.findCategories";

    public Category() {

    }

    public Category(long ownerId, String name, String description) {
        setOwnerId(ownerId);
        this.name = name;
        this.description = description;
    }



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    

}
