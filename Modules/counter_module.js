const fs = require('fs');

exports.Counter = class{
    constructor(url){
        this.like_filename = `./Pages/${url}/like_counter.txt`;
        this.dislike_filename = `./Pages/${url}/dislike_counter.txt`;
        this.path = `./Pages/${url}`;
        this.url = url;
        this.likes = 0;
        this.dislikes = 0;  

        this._getValues();
    }

    get values() {
        return this._getValues();
    }
    
    _getValues = async () => {
        const like_filename = this.like_filename;
        const dislike_filename = this.dislike_filename;
        const path = this.path;

        let Check = async (filename) => {
            if(!fs.existsSync(path))
                await fs.mkdirSync(path);
            if(!fs.existsSync(filename))
                await fs.writeFileSync(filename, '0');
            
            return await fs.readFileSync(filename, 'utf-8');
        }

        const likes = parseInt(await Check(like_filename), '10');
        const dislikes = parseInt(await Check(dislike_filename), '10');

        this.likes = likes;
        this.dislikes = dislikes;

        return {likes: likes, dislikes: dislikes};
    }

    _addValue = async (action, value) => {
        const values = await this._getValues();
        const likes = values.likes;
        const dislikes = values.dislikes; 

        if(action == 1){
            return await AddValueToFile(this.like_filename, likes, value, { dislikes: dislikes, action: 1});
        } else if (action == -1) {
            return await AddValueToFile(this.dislike_filename, dislikes, value, { likes: likes, action: -1});
        }
        return await this._getValues();
    }

    add = async action => await this._addValue(action, 1);

    remove = async action => await this._addValue(action, -1);
}

async function AddValueToFile(filename, data, value, callback_obj){
    const action = callback_obj.action;
    const count = data + value;
    return await writeFile();

    async function writeFile(){
        await fs.writeFileSync(filename, `${count}`);
        if(action == 1) {
            callback_obj.likes = count;
        } else if (action == -1) {
            callback_obj.dislikes = count;
        }

        return callback_obj;
    }
}
