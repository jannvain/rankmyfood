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
public class RankStatDTO {

    private float voteValue;
    
    @JsonFormat(pattern = "yyyy/MM/dd", timezone = "CET")
    private Date date;

 
    public RankStatDTO() {
    }

    public RankStatDTO(float voteValue, Date date) {
        this.voteValue = voteValue;        
        this.date = date;
    }

      public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
    
    public void setVoteValue(float vote) {
        this.voteValue = vote;
    } 
    
    public float getVoteValue() {
        return this.voteValue;
    }
    
    
    public static RankStatDTO mapFromRankEntity(Rank rank) {
        return   new RankStatDTO(rank.getValue(), rank.getMeal().getDate());
    }

    public static List<RankStatDTO> mapFromRanksEntities(List<Rank> ranks) {
    	
    	return ranks.stream().map((rank) -> mapFromRankEntity(rank)).collect(Collectors.toList());
    }
    

}
