// CPF Validation and Formatting
export function formatCPF(value: string): string {
  // Remove all non-digits
  const cpf = value.replace(/\D/g, '');

  // Apply mask: XXX.XXX.XXX-XX
  return cpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14); // Limit to 14 characters (including dots and dash)
}

export function validateCPF(cpf: string): boolean {
  // Remove all non-digits
  const cleanCPF = cpf.replace(/\D/g, '');

  // Check if it has 11 digits
  if (cleanCPF.length !== 11) return false;

  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

  // Validate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

// Phone Number Formatting
export function formatPhone(value: string): string {
  // Remove all non-digits
  const phone = value.replace(/\D/g, '');

  // Apply mask: (XX) XXXXX-XXXX
  if (phone.length <= 2) {
    return phone;
  } else if (phone.length <= 6) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2)}`;
  } else if (phone.length <= 10) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
  } else {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7, 11)}`;
  }
}

export function validatePhone(phone: string): boolean {
  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');

  // Brazilian phone numbers should have 10 or 11 digits
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

// Name Validation
export function validateName(name: string): boolean {
  // Name should have at least 2 characters and contain letters, spaces, hyphens, apostrophes, and common Brazilian name characters
  const trimmedName = name.trim();
  if (trimmedName.length < 2) return false;

  // Allow letters, spaces, hyphens, apostrophes, and common accented characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-'\.]+$/;
  return nameRegex.test(trimmedName);
}

// Address Validation
export function validateAddress(address: string): boolean {
  // Address should have at least 5 characters
  return address.trim().length >= 5;
}

// Get error messages
export function getCPFError(cpf: string): string | null {
  if (!cpf) return 'CPF é obrigatório';
  if (cpf.replace(/\D/g, '').length !== 11) return 'CPF deve ter 11 dígitos';
  if (!validateCPF(cpf)) return 'CPF inválido';
  return null;
}

export function getPhoneError(phone: string): string | null {
  if (!phone) return 'Telefone é obrigatório';
  if (!validatePhone(phone)) return 'Telefone inválido';
  return null;
}

export function getNameError(name: string): string | null {
  if (!name) return 'Nome é obrigatório';
  if (!validateName(name)) return 'Nome deve ter pelo menos 2 caracteres e conter apenas letras, espaços, hífens e apóstrofos';
  return null;
}

export function getAddressError(address: string): string | null {
  if (!address) return 'Endereço é obrigatório';
  if (!validateAddress(address)) return 'Endereço deve ter pelo menos 5 caracteres';
  return null;
}
