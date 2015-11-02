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
import java.util.Iterator;
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
	System.out.println("DELETE " + deletedMealIds.get(0));
        deletedMealIds.stream().forEach((deletedMealId) -> mealRepository.myDelete(deletedMealId));
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
    public Meal saveRank(String username, RankDTO rankdto){
        Meal meal = null;
        meal = mealRepository.findMealById(rankdto.getmealId());
        User user = userRepository.findUserByUsername(username);

        rankRepository.save(new Rank(user.getId(), meal, rankdto.getVoteValue(), rankdto.getDescription()));
	mealRepository.flush();
        meal = mealRepository.findMealById(rankdto.getmealId());

	return meal ;
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



    @Transactional(readOnly = true)
    public List<Object[]> findMyGapStat2(String username, int pageNumber) {
        List<Object[]> gaps = new ArrayList<Object[]>();
        List<Meal> meals = mealRepository.findMealByUserName(username);
        // System.out.println(String.format("My gaps: %d ", meals.size()));
	if(meals.size()<2)
	    return gaps;
	Object[] tmp = new Object[2];	
	tmp[0] = meals.get(0).getDate();
	tmp[1] = 0L;
	long div = 0L;
	for(int i=1;i<meals.size();i++){
	    // System.out.println(meals.get(i).getDate());
	    // System.out.println(meals.get(i).getTime());
	    // System.out.println(meals.get(i-1).getTime());
	    if(meals.get(i).getDate().compareTo(meals.get(i-1).getDate()) == 0){
		tmp[1] = (long) tmp[1] + (long)((meals.get(i-1).getTime().getTime() -
						 meals.get(i).getTime().getTime())/60000L);
		div += 1L;
	    }
	    else{
		if((long)tmp[1]>0L){
		    tmp[1] = (long)tmp[1] / div;
		    gaps.add(tmp);
		}
		tmp = new Object[2];	
		tmp[0] = meals.get(i).getDate();
		tmp[1] = 0L;		
	    }


	}
	if((long)tmp[1]>0L){
	    tmp[1] = (long)tmp[1] / div;
		gaps.add(tmp);
	}
	return gaps;
    }

    @Transactional(readOnly = true)
    public List<Object[]> findMyGapStat(String username, int pageNumber) {
        List<Meal> meals = mealRepository.findMealByUserName2(username);
	return getMealGaps(meals, "");
    }    

    private List<Object[]> getMealGaps(List<Meal> meals, String username){
        List<Object[]> gaps = new ArrayList<Object[]>();
	if(meals.size()<2)
	    return gaps;
	Iterator<Meal> mealList = meals.iterator();
	
	Meal prevMeal = mealList.next();
	Meal currMeal;


	Meal meal;
	long div = 0L;
	Object[] tmp = new Object[2];	
	tmp[0] = prevMeal.getDate();
	tmp[1] = 0L;
	

	while(mealList.hasNext()){
	    currMeal = mealList.next();
	    div = 0L;
	    tmp = new Object[2];	
	    tmp[0] = prevMeal.getDate();
	    tmp[1] = 0L;
	    while((currMeal != null)  && (currMeal.getDate().compareTo(prevMeal.getDate()) == 0)){

		if ((currMeal.getUserName().compareTo(prevMeal.getUserName()) == 0) &&
		    ((currMeal.getUserName().compareTo(username) != 0) &&
		     (prevMeal.getUserName().compareTo(username) != 0))){
		    
		    tmp[1] = (long) tmp[1] + 
			(long)((prevMeal.getTime().getTime() -
				currMeal.getTime().getTime())/60000L);		    
		    div++;
		    // System.out.println((long)tmp[1]);
		}
		
		prevMeal = currMeal;
		currMeal = mealList.hasNext() ? mealList.next() : null;
	    }
	    if((long)tmp[1]>0){
		tmp[1] = (long)tmp[1] / div;
		gaps.add(tmp);
	    }
	    prevMeal = currMeal;
	}


	
	return gaps;
    }

    @Transactional(readOnly = true)
    public List<Object[]> findGroupGapStat(String groupname, String username, int pageNumber) {
        List<Meal> meals = mealRepository.findMealByGroupName2(groupname);
	return getMealGaps(meals, username);
    }    

}
