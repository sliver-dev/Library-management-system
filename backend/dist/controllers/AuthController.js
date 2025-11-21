"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const validation_1 = require("../utils/validation");
const validationSchemas_1 = require("../utils/validationSchemas");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const { error, value } = (0, validation_1.validate)(validationSchemas_1.registerSchema, req.body);
                if (error) {
                    res.status(400).json({
                        success: false,
                        error: 'Validation failed',
                        details: error.details,
                    });
                    return;
                }
                const user = await this.authService.createUser(value);
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            role: user.role,
                        },
                    },
                });
            }
            catch (error) {
                console.error('Registration error:', error);
                if (error instanceof Error) {
                    if (error.message.includes('already exists')) {
                        res.status(409).json({
                            success: false,
                            error: error.message,
                        });
                        return;
                    }
                    res.status(400).json({
                        success: false,
                        error: error.message,
                    });
                    return;
                }
                res.status(500).json({
                    success: false,
                    error: 'Registration failed',
                });
            }
        };
        this.login = async (req, res) => {
            try {
                const { error, value } = (0, validation_1.validate)(validationSchemas_1.loginSchema, req.body);
                if (error) {
                    res.status(400).json({
                        success: false,
                        error: 'Validation failed',
                        details: error.details,
                    });
                    return;
                }
                const { user, tokens } = await this.authService.authenticateUser(value);
                res.json({
                    success: true,
                    message: 'Login successful',
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            role: user.role,
                        },
                        tokens,
                    },
                });
            }
            catch (error) {
                console.error('Login error:', error);
                if (error instanceof Error) {
                    if (error.message.includes('Invalid') || error.message.includes('banned')) {
                        res.status(401).json({
                            success: false,
                            error: error.message,
                        });
                        return;
                    }
                    res.status(400).json({
                        success: false,
                        error: error.message,
                    });
                    return;
                }
                res.status(500).json({
                    success: false,
                    error: 'Login failed',
                });
            }
        };
        this.refreshToken = async (req, res) => {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    res.status(400).json({
                        success: false,
                        error: 'Refresh token is required',
                    });
                    return;
                }
                const { accessToken } = await this.authService.refreshToken(refreshToken);
                res.json({
                    success: true,
                    data: {
                        accessToken,
                    },
                });
            }
            catch (error) {
                console.error('Token refresh error:', error);
                if (error instanceof Error) {
                    res.status(401).json({
                        success: false,
                        error: error.message,
                    });
                    return;
                }
                res.status(500).json({
                    success: false,
                    error: 'Token refresh failed',
                });
            }
        };
        this.getProfile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        error: 'User not authenticated',
                    });
                    return;
                }
                res.json({
                    success: true,
                    data: {
                        user: req.user,
                    },
                });
            }
            catch (error) {
                console.error('Get profile error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to get profile',
                });
            }
        };
        this.updateProfile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        error: 'User not authenticated',
                    });
                    return;
                }
                const { first_name, last_name, phone, address } = req.body;
                const updatedUser = await this.authService.updateUser(req.user.id, {
                    first_name,
                    last_name,
                    phone,
                    address,
                });
                res.json({
                    success: true,
                    message: 'Profile updated successfully',
                    data: {
                        user: updatedUser,
                    },
                });
            }
            catch (error) {
                console.error('Update profile error:', error);
                if (error instanceof Error) {
                    res.status(400).json({
                        success: false,
                        error: error.message,
                    });
                    return;
                }
                res.status(500).json({
                    success: false,
                    error: 'Failed to update profile',
                });
            }
        };
        this.changePassword = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        error: 'User not authenticated',
                    });
                    return;
                }
                const { error, value } = (0, validation_1.validate)(validationSchemas_1.changePasswordSchema, req.body);
                if (error) {
                    res.status(400).json({
                        success: false,
                        error: 'Validation failed',
                        details: error.details,
                    });
                    return;
                }
                const { currentPassword, newPassword } = value;
                await this.authService.changePassword(req.user.id, currentPassword, newPassword);
                res.json({
                    success: true,
                    message: 'Password changed successfully',
                });
            }
            catch (error) {
                console.error('Change password error:', error);
                if (error instanceof Error) {
                    res.status(400).json({
                        success: false,
                        error: error.message,
                    });
                    return;
                }
                res.status(500).json({
                    success: false,
                    error: 'Failed to change password',
                });
            }
        };
        this.logout = async (req, res) => {
            try {
                res.json({
                    success: true,
                    message: 'Logout successful',
                });
            }
            catch (error) {
                console.error('Logout error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Logout failed',
                });
            }
        };
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map