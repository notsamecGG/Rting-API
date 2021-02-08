const fs = require('fs');

exports.Counter = class{
    constructor(url){
        this.like_filename = `./Pages/${url}/like_counter.txt`;
        this.dislike_filename = `./Pages/${url}/dislike_counter.txt`;
        this.url = url;
        this.likes = 0;
        this.dislikes = 0;  

        this._getValues();
    }
    
    _getValues = async () => {
        const like_filename = this.like_filename;
        const dislike_filename = this.dislike_filename;

        if(!fs.existsSync(like_filename)){
            writeFile(like_filename)
                .then(() => {})
                .catch(() => console.error("Couldn't write likes for " + this.url));
        }
        if(!fs.existsSync(dislike_filename)){
            writeFile(dislike_filename)
                .then(() => {})
                .catch(() => console.error("Couldn't write dislikes for " + this.url));
        }
        
        let likes = parseInt(await fs.readFileSync(like_filename), '10');
        let dislikes = parseInt(await fs.readFileSync(dislike_filename), '10');
        
        this.likes = likes;
        this.dislikes = dislikes;

        return {likes: likes, dislikes: dislikes};

        async function writeFile(filename) {
            return await fs.writeFile(filename, '0', () => {});
        }
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

async function AddValueToFile(filename, value, data, callback_obj){
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
