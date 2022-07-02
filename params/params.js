const DATABASECONNECTION = "mongodb+srv://nhscfwebapp:app@cluster0.y2rrx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DEVDBCONN = "mongodb+srv://nhscfdev:nhscfdev@cluster0.cfd0m.mongodb.net/?retryWrites=true&w=majority"

const recruitmentEmailTemplate = "Dear contactname,\nMy name is cmmname and I am a student at cmmschool. I understand that you are the contactpos at contactschool. Along with leading my school's environmental club, I am on the leadership committee of the National High School Climate Forum. Our forum's mission is to foster an exchange of ideas between student environmental leaders from across the country for conservation and sustainability projects/initiatives in high schools and communities. We currently have schoolnum schools involved from statenum states, and are currently looking to expand. Does contactschool have any student-led climate-based clubs or councils on campus that might be interested in getting involved? If so, would you mind sending us their contact information? To learn more about our forum, please visit nhsclimateforum.org.\n\nIf contactschool student environmental leaders decide to join our forum, they would be able to 1) expand their club opportunities through attendance at our speaker events, 2) participate in an exchange of ideas with other high school environmental leaders, 3) get the opportunity to present their initiatives at our national climate summit at the end of the school year, and 4) two of the students would be eligible to serve on our national leadership committee. Some of our speakers from the 2020-2021 school year include executives at General Motors, First Solar, and Conservation International, collegiate sustainability directors at Princeton University and Bates College, along with U.S. Forest Service leaders.\n\nWe would really like to connect with the student environmental leaders at contactschool and any help in doing so would be greatly appreciated! Please let us know if you have any questions or concerns. Thank you so much!\n\nSincerely,\ncmmname";

var adminEmails = ["acnoviello23@lawrenceville.org", "abnoviello23@lawrenceville.org"];

var privateKey = "sfwhvfhivef0303u0030e3jcnecwnie";

var baseURL = "https://nhsclimateforum.org/";

var eventRegisterEmailTemplate = "Dear ATTENDEE, <br>On behalf of the National High School Climate Forum Leadership Committee, thank you for registering for our upcoming event, EVENTNAME, which will be taking place on <b>EVENTDATE</b>. The goal of our events is to spread education about climate change-related issues and, by attending, you are making an effort to increase your education on these problems and to better equip yourself with the insight to help solve them.<br><br>We look forward to seeing you soon and hope that you will encourage other students at SCHOOLNAME to attend, as well!<br><br>Sincerely,<br>The National High School Climate Forum";

module.exports={
    DATABASECONNECTION,
    recruitmentEmailTemplate,
    adminEmails,
    privateKey,
    eventRegisterEmailTemplate,
    baseURL,
    DEVDBCONN
}