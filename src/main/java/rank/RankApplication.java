package rank;

import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.context.annotation.Configuration;

//@Configuration
//@EnableAutoConfiguration
//@ComponentScan

@SpringBootApplication
public class RankApplication extends SpringBootServletInitializer{

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
      return application.sources(applicationClass)
	  .profiles("production");

  }
    private static Class<RankApplication> applicationClass = RankApplication.class;

    public static void main(String[] args) {
    	 SpringApplication app = new SpringApplication(RankApplication.class);
         app.setShowBanner(false);

         app.run(args);         
    }
}
