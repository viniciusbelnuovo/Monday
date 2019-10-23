module.exports = function(sequelize, Sequelize) {
    const Boards = sequelize.define('boards',{
        BoardID: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ExternalID:{
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        Name: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    return Boards;
}
