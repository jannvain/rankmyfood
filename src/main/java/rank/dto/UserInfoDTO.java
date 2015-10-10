package rank.dto;

import java.util.List;
import java.util.stream.Collectors;

import rank.models.Meal;
import rank.models.User;

/**
 *
 * JSON-serializable DTO containing user data
 *
 */
public class UserInfoDTO {

    private String userName;
    private String nickName;

    private String groupName;

    public UserInfoDTO(String userName, String nickName, String groupName) {
        this.userName = userName;
        this.nickName = nickName;

        this.groupName = groupName;
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

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public static UserInfoDTO mapFromUserInfoEntity(User user) {
        return new UserInfoDTO(user.getUsername(), user.getNickname(), user.getGroup().getName());
    }

    public static List<UserInfoDTO> mapFromUsersEntities(List<User> users) {
    	
    	return users.stream().map((user) -> mapFromUserInfoEntity(user)).collect(Collectors.toList());
    }    
    
    
    
}
