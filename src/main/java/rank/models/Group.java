package rank.models;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import java.sql.Time;
import java.util.Date;

/**
 *
 * The Group JPA entity
 *
 */

@NamedQueries({
@NamedQuery(
        name = Group.FIND_BY_NAME,
        query = "select g from Group g where name = :groupname"
)
})

@Entity
@Table(name = "GROUPS")
public class Group extends AbstractEntity {

	public static final String FIND_BY_NAME = "group.findByName";	
    private String name;
    private String description;

    public Group() {

    }

    public Group(long ownerId, String name, String description) {
    	setOwnerId(ownerId);
        this.name = name;
        this.description = description;
    }
    public Group(String name, String description) {
        setOwnerId(0L);
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
