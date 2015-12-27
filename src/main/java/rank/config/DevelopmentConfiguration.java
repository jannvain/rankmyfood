package rank.config;


import rank.config.TestDataInitializer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * Development specific configuration - creates a localhost MySql datasource,
 * sets hibernate on create drop mode and inserts some test data on the database.
 *
 * Set -Dspring.profiles.active=development to activate this config.
 *
 */
@Configuration
@Profile("development")
@EnableTransactionManagement
public class DevelopmentConfiguration {

    @Bean(initMethod = "init")
    public TestDataInitializer initTestData() {
        return new TestDataInitializer();
    }

    @Bean(name = "datasource")
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost/rankmyfoodtest");
        dataSource.setUsername("root");
        dataSource.setPassword("Torkku13Z");
        return dataSource;
    }

    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DriverManagerDataSource dataSource) {

        LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactoryBean.setDataSource(dataSource);
        entityManagerFactoryBean.setPackagesToScan(new String[]{"rank.models"});
        entityManagerFactoryBean.setLoadTimeWeaver(new InstrumentationLoadTimeWeaver());
        entityManagerFactoryBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        Map<String, Object> jpaProperties = new HashMap<String, Object>();
        jpaProperties.put("hibernate.hbm2ddl.auto", "create-drop");
        jpaProperties.put("hibernate.show_sql", "false");
        jpaProperties.put("hibernate.format_sql", "true");
        jpaProperties.put("hibernate.use_sql_comments", "true");
        jpaProperties.put("hibernate.dialect", "org.hibernate.dialect.MySQL5Dialect");
        entityManagerFactoryBean.setJpaPropertyMap(jpaProperties);

        return entityManagerFactoryBean;
    }

}


/*
 spring.datasource.url=jdbc:mysql://localhost/rankme
spring.datasource.username=root
spring.datasource.password=Torkku13Z
spring.datasource.driverClassName=com.mysql.jdbc.Driver

# Specify the DBMS
spring.jpa.database = MYSQL

# Show or not log for each sql query
spring.jpa.show-sql = true

# Hibernate settings are prefixed with spring.jpa.hibernate.*
spring.jpa.hibernate.ddl-auto = update
spring.jpa.hibernate.dialect = org.hibernate.dialect.MySQL5Dialect
spring.jpa.hibernate.naming_strategy = org.hibernate.cfg.ImprovedNamingStrategy

server.port=8080
 * */
