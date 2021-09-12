const { connect } = require("mongoose");
const config = require("../config.js");

module.exports = client => {
  connect(config.mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false
}).then(() => {
console.log("(!) Mongoose başarılı bir şekilde bağlandı.");
}).catch(a => 
console.log("(!) Mongoose bağlanırken bir hata oluştu!")
);
}