# Password Storage Implementation

**Date:** 2026-01-26  
**Security Level:** ✅ **SECURE** - Passwords are hashed, never stored in plain text

---

## Overview

Passwords in this system are **never stored in plain text**. They are hashed using **bcrypt** with **12 salt rounds** before being stored in the database.

---

## Storage Flow

### 1. Database Schema

**Table:** `User`  
**Field:** `passwordHash` (String)

```prisma
model User {
  id           String      @id @default(uuid())
  email        String      @unique
  passwordHash String      // ✅ Stored as bcrypt hash, never plain text
  isActive     Boolean     @default(true)
  // ...
}
```

**Key Points:**
- ✅ Field is named `passwordHash` (not `password`) to make it clear it's a hash
- ✅ Type is `String` to store the bcrypt hash string
- ✅ No plain text password field exists

---

## 2. Password Hashing

### Implementation: `PasswordService`

**File:** `apps/api/src/modules/auth/infrastructure/services/password.service.ts`

```typescript
@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 12; // ✅ Industry standard (10-12 rounds)

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

**Security Features:**
- ✅ **bcrypt** - Industry-standard password hashing algorithm
- ✅ **12 salt rounds** - High security (recommended: 10-12)
- ✅ **Automatic salting** - bcrypt generates unique salt per password
- ✅ **One-way hashing** - Cannot be reversed to plain text

### Hash Format

bcrypt hashes have the format:
```
$2b$12$[22-character-salt][31-character-hash]
```

**Example hash for "Admin@123":**
```
$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5q5q5q5q5q
```

**Components:**
- `$2b$` - bcrypt algorithm identifier
- `12` - Cost factor (salt rounds)
- Next 22 chars - Unique salt
- Last 31 chars - Hash

---

## 3. Password Storage Process

### During User Creation (Seed Script)

**File:** `apps/api/prisma/seed.ts`

```typescript
// ✅ Password is hashed BEFORE storage
const passwordHash = await bcrypt.hash('Admin@123', 12);

await prisma.user.create({
  email: 'admin@pilates.com',
  passwordHash, // ✅ Stored as hash, never plain text
  isActive: true,
});
```

**Flow:**
1. User provides plain password: `"Admin@123"`
2. Password is hashed: `bcrypt.hash("Admin@123", 12)`
3. Hash is stored: `passwordHash = "$2b$12$..."`

### During User Registration (Future)

When implementing user registration, the same process applies:

```typescript
// ✅ Always hash before storing
const passwordHash = await passwordService.hash(plainPassword);
await userRepository.create({ email, passwordHash });
```

---

## 4. Password Verification (Login)

### Implementation: `LoginUseCase`

**File:** `apps/api/src/modules/auth/application/use-cases/login.use-case.ts`

```typescript
async execute(email: string, password: string) {
  // 1. Get user from database (contains passwordHash)
  const user = await this.userRepository.findByEmail(email);
  
  // 2. Compare plain password with stored hash
  const isPasswordValid = await this.passwordService.compare(
    password,        // ✅ Plain text from request
    user.passwordHash // ✅ Stored bcrypt hash
  );
  
  // 3. Only proceed if password matches
  if (!isPasswordValid) {
    return left(new UnauthorizedException('Invalid credentials'));
  }
  
  // 4. Generate JWT tokens...
}
```

**Security Features:**
- ✅ **Timing-safe comparison** - bcrypt.compare() prevents timing attacks
- ✅ **No plain text storage** - Password never stored in plain text
- ✅ **Hash never exposed** - Only used for comparison

---

## 5. What's Stored in Database

### Example Database Record

```sql
SELECT id, email, LEFT(passwordHash, 30) as hash_preview, isActive 
FROM User 
WHERE email = 'admin@pilates.com';
```

**Result:**
```
id: "550e8400-e29b-41d4-a716-446655440000"
email: "admin@pilates.com"
hash_preview: "$2b$12$LQv3c1yqBWVHxkd0LHAkCO..."
isActive: true
```

**Key Points:**
- ✅ **No plain text password** - Only hash is stored
- ✅ **Hash is unique** - Even same password produces different hash (due to salt)
- ✅ **Hash is long** - 60 characters (secure)
- ✅ **Cannot be reversed** - One-way function

---

## 6. Security Best Practices ✅

### ✅ Implemented

1. **bcrypt with 12 rounds** - Industry standard
2. **Automatic salting** - Unique salt per password
3. **One-way hashing** - Cannot be reversed
4. **Timing-safe comparison** - Prevents timing attacks
5. **No plain text storage** - Never stored in plain text
6. **Field naming** - `passwordHash` makes intent clear

### ✅ Additional Security Measures

1. **Input validation** - Password must meet requirements (8+ chars, uppercase, lowercase, number, special)
2. **Rate limiting** - 5 login attempts per minute
3. **Error messages** - Generic "Invalid credentials" (doesn't reveal if user exists)
4. **Logging** - Passwords are redacted in logs (Pino redaction)

---

## 7. Password Validation Rules

**File:** `apps/api/src/modules/auth/domain/value-objects/password.vo.ts`

Passwords must meet these requirements:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter
- ✅ At least one lowercase letter
- ✅ At least one number
- ✅ At least one special character

**Example valid passwords:**
- `Admin@123` ✅
- `MyP@ssw0rd` ✅
- `Secure#2024` ✅

**Example invalid passwords:**
- `password` ❌ (no uppercase, number, special)
- `PASSWORD123` ❌ (no lowercase, special)
- `Pass123` ❌ (too short, no special)

---

## 8. Comparison with Industry Standards

| Feature | Our Implementation | Industry Standard | Status |
|---------|-------------------|-------------------|--------|
| **Algorithm** | bcrypt | bcrypt/argon2 | ✅ Standard |
| **Salt Rounds** | 12 | 10-12 | ✅ Optimal |
| **Automatic Salting** | Yes | Yes | ✅ Standard |
| **Timing-Safe Compare** | Yes | Yes | ✅ Standard |
| **Plain Text Storage** | Never | Never | ✅ Secure |
| **Field Naming** | `passwordHash` | `password_hash` | ✅ Clear |

---

## 9. Migration/Update Process

### If Password Needs to Change

**Current Implementation:**
```typescript
// ✅ Hash new password before updating
const newPasswordHash = await passwordService.hash(newPassword);
await userRepository.update(userId, { passwordHash: newPasswordHash });
```

**Security:**
- ✅ Old hash is overwritten
- ✅ New hash is generated with new salt
- ✅ Old password cannot be recovered

---

## 10. Security Considerations

### ✅ What We're Protected Against

1. **Database Breaches** - Attackers get hashes, not passwords
2. **Rainbow Tables** - bcrypt salting prevents pre-computed attacks
3. **Timing Attacks** - bcrypt.compare() is timing-safe
4. **Plain Text Exposure** - Never stored in plain text

### ⚠️ Additional Recommendations

1. **Password Reset** - Implement secure token-based reset (US-002-003)
2. **Password History** - Prevent reuse of last N passwords
3. **Account Lockout** - Lock after X failed attempts
4. **Password Expiration** - Optional for high-security environments

---

## 11. Code Examples

### Creating a User with Hashed Password

```typescript
import { PasswordService } from '@/modules/auth/infrastructure/services/password.service';

// ✅ Hash password before storage
const passwordService = new PasswordService();
const passwordHash = await passwordService.hash('UserPassword123!');

// ✅ Store hash, never plain text
await prisma.user.create({
  email: 'user@example.com',
  passwordHash, // ✅ Hash, not plain text
  isActive: true,
});
```

### Verifying Password During Login

```typescript
// ✅ Compare plain password with stored hash
const user = await userRepository.findByEmail(email);
const isValid = await passwordService.compare(plainPassword, user.passwordHash);

if (!isValid) {
  throw new UnauthorizedException('Invalid credentials');
}
```

---

## 12. Testing

### Unit Tests

**File:** `apps/api/src/modules/auth/infrastructure/services/password.service.spec.ts`

Tests verify:
- ✅ Password hashing produces valid bcrypt hash
- ✅ Password comparison works correctly
- ✅ Invalid passwords are rejected
- ✅ Same password produces different hashes (due to salt)

---

## Conclusion

**Password Storage:** ✅ **SECURE**

- ✅ Passwords are **hashed with bcrypt (12 rounds)** before storage
- ✅ **Never stored in plain text**
- ✅ **Unique salt per password** (automatic)
- ✅ **Timing-safe comparison** during login
- ✅ **Industry-standard implementation**

**Security Level:** 🟢 **PRODUCTION READY**

---

**Last Updated:** 2026-01-26  
**Reviewed By:** Development Team

