const {
  create,
  getAll,
  getOne,
  update,
  remove
} = require('./functions/user');

module.exports = {
  createUser: create,
  getAllUsers: getAll,
  getUser: getOne,
  updateUser: update,
  deleteUser: remove
};
