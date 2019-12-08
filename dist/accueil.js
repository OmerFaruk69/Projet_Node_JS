"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var app = express_1.default();
var port = process.env.PORT || '8080';
app.use(express_1.default.static(path_1.default.join(__dirname, '/../public')));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded());
app.set('views', path_1.default.join(__dirname, '/../view'));
app.set('view engine', 'ejs');
app.get('/', function (req, res) { return res.render('accueil.ejs'); });
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/signup', function (req, res) {
    res.render('signup');
});
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !!!');
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
