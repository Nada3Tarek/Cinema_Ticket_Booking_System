class UserFactory {
  static createUser({ email, password, adminKey }) {
    const isAdmin = adminKey === process.env.ADMIN_SECRET;

    return {
      email,
      password,
      role: isAdmin ? 'ADMIN' : 'CUSTOMER'
    };
  }
}

module.exports = UserFactory;
