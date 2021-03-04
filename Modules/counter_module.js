const Datastore = require('./fbdb');

exports.Counter = class{
    constructor(url){
        this.database = new Datastore.Database('pages');
        this.url = url;
        this.likes = 0;
        this.dislikes = 0;  

        this._getValues();
    }

    get values() {
        return this._getValues();
    }
    
    _getValues = async () => {
        //Get values (likes, dislikes) form database by id (url)
        let raw = (await this.database.Get(this.url)).data;
        if(!raw)
            raw = this.database.Set(this.url, {likes: 0, dislikes: 0});
        
        const {likes, dislikes} = raw;
        this.likes, this.dislikes = likes, dislikes;
        return {likes: likes, dislikes: dislikes};
    }

    _addValue = async (action, value) => {
        const values = await this._getValues();
        const {likes, dislikes} = values;
        console.log('add', likes, dislikes);

        if(action == 1) {
            this.database.Update(this.url, {likes: likes + value});
        } else if(action == -1) {
            this.database.Update(this.url, {dislikes: dislikes + value});
        }
        return this._getValues();
    }

    add = async action => await this._addValue(action, 1);

    remove = async action => await this._addValue(action, -1);
}
