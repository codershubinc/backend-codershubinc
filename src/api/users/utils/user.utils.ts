import { User, UserDocument } from '../models/user.model';
import { UserResponseDto } from '../models/user.dto';

/**
 * Utility functions for user operations
 */
export class UserUtils {
    /**
     * Transform user document to response DTO (excludes sensitive data like password)
     */
    static toResponseDto(user: UserDocument): UserResponseDto {
        return {
            id: (user._id as any).toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            lastLoginAt: user.lastLoginAt,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    /**
     * Get user's full name
     */
    static getFullName(user: User): string {
        return `${user.firstName} ${user.lastName}`.trim();
    }

    /**
     * Check if user has a specific role
     */
    static hasRole(user: User, role: string): boolean {
        return user.roles?.includes(role) ?? false;
    }

    /**
     * Check if user has any of the specified roles
     */
    static hasAnyRole(user: User, roles: string[]): boolean {
        if (!user.roles || user.roles.length === 0) {
            return false;
        }
        return roles.some(role => user.roles!.includes(role));
    }

    /**
     * Validate email format
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone number format (basic validation)
     */
    static isValidPhoneNumber(phoneNumber: string): boolean {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phoneNumber);
    }

    /**
     * Generate user initials for avatar placeholder
     */
    static getInitials(user: User): string {
        const firstInitial = user.firstName.charAt(0).toUpperCase();
        const lastInitial = user.lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    }

    /**
     * Check if user account is active and not expired
     */
    static isAccountActive(user: User): boolean {
        return user.isActive;
    }

    /**
     * Format last login time
     */
    static formatLastLogin(user: User): string | null {
        if (!user.lastLoginAt) {
            return null;
        }

        const now = new Date();
        const lastLogin = new Date(user.lastLoginAt);
        const diffInMs = now.getTime() - lastLogin.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else {
            return lastLogin.toLocaleDateString();
        }
    }

    /**
     * Sanitize user input by trimming and converting to lowercase where appropriate
     */
    static sanitizeUserInput(input: {
        email?: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    }): typeof input {
        return {
            ...input,
            email: input.email?.trim().toLowerCase(),
            firstName: input.firstName?.trim(),
            lastName: input.lastName?.trim(),
            phoneNumber: input.phoneNumber?.trim(),
        };
    }
}