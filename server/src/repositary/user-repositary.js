const User = require("../model/User");

const c = async () => {
  try {
    const client = await connectDb();
    console.log("---", client.modelNames);
    // return await client.models Bot_User.create({
    //   name: "abv",
    //   city: "asdf",
    //   country: "Uk",
    // });
  } catch (error) {
    console.log("Errr", error);
  }
};
c();


class UserRepo{
    async create(){
        try {
            
        } catch (error) {
            throw 
        }
    }
}
