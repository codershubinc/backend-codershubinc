import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './models';
import type { CreateUserDto, UpdateUserDto, UserResponseDto } from './models';
import { UserUtils, PasswordUtils } from './utils';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        // Sanitize input
        const sanitizedInput = UserUtils.sanitizeUserInput(createUserDto);

        // Validate email format
        if (!UserUtils.isValidEmail(sanitizedInput.email!)) {
            throw new Error('Invalid email format');
        }

        // Validate password strength
        const passwordValidation = PasswordUtils.validatePasswordStrength(createUserDto.password);
        if (!passwordValidation.isValid) {
            throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
        }

        // Hash password
        const hashedPassword = await PasswordUtils.hashPassword(createUserDto.password);

        const createdUser = new this.userModel({
            ...sanitizedInput,
            password: hashedPassword,
        });

        const savedUser = await createdUser.save();
        return UserUtils.toResponseDto(savedUser);
    }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userModel.find().exec();
        return users.map(user => UserUtils.toResponseDto(user));
    }

    async findOne(id: string): Promise<UserResponseDto | null> {
        const user = await this.userModel.findById(id).exec();
        return user ? UserUtils.toResponseDto(user) : null;
    }

    async findByEmail(email: string): Promise<UserResponseDto | null> {
        const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
        return user ? UserUtils.toResponseDto(user) : null;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto | null> {
        // Sanitize input
        const sanitizedInput = UserUtils.sanitizeUserInput(updateUserDto);

        // Validate email if provided
        if (sanitizedInput.email && !UserUtils.isValidEmail(sanitizedInput.email)) {
            throw new Error('Invalid email format');
        }

        const user = await this.userModel.findByIdAndUpdate(id, sanitizedInput, { new: true }).exec();
        return user ? UserUtils.toResponseDto(user) : null;
    }

    async remove(id: string): Promise<UserResponseDto | null> {
        const user = await this.userModel.findByIdAndDelete(id).exec();
        return user ? UserUtils.toResponseDto(user) : null;
    }

    async updateLastLogin(id: string): Promise<UserResponseDto | null> {
        const user = await this.userModel.findByIdAndUpdate(
            id,
            { lastLoginAt: new Date() },
            { new: true }
        ).exec();
        return user ? UserUtils.toResponseDto(user) : null;
    }

    /**
     * Verify user password for authentication
     */
    async verifyPassword(email: string, password: string): Promise<UserResponseDto | null> {
        const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
        if (!user) {
            return null;
        }

        const isPasswordValid = await PasswordUtils.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return UserUtils.toResponseDto(user);
    }

    /**
     * Change user password
     */
    async changePassword(id: string, oldPassword: string, newPassword: string): Promise<UserResponseDto | null> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            return null;
        }

        // Verify old password
        const isOldPasswordValid = await PasswordUtils.comparePassword(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Validate new password strength
        const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
        }

        // Hash new password
        const hashedPassword = await PasswordUtils.hashPassword(newPassword);

        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        ).exec();

        return updatedUser ? UserUtils.toResponseDto(updatedUser) : null;
    }
}