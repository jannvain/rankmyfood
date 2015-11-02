package rank.config;


import com.allanditzel.springframework.security.web.csrf.CsrfTokenResponseHeaderBindingFilter;

import rank.services.AjaxAuthenticationSuccessHandler;
import rank.services.SecurityUserDetailsService;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.util.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import javax.sql.DataSource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import java.io.IOException;

import org.springframework.security.core.*;

/**
 *
 * The Spring Security configuration for the application - its a form login config with authentication via session cookie (once logged in),
 * with fallback to HTTP Basic for non-browser clients.
 *
 * The CSRF token is put on the reply as a header via a filter, as there is no server-side rendering on this app.
 *
 */
@Configuration
@EnableWebSecurity
public class AppSecurityConfig extends WebSecurityConfigurerAdapter {

    private static final Logger LOGGER = Logger.getLogger(AppSecurityConfig.class);

    @Autowired
    private SecurityUserDetailsService userDetailsService;

    @Autowired
    DataSource dataSource;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(new BCryptPasswordEncoder());
    }

/*    @Override
    public void configure(WebSecurity web) throws Exception {
    	web.ignoring().antMatchers("/js/**");
//      web.ignoring().antMatchers("/bower_components/**");
//      web.ignoring().antMatchers("/bower_components/require/**");

    }
  */  
    public class NoRedirectSavedRequestAwareAuthenticationSuccessHandler extends
									     SavedRequestAwareAuthenticationSuccessHandler {
	
	public final Integer SESSION_TIMEOUT_IN_SECONDS = 60 * 30;
	
        @Override
        public void onAuthenticationSuccess(HttpServletRequest request,
					    HttpServletResponse response, Authentication authentication)
	    throws ServletException, IOException {
	    
            request.getSession().setMaxInactiveInterval(SESSION_TIMEOUT_IN_SECONDS);


	    
	}

    }

    
    @Override
    protected void configure(HttpSecurity http) throws Exception {

	//        CsrfTokenResponseHeaderBindingFilter csrfTokenFilter = new CsrfTokenResponseHeaderBindingFilter();
        //http.addFilterAfter(csrfTokenFilter, CsrfFilter.class);
                
       
   /*     
        http.authorizeRequests().antMatchers("/login.html").permitAll().anyRequest()
		.fullyAuthenticated().and().formLogin().loginPage("/login.html")
		.failureUrl("/login.html?error").and().logout()
		.logoutRequestMatcher(new AntPathRequestMatcher("/logout")).and()
		.exceptionHandling().accessDeniedPage("/access?error");
*/
    	 
			http
			    
			    .csrf().disable()
			    .sessionManagement()
			    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
			    .and()

			.authorizeRequests()
			    .antMatchers("/js/**").permitAll()
			    .antMatchers("/css/**").permitAll()
			    .antMatchers("/img/**").permitAll()
			    .antMatchers("/**/*.html").permitAll()


			    .antMatchers("/**/**/*.html").permitAll()

			    .antMatchers("/**/*").permitAll()
			    .antMatchers("/*").permitAll()
			    .antMatchers("/meal/*").permitAll()
			    .antMatchers("/api/user/*").permitAll()
			    //.antMatchers("/", "/login").permitAll()
			    //.antMatchers("/new-user").permitAll()

			.anyRequest().authenticated()
			.and()
			.formLogin()
	            .defaultSuccessUrl("/")
	            .loginProcessingUrl("/authenticate")
	            .usernameParameter("username")
	            .passwordParameter("password")
	            .successHandler(new AjaxAuthenticationSuccessHandler(new NoRedirectSavedRequestAwareAuthenticationSuccessHandler()))
	            .loginPage("/")
	            .and()
	            .httpBasic()
	            .and()
	            .logout()
		    .logoutUrl("/logout")
		    .deleteCookies("remember-me")
	            .logoutSuccessUrl("/")
	            .permitAll()
		    .and()
		    .rememberMe()
	       ;
	//        	.anyRequest().authenticated();
        if ("true".equals(System.getProperty("httpsOnly"))) {
            LOGGER.info("launching the application in HTTPS-only mode");
            http.requiresChannel().anyRequest().requiresSecure();
        }
    }
    
}
