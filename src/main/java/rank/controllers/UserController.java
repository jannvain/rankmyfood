package rank.controllers;


import rank.dto.MealDTO;
import rank.dto.NewUserDTO;
import rank.dto.UserInfoDTO;
import rank.models.Group;
import rank.models.User;
import rank.services.UserService;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 *
 *  REST service for users.
 *
 */

@Controller
public class UserController {

    private static final Logger LOGGER = Logger.getLogger(UserController.class);

    @Autowired
    UserService userService;

    @RequestMapping(value="/api/user", method = RequestMethod.GET)
    @ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    public UserInfoDTO getUserInfo(Principal principal) {
        User user = userService.findUserByUsername(principal.getName());
        return user != null ? new UserInfoDTO(user.getUsername(), user.getNickname(), user.getGroup().getName(), user.getGender()) : null;
    }

    @RequestMapping(value="/api/groupmembers", method = RequestMethod.GET)
    @ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    public List<UserInfoDTO> getGroupUsers(Principal principal) {
        User user = userService.findUserByUsername(principal.getName());
        List<User> users = userService.findUserByGroupname(user.getGroup().getName());
        return UserInfoDTO.mapFromUsersEntities(users);
     }
    
    
    @RequestMapping(value="/api/user", method = RequestMethod.POST)
    public ResponseEntity<String>  createUser(@RequestBody NewUserDTO user) {
        Boolean succeed = userService.createUser(user.getUsername(), user.getEmail(), user.getPlainTextPassword(), user.getGender());

	if(succeed)
	    return new ResponseEntity<>("User created", HttpStatus.OK);
	else
	    return new ResponseEntity<>("The username is not available", HttpStatus.CONFLICT);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> errorHandler(Exception exc) {
        LOGGER.error(exc.getMessage(), exc);
        return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
