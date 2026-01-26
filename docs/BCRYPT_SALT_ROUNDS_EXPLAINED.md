# Understanding bcrypt Salt Rounds

**Date:** 2026-01-26  
**Topic:** bcrypt Cost Factor / Salt Rounds Explained

---

## What are Salt Rounds?

**Salt rounds** (also called **cost factor** or **work factor**) in bcrypt determine how many times the hashing algorithm will be executed. It's a security parameter that controls the computational cost of hashing passwords.

---

## Simple Explanation

Think of salt rounds like **security levels**:

- **Low rounds (4-6):** Fast to compute, but easier to crack
- **Medium rounds (8-10):** Balanced security and speed
- **High rounds (12-14):** Very secure, but slower to compute
- **Very high rounds (15+):** Maximum security, but may be too slow

**In our system:** We use **12 rounds** - the industry standard for production applications.

---

## How Salt Rounds Work

### The Math Behind It

The number of rounds is actually **2^rounds** iterations:

```
Rounds = 12
Actual iterations = 2^12 = 4,096 times
```

So with 12 rounds, bcrypt performs the hashing algorithm **4,096 times**.

### Example Process

```typescript
// User password: "Admin@123"
// Salt rounds: 12

// Step 1: Generate random salt
salt = generateRandomSalt()

// Step 2: Hash password 2^12 = 4,096 times
hash = password
for (let i = 0; i < 4096; i++) {
  hash = bcrypt_algorithm(hash + salt)
}

// Step 3: Store: $2b$12$[salt][hash]
```

---

## Why Salt Rounds Matter

### 1. **Security Against Brute Force Attacks**

**Without salt rounds (or low rounds):**
- Attacker can try millions of passwords per second
- Easy to crack weak passwords

**With high salt rounds (12):**
- Each password attempt takes ~300ms
- Attacker can only try ~3 passwords per second
- Makes brute force attacks impractical

### 2. **Protection Against Rainbow Tables**

**Rainbow tables** are pre-computed hash tables for common passwords.

**With unique salt per password:**
- Even if two users have the same password, they get different hashes
- Rainbow tables become useless (would need table for every possible salt)

**Example:**
```
User 1 password: "Admin@123"
Hash: $2b$12$abc123...xyz789

User 2 password: "Admin@123" (same password!)
Hash: $2b$12$def456...uvw012 (different hash!)
```

### 3. **Future-Proofing**

As computers get faster, you can increase rounds:
- **2010:** 10 rounds was standard
- **2020:** 12 rounds is standard
- **2030:** 14 rounds might be standard

---

## Salt Rounds vs Performance

### Trade-off

| Rounds | Iterations | Time (approx) | Security | Use Case |
|--------|------------|--------------|----------|----------|
| 4 | 16 | < 1ms | ⚠️ Low | Development only |
| 8 | 256 | ~10ms | ✅ Good | Low-security apps |
| 10 | 1,024 | ~50ms | ✅ Good | Most applications |
| **12** | **4,096** | **~300ms** | ✅✅ **Excellent** | **Production (our choice)** |
| 14 | 16,384 | ~1.2s | ✅✅ Excellent | High-security apps |
| 16 | 65,536 | ~5s | ✅✅✅ Maximum | Banking, government |

### Why 12 Rounds?

**Our choice: 12 rounds**

✅ **Security:** Very strong protection against brute force  
✅ **Performance:** ~300ms per hash (acceptable for login)  
✅ **Industry Standard:** Recommended by OWASP, NIST  
✅ **Future-Proof:** Will remain secure for years

**Trade-off:**
- Login takes ~300ms longer (user won't notice)
- Registration takes ~300ms longer (one-time, acceptable)
- Security gain is significant

---

## How Salt Rounds Work in bcrypt

### The bcrypt Hash Format

```
$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5K5q5q5q5q5q
│  │  │  └─────────────────────────────────────────────────┐
│  │  │                                                      │
│  │  └─ Salt Rounds (12)                                    │
│  └─ Algorithm Version (2b = bcrypt)                       │
└─ Format Identifier ($)                                     │
                                                              │
                                                              └─ Hash (31 chars)
```

**Breaking it down:**
- `$2b$` - bcrypt algorithm identifier
- `12` - **Salt rounds (cost factor)**
- Next 22 chars - Random salt
- Last 31 chars - Hashed password

### Code Example

```typescript
import * as bcrypt from 'bcrypt';

// Hash with 12 rounds
const password = 'Admin@123';
const hash = await bcrypt.hash(password, 12);
// Result: "$2b$12$LQv3c1yqBWVHxkd0LHAkCO..."

// The "12" in the hash means:
// - Use 12 salt rounds
// - Perform 2^12 = 4,096 iterations
// - Takes ~300ms to compute
```

---

## Visual Example

### Low Rounds (4) - Fast but Insecure

```
Password: "Admin@123"
Rounds: 4
Iterations: 16
Time: < 1ms
Security: ⚠️ Weak
```

**Problem:** Attacker can try 1,000,000 passwords/second

### Our Choice (12) - Balanced

```
Password: "Admin@123"
Rounds: 12
Iterations: 4,096
Time: ~300ms
Security: ✅✅ Strong
```

**Result:** Attacker can only try ~3 passwords/second

### Very High Rounds (16) - Maximum Security

```
Password: "Admin@123"
Rounds: 16
Iterations: 65,536
Time: ~5 seconds
Security: ✅✅✅ Maximum
```

**Problem:** Too slow for user experience (5 second login!)

---

## Real-World Impact

### Attack Scenario

**Attacker trying to crack password "Admin@123":**

**With 4 rounds:**
- Can try 1,000,000 passwords/second
- Finds password in: **< 1 second** ⚠️

**With 12 rounds (our choice):**
- Can try ~3 passwords/second
- Finds password in: **~333,333 seconds = ~92 hours** ✅

**With 16 rounds:**
- Can try ~0.2 passwords/second
- Finds password in: **~5,000,000 seconds = ~58 days** ✅✅

---

## Why Not Higher Rounds?

### Performance Considerations

**12 rounds:**
- Login: ~300ms (user doesn't notice)
- Registration: ~300ms (one-time, acceptable)
- ✅ Good balance

**16 rounds:**
- Login: ~5 seconds (user will notice!)
- Registration: ~5 seconds (frustrating)
- ⚠️ Too slow for good UX

**Rule of thumb:**
- **< 200ms:** User doesn't notice
- **200-500ms:** Acceptable
- **> 1 second:** User notices delay
- **> 5 seconds:** Poor UX

---

## Industry Standards

### Recommendations by Organization

| Organization | Recommended Rounds | Year |
|--------------|-------------------|------|
| **OWASP** | 10-12 | 2024 |
| **NIST** | 10-12 | 2023 |
| **BCrypt Authors** | 10-12 | Current |
| **Our Implementation** | **12** | **2026** |

### Historical Evolution

- **2000s:** 8 rounds was standard
- **2010s:** 10 rounds became standard
- **2020s:** 12 rounds is standard
- **2030s:** 14 rounds might become standard

**Why increase?**
- Computers get faster
- Attackers get more powerful
- Need to stay ahead

---

## How to Choose Salt Rounds

### Decision Matrix

**Choose 10 rounds if:**
- Low-security application
- Need fast performance
- Not handling sensitive data

**Choose 12 rounds (our choice) if:**
- Production application ✅
- Standard security requirements ✅
- Good balance of security/performance ✅

**Choose 14 rounds if:**
- High-security application (banking, healthcare)
- Can tolerate 1-2 second delays
- Handling sensitive financial/medical data

**Never use < 10 rounds in production!**

---

## Testing Salt Rounds

### Performance Test

```typescript
import * as bcrypt from 'bcrypt';

async function testRounds() {
  const password = 'TestPassword123!';
  
  for (const rounds of [8, 10, 12, 14, 16]) {
    const start = Date.now();
    await bcrypt.hash(password, rounds);
    const time = Date.now() - start;
    console.log(`Rounds ${rounds}: ${time}ms`);
  }
}

// Results (approximate):
// Rounds 8:  ~50ms
// Rounds 10: ~100ms
// Rounds 12: ~300ms  ← Our choice
// Rounds 14: ~1200ms
// Rounds 16: ~5000ms
```

---

## Security Best Practices

### ✅ What We're Doing Right

1. **12 rounds** - Industry standard ✅
2. **Automatic salting** - Unique salt per password ✅
3. **Timing-safe comparison** - Prevents timing attacks ✅
4. **No plain text storage** - Always hashed ✅

### 💡 Future Considerations

1. **Monitor performance** - If login becomes too slow, consider optimization
2. **Stay updated** - As standards evolve, consider increasing rounds
3. **Test regularly** - Verify hashing performance in production

---

## Common Misconceptions

### ❌ "More rounds = always better"

**Reality:** More rounds = more security BUT slower performance. Need balance.

### ❌ "Salt rounds = number of times password is hashed"

**Reality:** It's 2^rounds iterations, not just "rounds" iterations.

### ❌ "I can use low rounds for development"

**Reality:** Use same rounds everywhere to catch performance issues early.

---

## Summary

### Key Takeaways

1. **Salt rounds = security level** (higher = more secure but slower)
2. **12 rounds = industry standard** (our choice)
3. **2^12 = 4,096 iterations** (actual computation)
4. **~300ms per hash** (acceptable performance)
5. **Protects against brute force** (makes attacks impractical)

### Our Implementation

```typescript
// ✅ Industry standard
private readonly SALT_ROUNDS = 12;

// ✅ Secure hashing
async hash(password: string): Promise<string> {
  return bcrypt.hash(password, this.SALT_ROUNDS);
}
```

**Result:**
- ✅ Strong security
- ✅ Good performance
- ✅ Industry standard
- ✅ Production ready

---

## References

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [bcrypt Wikipedia](https://en.wikipedia.org/wiki/Bcrypt)

---

**Last Updated:** 2026-01-26  
**Current Implementation:** 12 salt rounds (industry standard)

