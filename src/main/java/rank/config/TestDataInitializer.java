package rank.config;






import rank.models.Category;
import rank.models.Group;
import rank.models.Meal;
import rank.models.Rank;
import rank.models.User;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManagerFactory;

import java.sql.Time;
import java.util.Arrays;
import java.util.Date;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.ListIterator;
import java.util.Random;

/**
 *
 * This is a initializing bean that inserts some test data in the database. It is only active in
 * the development profile, to see the data login with user123 / PAssword2 and do a search starting on
 * 1st of January 2015.
 *
 */
@Component
public class TestDataInitializer {

    @Autowired
    private EntityManagerFactory entityManagerFactory;


	@SuppressWarnings("deprecation")
	public void init() throws Exception {

		Random rand = new Random();
        SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);

        Session session = sessionFactory.openSession();
        Transaction transaction = session.beginTransaction();
        
        Group defaultGroup = new Group("Public", "Public default group");
        session.persist(defaultGroup);
        
        Group defaultGroup2 = new Group("Myfamily", "Family group");
        session.persist(defaultGroup2);        

        Group defaultGroup3 = new Group("TutSgn", "TUT SGN Eating challenge");
        session.persist(defaultGroup3);        
        
        
        User user = new User("janne", "$2a$10$x9vXeDsSC2109FZfIJz.pOZ4dJ056xBpbesuMJg3jZ.ThQkV119tS", "test@email.com", 
			     defaultGroup, "USER", 0);

        User user2 = new User("ritva", "$2a$10$TZYYROEHeGsmkCSYuf0yBOLCNRh7ulr2wtcDcYw0.G4NyQx1.wJM2", "test123@test.fi", 
			      defaultGroup, "USER", 1);

        
        
        session.persist(user);
        session.persist(user2);

        Category defaultCategory = new Category(user.getId(), "Snack", "Snacking whatever");
        Category defaultCategory2 = new Category(user.getId(), "Breakfast", "Breakfast");
        Category defaultCategory3 = new Category(user.getId(), "Lunch", "Lunch");
        Category defaultCategory4 = new Category(user.getId(), "Dinner", "Dinner");
/*        Category defaultCategory5 = new Category(user.getId(), "Morning snack", "Morning snack");
        Category defaultCategory6 = new Category(user.getId(), "Afternoon snack", "Afternoon snack");
        Category defaultCategory7 = new Category(user.getId(), "Evening snack", "Evening snack");
*/
        session.persist(defaultCategory);
        session.persist(defaultCategory2);
        session.persist(defaultCategory3);
        session.persist(defaultCategory4);
  /*      session.persist(defaultCategory5);
        session.persist(defaultCategory6);
        session.persist(defaultCategory7);
*/

        
        Date cd = new Date();
        
        Date currentDate = new Date(cd.getYear(), cd.getMonth(), cd.getDate());

        currentDate.setHours(12);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        

        Date yesterday = new Date(currentDate.getYear(), currentDate.getMonth(), currentDate.getDate()-1);
        yesterday.setHours(12);
        yesterday.setMinutes(0);
        yesterday.setSeconds(0);

        Meal meal1 =  new Meal(user, currentDate, new Time(07, 15, 0), "Halloumi salad", defaultCategory2, "mealimage.jpg");
        Meal meal2 =  new Meal(user, currentDate, new Time(10, 0, 0), "Chicken and fried potatoes", defaultCategory, "mealimage2.jpg");
        Meal meal3 =  new Meal(user, currentDate, new Time(13, 30, 0), "Chicken pasta", defaultCategory3, "mealimage3.jpg");
        Meal meal4 =  new Meal(user, currentDate, new Time(15, 45, 0), "Healthy breakfast", defaultCategory, "mealimage4.jpg");
        Meal meal5 =  new Meal(user, currentDate, new Time(18, 0, 0), "Sushi", defaultCategory4, "mealimage5.jpg");
        Meal meal6 =  new Meal(user, currentDate, new Time(22, 45, 0), "Curry", defaultCategory, "mealimage6.jpg");
        Meal meal7 =  new Meal(user, currentDate, new Time(23, 30, 0), "Omelet", defaultCategory, "mealimage7.jpg");
        Meal meal8 =  new Meal(user, yesterday, new Time(9, 30, 0), "Sushi at home", defaultCategory3, "mealimage8.jpg");
        Meal meal9 =  new Meal(user, yesterday, new Time(12, 0, 0), "Baltic Herring", defaultCategory3, "mealimage9.jpg");
        Meal meal10 =  new Meal(user, yesterday, new Time(18, 0, 0), "Coffee and Wiener", defaultCategory, "mealimage10.jpg");
        Meal meal11 =  new Meal(user, yesterday, new Time(21, 15, 0), "Fish soup", defaultCategory4, "mealimage11.jpg");
        Meal meal1b =  new Meal(user2,currentDate, new Time(10, 0, 0), "Coffee and Wiener too", defaultCategory, "mealimage10.jpg");
        Meal meal2b =  new Meal(user2, currentDate, new Time(15, 0, 0), "Salmon soup", defaultCategory4, "mealimage11.jpg");


        Meal meal1c =  new Meal(user2,yesterday, new Time(13, 0, 0), "Coffee and Wiener too", defaultCategory, "mealimage6.jpg");
        Meal meal2c =  new Meal(user2, yesterday, new Time(18, 15, 0), "Salmon soup", defaultCategory4, "mealimage4.jpg");


        session.persist(meal1);
        session.persist(meal2);
        session.persist(meal3);
        session.persist(meal4);
        session.persist(meal5);
        session.persist(meal6);
        session.persist(meal7);
        session.persist(meal8);
        session.persist(meal9);
        session.persist(meal10);
        session.persist(meal11);
        session.persist(meal1b);
        session.persist(meal2b);

        session.persist(meal1c);
        session.persist(meal2c);
        
        LinkedList<Integer> rbuf1 = new LinkedList<Integer>(Arrays.asList(7,6,7,8,7));
        LinkedList<Integer> rbuf2 = new LinkedList<Integer>(Arrays.asList(8,9,8,7,7));

        for(int i=2;i<42;i++){
            Date date = new Date(currentDate.getYear(), currentDate.getMonth(), currentDate.getDate()-i);
            date.setHours(12);
            date.setMinutes(0);
            date.setSeconds(0);
            int rd1 = rand.nextInt((11 - 2) + 1) + 2;
            int rd2 = rand.nextInt((11 - 2) + 1) + 2;

            Meal tmpMeal1 =  new Meal(user, date, new Time(07, 30, 0), "Halloumi salad", defaultCategory2, "mealimage" + rd1 + ".jpg");
            Meal tmpMeal2 =  new Meal(user2,date, new Time(10, 15, 0), "Coffee and Wiener too", defaultCategory, "mealimage" + rd2 + ".jpg");
            session.persist(tmpMeal1);
            session.persist(tmpMeal2);
            int randomNum1 = rand.nextInt((10 - 6) + 1) + 6;
            int randomNum2 = rand.nextInt((10 - 5) + 1) + 5;
            rbuf1.add((int)randomNum1);
            rbuf2.add((int)randomNum2);  



            Meal tmpMeal3 =  new Meal(user, date, new Time(11, 15+rand.nextInt(7), 0), "Halloumi salad for ever", defaultCategory2, "mealimage" + rd1 + ".jpg");
	    Meal tmpMeal4 =  new Meal(user2,date, new Time(14, 10+rand.nextInt(10), 0), "Coffee and Wiener again", defaultCategory, "mealimage" + rd2 + ".jpg");
            session.persist(tmpMeal3);
            session.persist(tmpMeal4);
            
            float ave1=0;
            float ave2=0;

            ListIterator<Integer> it = rbuf1.listIterator(rbuf1.size());
            while (it.hasPrevious()) 
            {
                float sum = it.previous();
                ave1 += sum/rbuf1.size();
            }
            
            ListIterator<Integer> it2 = rbuf2.listIterator(rbuf2.size());
            while (it2.hasPrevious()) 
            {
                float sum = it2.previous();
                ave2 += sum/rbuf2.size();
            }
            
            rbuf1.remove(0);
            rbuf2.remove(0);
            rbuf1.add((int)ave1);
            rbuf2.add((int)ave2);
            
            Rank tmpRank1 = new Rank(user2.getId(), ave1, "Ihan ok");
            Rank tmpRank2 = new Rank(user2.getId(), ave2, "Ihan ok");
            session.persist(tmpRank1);
            session.persist(tmpRank2);
            tmpRank1.setMeal(tmpMeal1);
            tmpRank2.setMeal(tmpMeal2);


        }
        Rank rank1 = new Rank(user2.getId(), 7, "Ihan ok");

        Rank rank2 = new Rank(user.getId(), 8, "Ihan ok");
        Rank rank3 = new Rank(user.getId(), 8.51F, "Fat and salt, but good, nam...");
        Rank rank4 = new Rank(user.getId(), 10, "Ihan ok");
        Rank rank5 = new Rank(user.getId(), 9, "Ihan ok");

        Rank rank6 = new Rank(user.getId(), 7, "Ihan ok");
        Rank rank7 = new Rank(user.getId(), 9.76F, "Ihan ok");
        Rank rank8 = new Rank(user.getId(), 4.51F, "Ihan ok");
        Rank rank9 = new Rank(user.getId(), 7, "Ihan ok");
        Rank rank10 = new Rank(user.getId(), 6.49F, "Ihan ok");
        Rank rank11 = new Rank(user.getId(), 9, "Ihan ok");
        Rank rank1b = new Rank(user.getId(), 9F, "Ihan ok");
        Rank rank2b = new Rank(user2.getId(), 7, "Ihan ok");

        session.persist(rank1);
        session.persist(rank2);
        session.persist(rank3);
        session.persist(rank4);
        session.persist(rank5);
        session.persist(rank6);
        session.persist(rank7);
        session.persist(rank8);
        session.persist(rank9);
        session.persist(rank10);
        session.persist(rank11);
        session.persist(rank1b);
        session.persist(rank2b);

        rank1.setMeal(meal1);
        rank2.setMeal(meal2);
//        rank3.setMeal(meal3);
        rank4.setMeal(meal4);
        rank5.setMeal(meal5);
        rank6.setMeal(meal6);
        rank7.setMeal(meal7);
        rank8.setMeal(meal8);
        rank9.setMeal(meal9);
        rank10.setMeal(meal10);
        rank11.setMeal(meal11);
        rank1b.setMeal(meal1b);
        rank2b.setMeal(meal2b);
        
        session.flush();
   
        transaction.commit();
        
     
    }
}

