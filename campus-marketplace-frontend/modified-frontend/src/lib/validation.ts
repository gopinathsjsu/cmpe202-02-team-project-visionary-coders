import { z } from 'zod';

// List of valid college email domains
const VALID_COLLEGE_DOMAINS = [
  'sjsu.edu',
  'stanford.edu',
  'berkeley.edu',
  'ucla.edu',
  'usc.edu',
  // Add more college domains as needed
];

// Email validation schema that only allows college emails
export const collegeEmailSchema = z
  .string()
  .email('Invalid email address')
  .refine(
    (email) => {
      const domain = email.split('@')[1]?.toLowerCase();
      return VALID_COLLEGE_DOMAINS.some(collegeDomain =>
        domain === collegeDomain || domain?.endsWith(`.${collegeDomain}`)
      );
    },
    {
      message: `Email must be from a valid college domain (${VALID_COLLEGE_DOMAINS.join(', ')})`,
    }
  );

// Sign up validation schema
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: collegeEmailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  role: z.enum(['buyer', 'seller', 'admin']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Sign in validation schema
export const signInSchema = z.object({
  email: collegeEmailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

// Utility function to check if email is from a college domain
export const isCollegeEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return VALID_COLLEGE_DOMAINS.some(collegeDomain =>
    domain === collegeDomain || domain?.endsWith(`.${collegeDomain}`)
  );
};

// Get the college domain from an email
export const getCollegeDomain = (email: string): string | null => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain || null;
};
