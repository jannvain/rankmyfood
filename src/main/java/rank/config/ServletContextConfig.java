package rank.config;

import javax.servlet.MultipartConfigElement;

import org.springframework.boot.context.embedded.MultipartConfigFactory;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.access.SecurityConfig;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 *
 * Spring MVC config for the servlet context in the application.
 *
 * The beans of this context are only visible inside the servlet context.
 *
 */
@Configuration
@EnableWebMvc
// @Import({ SecurityConfig.class })
@ComponentScan("meal.rank.app.controllers")
public class ServletContextConfig extends WebMvcConfigurerAdapter {

/*	
	@Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize("128KB");
        factory.setMaxRequestSize("128KB");
        return factory.createMultipartConfig();
    }
  */ 
	

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {



	String rootDir;

	//        registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
 //       registry.addResourceHandler("/api/user/**").addResourceLocations("/api/user/");
 //       registry.addResourceHandler("/api/meal/**").addResourceLocations("/api/meal/");
        registry.addResourceHandler("/api/**").addResourceLocations("classpath:/api/");
        registry.addResourceHandler("/authenticate/**").addResourceLocations("classpath:/authenticate/");
        registry.addResourceHandler("/img/**").addResourceLocations("classpath:/img/");
        registry.addResourceHandler("/js/**").addResourceLocations("classpath:/js/", "classpath:/bower_components/");
        registry.addResourceHandler("/css/**").addResourceLocations("classpath:/css/", "classpath:/bower_components/");

        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");

        registry.addResourceHandler("/mealimages/**").addResourceLocations("file:/Users/vainio6/rankme/pic/", "file:/mnt/mydata/mealimages/");

    }
    
    
    @Bean
    public MultipartResolver multipartResolver() {
    	return new StandardServletMultipartResolver();
//        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
//        multipartResolver.setMaxUploadSize(500000);
//        return multipartResolver;
    }    
    
}
