import { ValueObject } from '@/shared/domain/value-object.base';

interface EmailProps {
  value: string;
}

class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value;
  }

  static create(email: string): Email {
    return new Email({ value: email });
  }
}

describe('ValueObject Base', () => {
  describe('equals', () => {
    it('should return true for same values', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different values', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');

      expect(email1.equals(email2)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const email = Email.create('test@example.com');

      expect(email.equals(undefined)).toBe(false);
    });

    it('should return true for objects with same nested properties', () => {
      interface ComplexProps {
        name: string;
        age: number;
      }

      class ComplexVO extends ValueObject<ComplexProps> {
        get name(): string {
          return this.props.name;
        }
        get age(): number {
          return this.props.age;
        }
      }

      const vo1 = new ComplexVO({ name: 'John', age: 30 });
      const vo2 = new ComplexVO({ name: 'John', age: 30 });

      expect(vo1.equals(vo2)).toBe(true);
    });

    it('should return false for objects with different nested properties', () => {
      interface ComplexProps {
        name: string;
        age: number;
      }

      class ComplexVO extends ValueObject<ComplexProps> {
        get name(): string {
          return this.props.name;
        }
        get age(): number {
          return this.props.age;
        }
      }

      const vo1 = new ComplexVO({ name: 'John', age: 30 });
      const vo2 = new ComplexVO({ name: 'John', age: 31 });

      expect(vo1.equals(vo2)).toBe(false);
    });
  });

  describe('props immutability', () => {
    it('should freeze props to prevent mutation', () => {
      const email = Email.create('test@example.com');

      expect(Object.isFrozen(email['props'])).toBe(true);
    });
  });
});

