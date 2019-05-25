
class User{

    constructor(){
        this.users = [];
    }

    addUser(id,name){
        var user = {id,name};
        this.users.push(user);
        return user;
    }

    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }

    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id != id); 
        }
       
        return user;

    }

    getUserList(){
        var userList = this.users;
        var list = userList.map((user) => user.name);
        return list;
    }
}

module.exports = { User}