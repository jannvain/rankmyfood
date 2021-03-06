package rank.dto;

/**
 *
 * DTO used only for posting new users for creation
 *
 */
public class NewUserDTO {

    private String username;
    private String email;
    private String plainTextPassword;
    private int gender;
    public NewUserDTO() {
    }


    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPlainTextPassword() {
        return plainTextPassword;
    }

    public void setPlainTextPassword(String plainTextPassword) {
        this.plainTextPassword = plainTextPassword;
    }
}
