package rank.repositories;


import rank.models.User;

import org.springframework.stereotype.Repository;
	
import org.hibernate.loader.entity.*;

import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Persistence;

import java.util.List;

/**
 *
 * Repository class for the User entity
 *
 */
@Repository
public class UserRepository {

  //  private EntityManagerFactory emF = Persistence.createEntityManagerFactory("entityManagerFactory");
	@PersistenceContext
	private EntityManager em; //= emF.createEntityManager();

    /**
     * finds a user given its username
     *
     * @param username - the username of the searched user
     * @return  a matching user, or null if no user found.
     */
    public User findUserByUsername(String username) {

        List<User> users = em.createNamedQuery(User.FIND_BY_USERNAME, User.class)
                .setParameter("username", username)
                .getResultList();

        return users.size() == 1 ? users.get(0) : null;
    }

    public List<User> findUsersByGroupname(String groupname) {

        List<User> users = em.createNamedQuery(User.FIND_BY_UGROUPNAME, User.class)
                .setParameter("groupname", groupname)
                .getResultList();
        return users;
    }


    /**
     *
     * save changes made to a user, or insert it if its new
     *
     * @param user
     */
    public void save(User user) {
        em.merge(user);
    }

    /**
     * checks if a username is still available in the database
     *
     * @param username - the username to be checked for availability
     * @return true if the username is still available
     */
    public boolean isUsernameAvailable(String username) {

        List<User> users = em.createNamedQuery(User.FIND_BY_USERNAME, User.class)
                .setParameter("username", username)
                .getResultList();

        return users.isEmpty();
    }
}
