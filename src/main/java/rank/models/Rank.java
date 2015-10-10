package rank.models;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.JoinColumn;
import javax.persistence.FetchType;
import javax.persistence.CascadeType;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.sql.Time;
import java.util.Date;

/**
 *
 * The Rank JPA entity
 *
 */
@NamedQueries({
@NamedQuery(
        name = Rank.FIND_BY_USER,
        query = "select r from Rank r where r.meal.user.username = :username order by r.meal.date desc, r.meal.time desc"
),
@NamedQuery(
        name = Rank.FIND_BY_UGROUP,
        query = "select r from Rank r  where r.meal.user.ugroup.name = :groupname order by r.meal.date desc, r.meal.time desc"
),
@NamedQuery(
        name = Rank.FIND_BY_USER_STAT,
        query = "select r.meal.date, round(avg(r.value),2)  from Rank r where r.meal.user.username = :username group by r.meal.date order by r.meal.date asc"
),
@NamedQuery(
        name = Rank.FIND_BY_UGROUP_STAT,
        query = "select r.meal.date, round(avg(r.value),2)  from Rank r  where r.meal.user.ugroup.name = :groupname and r.meal.user.username != :username group by r.meal.date order by r.meal.date asc"
)
})

@Entity
//@Table(name = "RANK")
public class Rank extends AbstractEntity {

	   public static final String FIND_BY_USER = "ranks.findByUser";
	   public static final String FIND_BY_UGROUP = "ranks.findByUgroup";
	   public static final String FIND_BY_USER_STAT = "ranks.findByUserStat";
	   public static final String FIND_BY_UGROUP_STAT = "ranks.findByUgroupStat";	   
	    
	  //@ManyToOne(fetch=FetchType.LAZY)
	 // @JoinColumn(name="OWNER_ID")
	  
    @ManyToOne(cascade=CascadeType.ALL, optional=true, fetch=FetchType.EAGER) 
    @JsonBackReference
 	Meal meal;
//  @JoinColumn(name="id")  
	
    private float value;
    private String description;

    public Rank() {

    }

    public Rank(long ownerId, float value, String description) {
        setOwnerId(ownerId);
        this.meal = null;
        this.value = value;
        this.description = description;
    }


    public Rank(long ownerId, Meal meal, float value, String description) {
        setOwnerId(ownerId);
        this.meal = meal;
        this.value = value;
        this.description = description;
    }

    public float getValue() {
        return value;
    }

    public void setValue(float value) {
        this.value = value;
    }

    public Meal getMeal() {
        return meal;
    }

    public void setMeal(Meal meal) {
        this.meal = meal;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
