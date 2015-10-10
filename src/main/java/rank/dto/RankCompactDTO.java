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
import rank.models.Rank;


public class RankCompactDTO {

    private long ownerId;
    private float voteValue;
    private String description;
    
    public RankCompactDTO() {
    }

    public RankCompactDTO(Long ownerId, float voteValue, String description) {
        this.ownerId = ownerId;
        this.description = description;
        this.voteValue = voteValue;        
    }
/*
    public static RankCompactDTO mapFromRankEntity(Meal meal) {
        return new RankCompactDTO(meal.getId(), meal.getDate(), meal.getTime(),
                meal.getDescription(), meal.getCategory().getName(), 
                meal.getCategory().getDescription(), meal.getImageName(), meal.getUserName(), meal.getUser().getId(), meal.getRank());
    }
*/

    public long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(long id) {
        this.ownerId = id;
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
    
    
    public static RankCompactDTO mapFromRankEntity(Rank rank, long currentUserId) {
        return   new RankCompactDTO(rank.getMeal().getUser().getId(), rank.getValue(), rank.getDescription());
    }

    public static Collection<RankCompactDTO> mapFromRanksEntitiesC(Collection<Rank> ranks, long currentUserId) {
    	return ranks.stream().map((rank) -> mapFromRankEntity(rank, currentUserId)).collect(Collectors.toList());
    }
    

}
