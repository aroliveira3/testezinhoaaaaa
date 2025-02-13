class UserValidator {
  validateRegistration(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Nome é obrigatório');
    }

    if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Email inválido');
    }

    if (!data.password || typeof data.password !== 'string' || data.password.trim() === '') {
      errors.push('Senha é obrigatória');
    }

    if (!data.confirmPassword || typeof data.confirmPassword !== 'string' || data.confirmPassword.trim() === '') {
      errors.push('Confirmação de senha é obrigatória');
    }

    if (data.password !== data.confirmPassword) {
      errors.push('As senhas não coincidem');
    }

    return errors;
  }

  isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }
}

module.exports = new UserValidator();