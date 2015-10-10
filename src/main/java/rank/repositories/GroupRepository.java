package rank.repositories;


import rank.models.Group;
import rank.models.User;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 *
 * Repository class for the Meal entity
 *
 */
@Repository
public class GroupRepository {

    private static final Logger LOGGER = Logger.getLogger(GroupRepository.class);

    @PersistenceContext
    EntityManager em;

    
    /**
     * finds a group given its name
     *
     * @param groupname - the groupname of the searched group
     * @return  a matching group, or null if no group found.
     */
    
    public Group findGroupByGroupname(String groupname) {

        List<Group> groups = em.createNamedQuery(Group.FIND_BY_NAME, Group.class)
                .setParameter("groupname", groupname)
                .getResultList();

        return groups.size() == 1 ? groups.get(0) : null;
    }
    

    public void delete(Long deletedGroupId) {
        Group delete = em.find(Group.class, deletedGroupId);
        em.remove(delete);
    }

    public Group findGroupById(Long id) {
        return em.find(Group.class, id);
    }    
    
    public Group save(Group group) {
        return em.merge(group);
    }

}
