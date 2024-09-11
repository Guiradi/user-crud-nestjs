import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class PasswordLength implements ValidatorConstraintInterface {
  validate(text: string) {
    return text?.length >= 8;
  }
}
