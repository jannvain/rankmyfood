package rank.services;


import rank.repositories.MealRepository;
import rank.repositories.RankRepository;
import rank.repositories.UserRepository;
import rank.repositories.CategoryRepository;
import rank.dto.MealDTO;
import rank.dto.RankDTO;
import rank.models.Category;
import rank.models.Meal;
import rank.models.Rank;
import rank.models.SearchResult;
import rank.models.User;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.stream.Collectors;

import static rank.services.ValidationUtils.assertNotBlank;
import static org.springframework.util.Assert.notNull;

/**
 *
 * Business service for Meal-related operations.
 *
 */
@Service
public class MealService {

    private static final Logger LOGGER = Logger.getLogger(MealService.class);

    @Autowired
    MealRepository mealRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RankRepository rankRepository;
    
    @Autowired
    CategoryRepository categoryRepository;
    
    /**
     *
     * searches meals by date/time
     *
     * @param username - the currently logged in user
     * @param fromDate - search from this date, including
     * @param toDate - search until this date, including
     * @param fromTime - search from this time, including
     * @param toTime - search to this time, including
     * @param pageNumber - the page number (each page has 10 entries)
     * @return - the found results
     */
    @Transactional(readOnly = true)
    public Meal findMealById(long id) {
        Meal meal = mealRepository.findMealById(id);
        return meal;
    }

    @Transactional(readOnly = true)
    public SearchResult<Rank> findMyRanks(String username, int pageNumber) {
        List<Rank> ranks = rankRepository.findRankByUserName(username);
        Long resultsCount = (long) ranks.size();
        return new SearchResult<>(resultsCount, ranks);
    }
 
    @Transactional(readOnly = true)
    public List<Object[]> findMyRanksStat(String username, int pageNumber) {
        List<Object[]> ranks = rankRepository.findRankByUserNameStat(username);
    /*   
        List<Object[]> resultsMap = new ArrayList<Object[]>();
        for (Object[] o : ranks) {
      	  o[0] = (Long) ((Timestamp)o[0]).getTime() + (((Timestamp)o[0]).getNanos() / 1000000);//StampConvert((Timestamp)o[0]);
      	  o[1] = (Double)o[1];
      	  
          resultsMap.add(o);
        }
      */  
        return ranks;
    }
    
    @Transactional(readOnly = true)
    public SearchResult<Meal> findMyMeals(String username, int pageNumber) {
        List<Meal> meals = mealRepository.findMealByUserName(username);
        Long resultsCount = (long) meals.size();
        return new SearchResult<>(resultsCount, meals);
    }
    
    
    @Transactional(readOnly = true)
    public List<Category> findCategories() {

        List<Category> categories = categoryRepository.findCategories();
        return categories;
    }
    
    @Transactional(readOnly = true)
    public SearchResult<Meal> findGroupMeals(String groupname, int pageNumber) {

        List<Meal> meals = mealRepository.findMealByGroupName(groupname);
        Long resultsCount = (long) meals.size();
        return new SearchResult<>(resultsCount, meals);
    }

    
    @Transactional(readOnly = true)
    public SearchResult<Rank> findGroupRanks(String groupname, int pageNumber) {

        List<Rank> ranks = rankRepository.findRankByGroupName(groupname);
        Long resultsCount = (long) ranks.size();
        return new SearchResult<>(resultsCount, ranks);
    }
    @Transactional(readOnly = true)
    public List<Object[]> findGroupRanksStat(String groupname, String username, int pageNumber) {
        List<Object[]> ranks = rankRepository.findRankByGroupNameStat(groupname, username);
      
        /*
        List<Object[]> resultsMap = new ArrayList<Object[]>();
          for (Object[] o : ranks) {
        	  o[0] = (Long) ((Timestamp)o[0]).getTime() + (((Timestamp)o[0]).getNanos() / 1000000);//StampConvert((Timestamp)o[0]);
        	  o[1] = (Double)o[1];
        	  
            resultsMap.add(o);
          }
          */
        //Map<Date, Float> map1 = new HashMap<Date,Float>();
        
        return ranks;
    }    
    
    /**
     *
     * deletes a list of meals, given their Ids
     *
     * @param deletedMealIds - the list of meals to delete
     */
    @Transactional
    public void deleteMeals(List<Long> deletedMealIds) {
        notNull(deletedMealIds, "deletedMealsId is mandatory");
        deletedMealIds.stream().forEach((deletedMealId) -> mealRepository.delete(deletedMealId));
    }

    /**
     *
     * saves a meal (new or not) into the database.
     *
     * @param username - - the currently logged in user
     * @param id - the database ud of the meal
     * @param date - the date the meal took place
     * @param time - the time the meal took place
     * @param description - the description of the meal
     * @return - the new version of the meal
     */

    @Transactional
    public void saveRank(String username, RankDTO rankdto){
        Meal meal = null;
        meal = mealRepository.findMealById(rankdto.getmealId());
        User user = userRepository.findUserByUsername(username);

        rankRepository.save(new Rank(user.getId(), meal, rankdto.getVoteValue(), rankdto.getDescription()));
    }
    
    
    @Transactional
    public Meal saveMeal(String username, Long id, Date date, Time time, String description, String categoryName, String imageName) {

        assertNotBlank(username, "username cannot be blank");
        notNull(date, "date is mandatory");
        notNull(time, "time is mandatory");
        notNull(description, "description is mandatory");
//        notNull(category, "Category is mandatory");

        Meal meal = null;
        Category category = categoryRepository.findCategoryByName(categoryName);
        
        if (id != null) {
            meal = mealRepository.findMealById(id);
            
            meal.setDate(date);
            meal.setTime(time);
            meal.setDescription(description);
            meal.setCategory(category);
            meal.setImageName(imageName);
            
        } else {
            User user = userRepository.findUserByUsername(username);

            if (user != null) {
               meal =  new Meal(user, date, time, description, category, imageName);
                meal = mealRepository.save(meal);
                LOGGER.warn("A meal was attempted to be saved for a non-existing user: " + username);
            }
        }
        
        return meal;
    }

    /**
     *
     * saves a list of meals (new or not) into the database
     *
     * @param username - the currently logged in user
     * @param meals - the list of meals to be saved
     * @return - the new versions of the saved meals
     */
    @Transactional
    public List<Meal> saveMeals(String username, List<MealDTO> meals) {
        return meals.stream()
                .map((meal) -> saveMeal(
                        username,
                        meal.getId(),
                        meal.getDate(),
                        meal.getTime(),
                        meal.getDescription(),
                        meal.getCategoryName(),
                        meal.getImageName()))
                .collect(Collectors.toList());
    }
	 public String StampConvert(Timestamp stamp){
		    long milliseconds = stamp.getTime() + (stamp.getNanos() / 1000000);
		    
		 	Date date = new Date (milliseconds);
	    	//Date date = new Date(stamp); // *1000 is to convert seconds to milliseconds
	    	SimpleDateFormat sdf = new SimpleDateFormat("YYYY/MM/dd"); // the format of your date
	    	sdf.setTimeZone(TimeZone.getTimeZone("GMT+3")); // give a timezone reference for formating (see comment at the bottom
	    	String formattedDate = sdf.format(date);
	    	return(formattedDate);
	    }

}

