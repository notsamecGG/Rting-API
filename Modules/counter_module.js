const Firebase = require('./fbdb');

exports.Counter = class{
    constructor(url){
        this.like_file = Firebase.Init(`Pages/${url}/likes`);
        this.dislike_file = Firebase.Init(`Pages/${url}/dislikes`);
        this.url = url;
        this.likes = 0;
        this.dislikes = 0;  

        this._getValues();
    }

    get values() {
        return this._getValues();
    }
    
    _getValues = async () => {
        const like_file = this.like_file;
        const dislike_file = this.dislike_file;
        const path = this.path;

        let Check = async (ref) => {
            if(!ref.exists())
                await ref.set({counter: '0'});
            
            return await ref.get().val();
        }

        const likes = parseInt(await Check(like_file), '10');
        const dislikes = parseInt(await Check(dislike_file), '10');

        this.likes = likes;
        this.dislikes = dislikes;

        return {likes: likes, dislikes: dislikes};
    }

    _addValue = async (action, value) => {
        const values = await this._getValues();
        const likes = values.likes;
        const dislikes = values.dislikes; 

        if(action == 1){
            return await AddValueToFile(this.like_file, likes, value, { dislikes: dislikes, action: 1});
        } else if (action == -1) {
            return await AddValueToFile(this.dislike_file, dislikes, value, { likes: likes, action: -1});
        }
        return await this._getValues();
    }

    add = async action => await this._addValue(action, 1);

    remove = async action => await this._addValue(action, -1);
}

async function AddValueToFile(file, data, value, callback_obj){
    const action = callback_obj.action;
    const count = data + value;
    return await writeFile();

    async function writeFile(){
        await file.update({count: count});
        if(action == 1) {
            callback_obj.likes = count;
        } else if (action == -1) {
            callback_obj.dislikes = count;
        }

        return callback_obj;
    }
}
