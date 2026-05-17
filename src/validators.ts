import { ValidationError } from "./errors";

export function validateId(
  value: string,
  fieldName: string
): void {
  if (!value || value.trim().length === 0) {
    throw new ValidationError(
      `${fieldName} nie może być pusty`
    );
  }
}

export function validateCardNumber(
  cardNumber: string
): void {
  if (cardNumber.length !== 16) {
    throw new ValidationError(
      "Numer karty musi mieć 16 cyfr"
    );
  }
}

export function validateCVV(cvv: string): void {
  if (cvv.length !== 3) {
    throw new ValidationError(
      "CVV musi mieć 3 cyfry"
    );
  }
}