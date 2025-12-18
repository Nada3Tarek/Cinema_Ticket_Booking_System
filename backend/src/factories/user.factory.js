class UserFactory {
  static createUser(role, data) {
    return {
      ...data,
      role
    };
  }
}

module.exports = UserFactory;
