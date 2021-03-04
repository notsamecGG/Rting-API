const Datastore = require('./fbdb');
const c = require('./counter_module');

// cll = collection
const cll = 'useractions';

exports.CheckEntries = async function(url, userid, action){
    const database = new Datastore.Database('pages');
    const counter = await new c.Counter(url);

    let entry = (await database.FindChild(url, cll, userid)).data;
    console.log({entry: entry});

    if (entry){
        const e_action = entry.action;
        const values = await counter.remove(e_action);

        if(e_action != action){
            database.UpdateChild(url, cll, userid, { action: action });
        } else {
            database.UpdateChild(url, cll, userid, { action: 0 });
            console.log('likemodule returns values');
            return values;
        }
    } else {
        await database.SetPath(url, cll, userid, {action: action});
    }

    return await counter.add(action);
}
