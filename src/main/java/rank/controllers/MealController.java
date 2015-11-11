package rank.controllers;

import rank.services.MealService;
import rank.services.UserService;
import rank.dto.DebugDTO;
import rank.dto.MealDTO;
import rank.dto.MealsDTO;
import rank.dto.RankDTO;
import rank.dto.RankStatDTO;
import rank.dto.RanksDTO;
import rank.dto.UserInfoDTO;
import rank.dto.CategoryDTO;
import rank.models.Category;
import rank.models.Meal;
import rank.models.Rank;
import rank.models.SearchResult;
import rank.models.User;
import rank.controllers.UploadedFile;

import java.security.Principal;
import java.sql.Time;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.awt.image.BufferedImage;
import java.io.*;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import static org.imgscalr.Scalr.*;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
//import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.*;

import com.fasterxml.jackson.databind.ObjectMapper;

	

/**
 *
 *  REST service for meals - allows to update, create and search for meals for the currently logged in user.
 *
 */
@Controller
public class MealController {

    Logger LOGGER = Logger.getLogger(MealController.class);

    private static final long DAY_IN_MS = 1000 * 60 * 60 * 24;


    @Autowired
    private MealService mealService;
    
    @Autowired
    private UserService userService;
    
    @RequestMapping(value = "/api/meal/{mealid}", method = RequestMethod.GET)    
    public  @ResponseBody MealDTO getMealById( Principal principal, @PathVariable("mealid") long mealId )   {        
        //
        // Code processing the input parameters
        //    
    	Meal meal = mealService.findMealById(mealId);
    	User user = userService.findUserByUsername(principal.getName());

        MealDTO response = new MealDTO(mealId, meal.getDate(), meal.getTime(), 
        		meal.getDescription(), meal.getCategory().getName(), 
        		meal.getImageName(), 
				       meal.getUserName(), meal.getUser().getNickname(), meal.getUser().getId(), meal.getRank(), user.getId(), meal.getUser().getGender());


        return response;
    }    

    
    
    

    
    /**
     * search Meals for the current user by date and time ranges.
     *
     *
     * @param principal  - the current logged in user
     * @param fromDate - search from this date, including
     * @param toDate - search until this date, including
     * @param fromTime - search from this time, including
     * @param toTime - search to this time, including
     * @param pageNumber - the page number (each page has 10 entries)
     * @return - @see MealsDTO with the current page, total pages and the list of meals
     */

    @RequestMapping(value="/api/meal", method = RequestMethod.GET, params={"groupname", "pageNumber"})   
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public MealsDTO searchMealsByDate(
            Principal principal,
            @RequestParam(value = "groupname", required = false) String groupName,            
            @RequestParam(value = "pageNumber") Integer pageNumber
    		) 
    
    {
		SearchResult<Meal> result;
		
    	User user = userService.findUserByUsername(principal.getName());
    	result = mealService.findGroupMeals(groupName, pageNumber);
   		
        Long resultsCount = result.getResultsCount();
        Long totalPages = resultsCount / 10;

        if (resultsCount % 10 > 0) {
            totalPages++;
        }
        return new MealsDTO(pageNumber, totalPages, MealDTO.mapFromMealsEntities(result.getResult(), user.getId()));
    }
    
    @RequestMapping(value="/api/meal", method = RequestMethod.GET, params={"username", "pageNumber"})   
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public MealsDTO searchMyMeals(
            Principal principal,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "username", required = false) String userName
    		) 
    
    {
   	
		SearchResult<Meal> result;
		
    	User user = userService.findUserByUsername(principal.getName());
  	
    	result = mealService.findMyMeals(userName, pageNumber);
 
        Long resultsCount = result.getResultsCount();
        Long totalPages = resultsCount / 10;

        if (resultsCount % 10 > 0) {
            totalPages++;
        }

        return new MealsDTO(pageNumber, totalPages, MealDTO.mapFromMealsEntities(result.getResult(), user.getId()));
    }
    

    @RequestMapping(value="/api/ranks", method = RequestMethod.GET, params={"username", "pageNumber"})   
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<Object[]> searchMyRanks(
            Principal principal,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "username", required = false) String userName
    		) 
    
    {
		List<Object[]> result;

    	User user = userService.findUserByUsername(principal.getName());
  	
    	result = mealService.findMyRanksStat(userName, pageNumber);
 
        return result;
    }

    @RequestMapping(value="/api/rankstat", method = RequestMethod.GET, params={"username", "pageNumber"})   
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<Object[]>  searchMyRankStat(
            Principal principal,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "username", required = false) String userName
    		) 
    
    {
    	List<Object[]> result;

    	User user = userService.findUserByUsername(principal.getName());
  	
    	result = mealService.findMyRanksStat(userName, pageNumber);
 
        return result;
    }
    @RequestMapping(value="/api/ranks", method = RequestMethod.GET, params={"groupname", "pageNumber"})   
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public RanksDTO searchMyGroupRanks(
            Principal principal,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "groupname", required = false) String groupName
    		) 
    
    {
		SearchResult<Rank> result;

    	User user = userService.findUserByUsername(principal.getName());
  	
    	result = mealService.findGroupRanks(groupName, pageNumber);
 
        Long resultsCount = result.getResultsCount();
        Long totalPages = resultsCount / 10;

        if (resultsCount % 10 > 0) {
            totalPages++;
        }
        return new RanksDTO(pageNumber, totalPages, RankDTO.mapFromRanksEntities(result.getResult(), user.getId()));
    }
    @RequestMapping(value="/api/rankstat", method = RequestMethod.GET, params={"groupname", "pageNumber"})   
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<Object[]> searchMyGroupRanksStat(
            Principal principal,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "groupname", required = false) String groupName
    		) 
    
    {
    	List<Object[]> result;

    	User user = userService.findUserByUsername(principal.getName());
  	
    	result = mealService.findGroupRanksStat(groupName, principal.getName(), pageNumber);

        return result;
    }   
    
   /**
     *
     * saves a list of meals - they be either new or existing
     *
     * @param principal - the current logged in user
     * @param meals - the list of meals to save
     * @return - an updated version of the saved meals
     * @throws ParseException 
     */
    
    
    
    @RequestMapping(value = "/api/uploadmeal", method=RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public DebugDTO upload(Principal principal, @RequestParam("file") MultipartFile file, HttpServletRequest request) throws IOException, ParseException {

        byte[] bytes;

        if (!file.isEmpty()) {
             bytes = file.getBytes();
            //store file in storage
        }	
        
        
        ObjectMapper mapper = new ObjectMapper();
        String json = request.getParameter("data");
        //my json variable have the ids that i need, but i dont know how to get them .
 
         Map<String, String> ids;
        ids = mapper.readValue(json, HashMap.class);
        
        Date dt = new Date();

        DateFormat fileFormat = new SimpleDateFormat("HHmmddMMyyyy" /*"yyyy/MM/dd"*/, Locale.ENGLISH);
        String fdate = "ec" + dt.getDate() + dt.getMonth() + dt.getMinutes() + dt.getSeconds();

	String fileName = fdate  + file.getOriginalFilename();
        DebugDTO cto = new DebugDTO(ids.get("username"), "hai", file.getSize());
        System.out.println(String.format("############### receive %s ", fileName));
        
	//        String filePath = "/Users/vainio6/rankme/pic/lg/" + file.getOriginalFilename(); //Please note that I am going to remove hardcoded path to get it from resource/property file
	//  String filePath2 = "/Users/vainio6/rankme/pic/xs/" + file.getOriginalFilename(); //Please note that I am going to remove hardcodded path to get it from resource/property file
	
        String filePath = "/mnt/mydata/mealimages/lg/" + fileName; //Please note that I am going to remove hardcoded path to get it from resource/property file
        String filePath2 = "/mnt/mydata/mealimages/xs/" + fileName; //Please note that I am going to remove hardcodded path to get it from resource/property file


        File dest = new File(filePath);
        file.transferTo(dest);
        BufferedImage image = ImageIO.read( dest ); 
        image = resize(image, Method.ULTRA_QUALITY /* was SPEED */, 160, OP_ANTIALIAS, OP_BRIGHTER);
        
        File dest2 = new File(filePath2);
        
        ImageIO.write(image, "jpg", dest2);
        
        
        String dateStr = ids.get("date");
        String timeStr = ids.get("time");

        System.out.println(String.format("############### DATES %s %s", dateStr, timeStr));
        
        DateFormat format = new SimpleDateFormat("dd.MM.yyyy" /*"yyyy/MM/dd"*/, Locale.ENGLISH);
        Date date = format.parse(dateStr);
        date.setHours(12);
        date.setMinutes(0);
        date.setSeconds(0);

        DateFormat formatTime = new SimpleDateFormat("HH:mm", Locale.ENGLISH);
        Date dateForTime =  formatTime.parse(timeStr);
        Time time = new Time(dateForTime.getTime()); 

        
        
        System.out.println(date); // Sat Jan 02 00:00:00 GMT 2010
        
        // DateTimeFormatter formatterd = DateTimeFormatter.ofPattern("yyyy/MM/d", Locale.ENGLISH);
        //Date date = Date.parse(dateStr, formatterd);
        // DateTimeFormatter formattert = DateTimeFormatter.ofPattern("HH:mm", Locale.ENGLISH);
        //Time time = Time.parse(timeStr, formattert);        
        
        Meal savedMeal = mealService.saveMeal(principal.getName(), null, date, time, ids.get("description"),
        		ids.get("categoryName"), fileName);
        
        return cto;
    }
    
    
    /* saveMeal(String username, Long id, Date date, Time time, String description, Category category, String imageName) {*/
    @RequestMapping(value="/api/newmeal", method=RequestMethod.POST)       
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public MealDTO saveMeal(Principal principal, @RequestBody MealDTO meal) {

        Meal savedMeal = mealService.saveMeal(principal.getName(), null, meal.getDate(), meal.getTime(), meal.getDescription(),
        		meal.getCategoryName(), meal.getImageName());
        // return MealDTO.mapFromMealEntity(savedMeal);
//        return meal;
        
    	User user = userService.findUserByUsername(principal.getName());
        
        return new MealDTO(savedMeal.getId(), savedMeal.getDate(), savedMeal.getTime(),
        		savedMeal.getDescription(), savedMeal.getCategory().getName(), 
        		savedMeal.getImageName(), savedMeal.getUserName(), 
        		savedMeal.getUser().getNickname(),
			   savedMeal.getUser().getId(), savedMeal.getRank(), user.getId(),
			   user.getGender());
        
    }

    
    @RequestMapping(value="/api/newrank", method=RequestMethod.POST)       
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public MealDTO saveRank(Principal principal, @RequestBody RankDTO rank) {
        
    	mealService.saveRank(principal.getName(), rank);
    	User user = userService.findUserByUsername(principal.getName());

    	Meal updatedMeal = mealService.findMealById(rank.getmealId());

        return new MealDTO(updatedMeal.getId(), updatedMeal.getDate(), updatedMeal.getTime(),
        		updatedMeal.getDescription(), updatedMeal.getCategory().getName(), 
        		updatedMeal.getImageName(), updatedMeal.getUserName(), 
        		updatedMeal.getUser().getNickname(),
			   updatedMeal.getUser().getId(), updatedMeal.getRank(), user.getId(), user.getGender());
    	
    }
    
    /**
     *
     * deletes a list of meals
     *
     * @param deletedMealIds - the ids of the meals to be deleted
     */
    
    @RequestMapping(value="/api/meal", method = RequestMethod.DELETE)       
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public void deleteMeals(@RequestBody List<Long> deletedMealIds) {
        mealService.deleteMeals(deletedMealIds);
    }

    @RequestMapping(value="/api/deletemeal", method = RequestMethod.POST)       
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public void mynotReallyDeletingMealsButSettingFlagOnly(@RequestBody List<Long> deletedMealIds) {
        mealService.deleteMeals(deletedMealIds);
    }

    
    @RequestMapping(value="/api/categories", method = RequestMethod.GET)
    @ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    public List<CategoryDTO> getCategories() {
        List<Category> categories = mealService.findCategories();
        return CategoryDTO.mapFromCategoryEntities(categories);
     }





    @RequestMapping(value="/api/gapstat", method = RequestMethod.GET, params={"username", "pageNumber"})   
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<Object[]>  searchMyGapStat(
            Principal principal,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "username", required = false) String userName
    		) 
    
    {
    	List<Object[]> result;

    	User user = userService.findUserByUsername(principal.getName());
  	
    	result = mealService.findMyGapStat(userName, pageNumber);
 
        return result;
    }

    @RequestMapping(value="/api/gapstat", method = RequestMethod.GET, params={"groupname", "pageNumber"})   
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<Object[]> searchMyGroupGapStat(
            Principal principal,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "groupname", required = false) String groupName
    		) 
    
    {
    	List<Object[]> result;

    	User user = userService.findUserByUsername(principal.getName());
  	
    	result = mealService.findGroupGapStat(groupName, principal.getName(), pageNumber);

        return result;
    }       

    /**
     *
     * error handler for backend errors - a 400 status code will be sent back, and the body
     * of the message contains the exception text.
     *
     * @param exc - the exception caught
     */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> errorHandler(Exception exc) {
        LOGGER.error(exc.getMessage(), exc);
        return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
    }

   
}
