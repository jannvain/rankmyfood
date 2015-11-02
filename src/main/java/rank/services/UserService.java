package rank.services;

import rank.repositories.GroupRepository;
import rank.repositories.UserRepository;
import rank.models.Group;
import rank.models.User;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

import static rank.services.ValidationUtils.*;
import java.util.List;

/**
 *
 * Business service for User entity related operations
 *
 */
@Service
public class UserService {

    private static final Logger LOGGER = Logger.getLogger(UserService.class);

    private static final Pattern PASSWORD_REGEX = Pattern.compile("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}");

    private static final Pattern EMAIL_REGEX = Pattern.compile("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
            + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GroupRepository groupRepository;

    /**
     *
     * creates a new user in the database
     *
     * @param username - the username of the new user
     * @param email - the user email
     * @param password - the user plain text password
     */
    @Transactional
    public Boolean createUser(String username, String email, String password, int gender) {

        assertNotBlank(username, "Username cannot be empty.");
        assertMinimumLength(username, 5, "Username must have at least 6 characters.");
        assertNotBlank(email, "Email cannot be empty.");
        assertMatches(email, EMAIL_REGEX, "Invalid email.");
        assertNotBlank(password, "Password cannot be empty.");
        assertMatches(password, PASSWORD_REGEX, "Password must have at least 6 characters, with 1 numeric and 1 uppercase character.");
        // assertNotBlank(gender, "Gender cannot be empty.");

        if (!userRepository.isUsernameAvailable(username)) {
            // throw new IllegalArgumentException("The username is not available.");
	    return false;
        }
        	
        Group ownGroup = groupRepository.findGroupByGroupname("TutSgn");
        User user = new User(username, new BCryptPasswordEncoder().encode(password), email, ownGroup, "USER", gender);

        userRepository.save(user);
	return true;
    }

    @Transactional(readOnly = true)
    public User findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }
    @Transactional(readOnly = true)
    public List<User> findUserByGroupname(String groupname) {
        return userRepository.findUsersByGroupname(groupname);
    }

}
