export interface CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber?: string;
    avatar?: string;
    roles?: string[];
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
    isActive?: boolean;
    roles?: string[];
}

export interface UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    phoneNumber?: string;
    avatar?: string;
    lastLoginAt?: Date;
    roles?: string[];
    createdAt: Date;
    updatedAt: Date;
}