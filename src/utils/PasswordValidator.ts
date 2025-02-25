export class PasswordValidator {
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 12) {
      errors.push("La contraseña debe tener al menos 12 caracteres");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Debe contener al menos una mayúscula");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Debe contener al menos una minúscula");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Debe contener al menos un número");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Debe contener al menos un carácter especial");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
