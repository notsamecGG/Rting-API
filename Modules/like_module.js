const Datastore = require('nedb-async');
const c = require('./counter_module');

/*
database
    user: 'Sheefman',
    action: '-1/0/1'
*/

exports.CheckEntries = async function(url, userid, action){
    const database = new Datastore.AsyncNedb(`Pages/${url}/rating.db`);
    const counter = await new c.Counter(url);
    await database.loadDatabase();

    let entry = await database.asyncFind({user: userid});
    entry = entry[0];

    if (entry){
        const e_action = entry.action;
        const values = await counter.remove(e_action);

        if(e_action != action){
            database.asyncUpdate({user: userid}, { $set: { 'action': action}}, {});
        } else {
            database.asyncUpdate({user: userid}, { $set: { 'action': 0}}, {});
            return values;
        }
    } else {
        await database.asyncInsert({
            user: userid,
            action: action
        });
    }

    return await counter.add(action);

}
