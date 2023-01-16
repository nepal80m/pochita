
import * as jwt from 'jsonwebtoken';

const SECRET_KEY = 'this is a very very secret key!';
interface TokenPayloadInterface {
    username: string;
    id: number;

}
const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        console.log(`Verifying token: ${token}`)
        if (token) {
            token = token.split(' ')[1];
            let user = jwt.verify(token, SECRET_KEY) as TokenPayloadInterface;
            req.userId = user.id;
        }
        else {
            res.status(401).json({ message: "Unauthorized" });
        }
        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Unauthorized" });
    }
}

export default auth;