"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../database/models/userModel"));
class AuthController {
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // async method vayepaxi hami le return type Promise<void> nai hunxa.
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                res.status(400).json({
                    message: "please provide username,email,password"
                });
                return;
            }
            yield userModel_1.default.create({
                username: username, //key valur pair same xa vanepaxi {username,password,email} lekda ni hunxa.
                email: email,
                password: password
            });
            res.status(200).json({
                message: "user registered"
            });
        });
    }
}
// const AuthControllers = new AuthController      //yo chai instance tarika le export gareko
// export default AuthControllers                   instatic instance garne maan chaina 
//vane mathi register method ma public satic aagdhi lekdine.
exports.default = AuthController;
