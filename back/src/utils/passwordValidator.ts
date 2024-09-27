export const passwdValidator = (passwd: string) => {
  let validator = {
    message: "",
    state: true,
  };

  const hasUppercase = /[A-Z]/.test(passwd);
  const hasSpecialChar = /[a-zA-Z0-9]/.test(passwd);
  const hasDigit = /[0-9]/.test(passwd);

  if (passwd.length < 8 || !hasUppercase || !hasSpecialChar) {
    let messages: string[] = [];

    if (passwd.length < 8) {
      messages.push("Password must be at least 8 characters long.");
      validator.state = false;
    }

    if (!hasDigit) {
      messages.push("Password must be at least one digit.");
      validator.state = false;
    }

    if (!hasUppercase) {
      messages.push("Password must contain at least one uppercase letter.");
      validator.state = false;
    }

    if (!hasSpecialChar) {
      messages.push("Password must contain at least one special character.");
      validator.state = false;
    }

    validator.message = messages.join("\n");
  }

  return validator;
};
