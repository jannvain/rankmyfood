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

/**
 *
 * JSON serializable DTO containing Meal data
 *
 *
 *    $scope.voteData = {
    		   mealId: $routeParams.mealId,
    		   voteValue: 7,
    		   description: "none",
    		   date: tmpDate.getDate() + "." + (tmpDate.getMonth() + 1) + "." + tmpDate.getFullYear(),
    		   time: tmpHours + ":" + tmpMinutes
       };
 *
 */
public class RankDTO {

    private long mealId;
    private float voteValue;
    private String description;
    
    
    @JsonFormat(pattern = "yyyy/MM/dd", timezone = "CET")
    private Date date;

    @JsonSerialize(using = CustomTimeSerializer.class)
    @JsonDeserialize(using = CustomTimeDeserializer.class)
    private Time time;
    
    public RankDTO() {
    }

    public RankDTO(Long mealId, float voteValue, String description, Date date, Time time) {
        this.mealId = mealId;
        this.description = description;
        this.voteValue = voteValue;        
        this.date = date;
        this.time = time;
    }
/*
    public static RankDTO mapFromRankEntity(Meal meal) {
        return new RankDTO(meal.getId(), meal.getDate(), meal.getTime(),
                meal.getDescription(), meal.getCategory().getName(), 
                meal.getCategory().getDescription(), meal.getImageName(), meal.getUserName(), meal.getUser().getId(), meal.getRank());
    }
*/

    public long getmealId() {
        return mealId;
    }

    public void setId(long id) {
        this.mealId = id;
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


    public void setVoteValue(float vote) {
        this.voteValue = vote;
    } 
    
    public float getVoteValue() {
        return this.voteValue;
    }
    
    
    public static RankDTO mapFromRankEntity(Rank rank, long currentUserId) {
        return   new RankDTO(rank.getMeal().getId(), rank.getValue(), rank.getDescription(), rank.getMeal().getDate(), 
        		rank.getMeal().getTime());
    }

    public static List<RankDTO> mapFromRanksEntities(List<Rank> ranks, long currentUserId) {
    	
    	return ranks.stream().map((rank) -> mapFromRankEntity(rank, currentUserId)).collect(Collectors.toList());
    }
    

}
