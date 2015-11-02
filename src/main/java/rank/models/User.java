package rank.models;


import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Column;


/**
 *
 * The User JPA entity.
 *
 */
@Entity
//@Table(name = "RUSERS")
@NamedQueries({
        @NamedQuery(
                name = User.FIND_BY_USERNAME,
                query = "select u from User u where username = :username"
        ),
        @NamedQuery(
                name = User.FIND_BY_UGROUPNAME,
                query = "select u from User u where ugroup.name = :groupname"
        )

})
public class User extends AbstractEntity {

    public static final String FIND_BY_USERNAME = "user.findByUserName";
    public static final String FIND_BY_UGROUPNAME = "user.findByUgroupName";

//	@ManyToOne
	@ManyToOne(cascade=CascadeType.ALL, optional=true, fetch=FetchType.EAGER) 
	private Group ugroup;
	
    private String username;
    private String nickname;
    private String passwordDigest;
    private String email;
    private String role;
    private int gender;


    public User() {

    }

    public User(String username, String passwordDigest, String email, long ownerId, Group group, String role, int gender) {
        this.username = username;
        this.nickname = username;
        this.passwordDigest = passwordDigest;
        this.email = email;
        setOwnerId(ownerId);
        this.ugroup = group;
        this.role = role;
	this.gender = gender;
    }
    public User(String username, String passwordDigest, String email, Group group, String role, int gender) {
        this.username = username;
        this.nickname = username;
        this.passwordDigest = passwordDigest;
        this.email = email;
        setOwnerId(0L);
        this.ugroup = group;
        this.role = role;
	this.gender = gender;
    }
    public User(String username, String passwordDigest, String email, String role, int gender) {
        this.username = username;
        this.nickname = username;
  
        this.passwordDigest = passwordDigest;
        this.email = email;
        setOwnerId(0L);
        this.ugroup = null;
        this.role = role;
	this.gender = gender;
    }

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setNIckname(String nickname) {
        this.nickname = nickname;
    }
    public String getNickname() {
        return nickname;
    }



    public String getPasswordDigest() {
        return passwordDigest;
    }

    public void setPasswordDigest(String passwordDigest) {
        this.passwordDigest = passwordDigest;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public Group getGroup() {
        return ugroup;
    }

    public void setGroup(Group group) {
        this.ugroup = group;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", group='" + ugroup + '\'' + 
                '}';
    }
}
