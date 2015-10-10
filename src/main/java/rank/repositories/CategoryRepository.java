package rank.repositories;


import rank.models.Category;
import rank.models.Meal;
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
public class CategoryRepository {

    private static final Logger LOGGER = Logger.getLogger(CategoryRepository.class);

    @PersistenceContext
    EntityManager em;

    public void delete(Long deletedCategoryId) {
        Category delete = em.find(Category.class, deletedCategoryId);
        em.remove(delete);
    }

    public Category findCategoryById(Long id) {
        return em.find(Category.class, id);
    }

    
    public List<Category> findCategories() {
    	List<Category> categories =  em.createNamedQuery(Category.FIND_CATEGORIES, Category.class).getResultList();
    	
    	return categories;
    }
    
    public Category findCategoryByName(String name) {

        List<Category> categories = em.createNamedQuery(Category.FIND_BY_NAME, Category.class)
                .setParameter("name", name)
                .getResultList();

        return categories.size() == 1 ? categories.get(0) : null;
    }
    
    public Category save(Category category) {
        return em.merge(category);
    }
}
