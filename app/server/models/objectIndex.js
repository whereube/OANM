import { category } from "./category.js";
import { company } from "./company.js";
import { end_user } from "./end_user.js";
import { needs } from "./needs.js";
import { offers } from "./offers.js";
import { meeting } from "./meeting.js";
import { articleCategory } from "./articleCategory.js";
import { meetingCategory } from "./meetingCategory.js";

const environment = process.env.DEV_ENVIRONMENT;

offers.belongsTo(end_user, { foreignKey: 'user_id' });
needs.belongsTo(end_user, { foreignKey: 'user_id' });
meetingCategory.belongsTo(category, { foreignKey: 'category_id' });
meetingCategory.belongsTo(meeting, { foreignKey: 'meeting_id' });



if (process.env.DEV_ENVIRONMENT === 'local') {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    /*dom utkommenterade metoderna nedanför är utkommenterade för försäkra att live-databasen inte skrivs över av misstag
        om du vill sätta upp och populera en lokal databas måste dessa kommenteras in igen
      */

    //await db.sync({ force: true });
    console.log('Tables synchronized successfully.');
    //await populateDB()
    console.log('Inserted succesfully.');
  } catch (error) {
    console.error('Sync error: ', error);
  }
}

export {
    category,
    company,
    end_user,
    needs,
    offers,
    meeting,
    articleCategory,
    meetingCategory
}