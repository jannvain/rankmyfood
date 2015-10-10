package rank.models;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.FetchType;
import javax.persistence.Table;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Column;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.sql.Time;
import java.util.Date;
import java.util.ArrayList;
import java.util.Collection;

/**
 *
 * The Meal JPA entity
 *
 */
@NamedQueries({
@NamedQuery(
        name = Meal.FIND_BY_USER,
        query = "select m from Meal m where m.user.username = :username order by m.date desc, m.time desc"
),
@NamedQuery(
        name = Meal.FIND_BY_UGROUP,
        query = "select m from Meal m  where m.user.ugroup.name = :groupname order by m.date desc, m.time desc"
)
})
 
@Entity
//@Table(name = "MEALS")
public class Meal extends AbstractEntity {

    public static final String FIND_BY_USER = "meals.findByUser";
    public static final String FIND_BY_UGROUP = "meals.findByUgroup";

    @ManyToOne
    private User user;

	@ManyToOne
    private Category category;

	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date mealTime;
	
    private Date date;
    private Time time;

    private String description;
    private String imageName;

    @JsonManagedReference
    @OneToMany(fetch=FetchType.EAGER, mappedBy="meal")
    private Collection<Rank> rank = new ArrayList<Rank>();

    public Meal() {
 //       this.rank = new ArrayList<Rank>();
    }

    public Meal(User user, Date date, Time time, String description, Category category, String imageName ) {
        setOwnerId(user.getOwnerId());
        this.user = user;
        this.date = date;
        this.time = time;
        
        this.description = description;
        this.category = category;
        this.imageName = imageName;
//        this.rank = new ArrayList<Rank>();        
    }


    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    
    public String getImageName() {
        return imageName;
    }
    public String getUserName() {
        return user.getUsername();
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }
    
    public void setRank(ArrayList<Rank> rank) {
    	this.rank = rank;
    }
      
    public Collection<Rank> getRank() {
    	return rank;
    }	
  
    public void addRank(Rank newrank) {
    	if (!rank.contains(newrank)) {
    		rank.add(newrank);
    	}
    }
    	
}
