package rank.repositories;

import rank.models.Meal;
import rank.models.Rank;
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
import java.util.Map;

/**
 *
 * Repository class for the Meal entity
 *
 */
@Repository
public class RankRepository {

    private static final Logger LOGGER = Logger.getLogger(RankRepository.class);

    @PersistenceContext
    EntityManager em;
    public void delete(Long deletedRankId) {
        Rank delete = em.find(Rank.class, deletedRankId);
        em.remove(delete);
    }

    public Rank findRankById(Long id) {
        return em.find(Rank.class, id);
    }    
    
    public List<Rank> findRankByUserName(String username) {
        List<Rank> ranks = em.createNamedQuery(Rank.FIND_BY_USER, Rank.class)
                .setParameter("username", username)
                .getResultList();

        return ranks;
    }
    public List<Rank> findRankByGroupName(String groupname) {
        List<Rank> ranks = em.createNamedQuery(Rank.FIND_BY_UGROUP, Rank.class)
                .setParameter("groupname", groupname)
                .getResultList();

        return ranks;
    }

    public List<Object[]> findRankByUserNameStat(String username) {
        List<Object[]> ranks = em.createNamedQuery(Rank.FIND_BY_USER_STAT, Object[].class)
                .setParameter("username", username)
                .getResultList();

        return ranks;
    }
    public List<Object[]> findRankByGroupNameStat(String groupname, String username) {
        List<Object[]> ranks = em.createNamedQuery(Rank.FIND_BY_UGROUP_STAT, Object[].class)
                .setParameter("groupname", groupname)
                .setParameter("username", username)

                .getResultList();

        return ranks;
    }    
    
    public Rank save(Rank rank) {
        return em.merge(rank);
    }
}
