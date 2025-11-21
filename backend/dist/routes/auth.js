"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        error: 'Too many registration attempts, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
router.post('/register', registerLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/profile', auth_1.authenticate, authController.getProfile);
router.put('/profile', auth_1.authenticate, authController.updateProfile);
router.post('/change-password', auth_1.authenticate, authController.changePassword);
router.post('/logout', auth_1.authenticate, authController.logout);
exports.default = router;
//# sourceMappingURL=auth.js.map