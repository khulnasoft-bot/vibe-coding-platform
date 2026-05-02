import {
  validateSandboxId,
  validateFilePath,
  validatePort,
  validateArgs,
  sanitizeArgument,
} from '@/lib/security'

describe('Security Utilities', () => {
  describe('validateSandboxId', () => {
    it('should accept valid sandbox IDs', () => {
      expect(validateSandboxId('sbx_abc123xyz')).toBe(true)
      expect(validateSandboxId('sandbox-123')).toBe(true)
      expect(validateSandboxId('abc123_-')).toBe(true)
    })

    it('should reject invalid sandbox IDs', () => {
      expect(validateSandboxId('')).toBe(false)
      expect(validateSandboxId('ab')).toBe(false) // too short
      expect(validateSandboxId('a'.repeat(101))).toBe(false) // too long
      expect(validateSandboxId('sandbox/123')).toBe(false) // contains slash
      expect(validateSandboxId('sandbox 123')).toBe(false) // contains space
    })
  })

  describe('validateFilePath', () => {
    it('should accept valid file paths', () => {
      expect(validateFilePath('app/page.tsx')).toBe(true)
      expect(validateFilePath('src/components/Button.tsx')).toBe(true)
      expect(validateFilePath('package.json')).toBe(true)
    })

    it('should reject invalid file paths', () => {
      expect(validateFilePath('../secret.txt')).toBe(false) // directory traversal
      expect(validateFilePath('~/Documents/file.txt')).toBe(false) // tilde
      expect(validateFilePath('/etc/passwd')).toBe(false) // absolute path
      expect(validateFilePath('file\0.txt')).toBe(false) // null byte
    })
  })

  describe('validatePort', () => {
    it('should accept valid ports', () => {
      expect(validatePort(1)).toBe(true)
      expect(validatePort(3000)).toBe(true)
      expect(validatePort(65535)).toBe(true)
    })

    it('should reject invalid ports', () => {
      expect(validatePort(0)).toBe(false)
      expect(validatePort(65536)).toBe(false)
      expect(validatePort(-1)).toBe(false)
      expect(validatePort(1.5)).toBe(false)
    })
  })

  describe('validateArgs', () => {
    it('should accept valid arguments', () => {
      expect(validateArgs(['install', '--verbose'])).toBe(true)
      expect(validateArgs([])).toBe(true)
    })

    it('should reject invalid arguments', () => {
      expect(validateArgs('not an array' as any)).toBe(false)
      expect(validateArgs(new Array(51).fill('arg'))).toBe(false) // too many
    })
  })

  describe('sanitizeArgument', () => {
    it('should remove null bytes', () => {
      expect(sanitizeArgument('hello\0world')).toBe('helloworld')
      expect(sanitizeArgument('normal')).toBe('normal')
    })
  })
})
