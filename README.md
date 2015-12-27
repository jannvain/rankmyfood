# eatingchallenge

NOTE: It is experimental still and does not work (quite yet) outside its own test environment

So it is best that you test the demo in the address: http://tutsgn.fi:8080/eatingchallenge



************************
NOTE: THIS IS STILL BROKEN, SO THE INSTRUCTION BELOW DOES NOT WORK (yet), so it is better to check the ready made demo above. It is mainly because the package does not contain the demo content, which is needed to run the package (meal images etc.).

ADDITION: Well, now it compiles and starts but still no demo content and upload does not work yet. I may fix this but no, do not have time.

************************
To compiler and run with embedded server and demo mode:

Download or clone the source code

In downloaded directory install bower dependencies:

bower install

Compile and run the test version of SW:

mvn spring-boot:run -Dspring.profiles.active=development

It will start server in port 8888

http://localhost:8888/eatingchallenge

Just press demo button without login info!




