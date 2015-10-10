package rank;

import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.context.annotation.Configuration;

//@Configuration
//@EnableAutoConfiguration
//@ComponentScan

@SpringBootApplication
public class RankApplication {

    public static void main(String[] args) {
    	 SpringApplication app = new SpringApplication(RankApplication.class);
         app.setShowBanner(false);
         app.run(args);         
    }
}
