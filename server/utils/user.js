
class User{

    constructor(){
        this.users = [];
    }

    addUser(id,name){
        var user = {id,name,count:0};
        this.users.push(user);
        return user;
    }
    updateUserMessageCount(id){
        let user = this.users.filter((user) => user.id === id)[0];
        user.count = user.count + 1 ;
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
        var list = userList.map((user) =>{return  {name: user.name,count:user.count}});
        return list;
    }
}

module.exports = { User}