package rank.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Collection;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import rank.dto.serialization.CustomTimeDeserializer;
import rank.dto.serialization.CustomTimeSerializer;
import rank.models.Category;
import rank.models.Meal;
import rank.models.Rank;
import rank.dto.RankCompactDTO;

/**
 *
 * JSON serializable DTO containing Meal data
 *
 */
public class MealDTO {

    private Long id;

    @JsonFormat(pattern = "yyyy/MM/dd", timezone = "CET")
    private Date date;

    @JsonSerialize(using = CustomTimeSerializer.class)
    @JsonDeserialize(using = CustomTimeDeserializer.class)
    private Time time;

    private String description;
    private String categoryName;

    private String imageName;
    private String userName;
    private String nickName;

    private long userId;
    private int gender;
    private  Collection<RankCompactDTO> ranks;
    private Boolean hasVoted=false;
    private float averageRank;
    
    public MealDTO() {
        ranks = new ArrayList<RankCompactDTO>();        
    }

    public MealDTO(Long id, Date date, Time time, String description, 
    		String categoryName, String imageName, 
		   String userName, String nickName, long userId, int gender, Collection<Rank> ranks) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.description = description;
        this.categoryName = categoryName;
        this.imageName = imageName;
        this.userName = userName;
        this.nickName = nickName;

        this.userId = userId;
        this.gender = gender;
        this.ranks = mapFromRanksEntitiesC(ranks, userId);
        
        
        float ave = 0.0F;
        for (Rank rank : ranks) {
        	ave += rank.getValue();
        }
        this.averageRank = ave / ranks.size();
        
    }

    public MealDTO(Long id, Date date, Time time, String description, 
    		String categoryName, String imageName, 
		   String userName, String nickName, long userId, Collection<Rank> ranks, long currentUserId, int gender) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.description = description;
        this.categoryName = categoryName;
        this.imageName = imageName;
        this.userName = userName;
        this.nickName = nickName;

        this.userId = userId;
        this.gender = gender;
        this.ranks = mapFromRanksEntitiesC(ranks, userId);        
        
        float ave = 0.0F;
        for (Rank rank : ranks) {
        	ave += rank.getValue();
		//		System.out.println(rank.getOwnerId() + "  " + currentUserId);
        	if(rank.getOwnerId()==currentUserId)
        		this.hasVoted = true;
        }
        this.averageRank = ave / ranks.size();
        
    }
    
    public static RankCompactDTO mapFromRankEntity(Rank rank, long currentUserId) {
        return   new RankCompactDTO(rank.getMeal().getUser().getId(), rank.getValue(), rank.getDescription());
    }
    public static List<RankCompactDTO> mapFromRanksEntitiesC(Collection<Rank> ranks, long currentUserId) {
    	return ranks.stream().map((rank) -> mapFromRankEntity(rank, currentUserId)).collect(Collectors.toList());
    }
    public static MealDTO mapFromMealEntity(Meal meal, long currentUserId) {
        return new MealDTO(meal.getId(), meal.getDate(), meal.getTime(),
                meal.getDescription(), meal.getCategory().getName(), 
                meal.getImageName(), meal.getUserName(), meal.getUser().getNickname(), 
                meal.getUser().getId(), 
                meal.getRank(),
			   currentUserId, meal.getUser().getGender());
    }

    public static List<MealDTO> mapFromMealsEntities(List<Meal> meals, long currentUserId) {
    	
    	return meals.stream().map((meal) -> mapFromMealEntity(meal, currentUserId)).collect(Collectors.toList());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
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

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }
    
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
    
    public String getCategoryName() {
        return this.categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
 
    public Collection<RankCompactDTO> getRank() {
        return this.ranks;
    }

    public void setRank(ArrayList<Rank> ranks) {
        this.ranks = mapFromRanksEntitiesC(ranks, userId);        
    } 
    
    public float getAverageRank() {
        return this.averageRank;
    }

    public void setAverageRank(float rank) {
        this.averageRank = rank;
    } 
    public Boolean getHasVoted() {
        return this.hasVoted;
    }

    public void setHasVoted(Boolean hasVoted) {
        this.hasVoted = hasVoted;
    } 
    public long getUserId() {
        return this.userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    } 
}
