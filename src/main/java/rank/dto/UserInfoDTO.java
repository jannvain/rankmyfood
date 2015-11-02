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
    private int gender;

    public UserInfoDTO(String userName, String nickName, String groupName, int gender) {
        this.userName = userName;
        this.nickName = nickName;

        this.groupName = groupName;
	this.gender = gender;
    }

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
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
        return new UserInfoDTO(user.getUsername(), user.getNickname(), user.getGroup().getName(), user.getGender());
    }

    public static List<UserInfoDTO> mapFromUsersEntities(List<User> users) {
    	
    	return users.stream().map((user) -> mapFromUserInfoEntity(user)).collect(Collectors.toList());
    }    
    
    
    
}
