import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { validate } from '../utils/validation';
import { loginSchema, registerSchema, changePasswordSchema } from '../utils/validationSchemas';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = validate(registerSchema, req.body);
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
    } catch (error) {
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

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = validate(loginSchema, req.body);
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
    } catch (error) {
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

  refreshToken = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
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

  getProfile = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
      console.error('Get profile error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to get profile',
      });
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
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

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { error, value } = validate(changePasswordSchema, req.body);
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
    } catch (error) {
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

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // In a production environment, you would want to blacklist the token
      // For now, we'll just return a success message
      // The client should discard the tokens

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Logout error:', error);

      res.status(500).json({
        success: false,
        error: 'Logout failed',
      });
    }
  };
}