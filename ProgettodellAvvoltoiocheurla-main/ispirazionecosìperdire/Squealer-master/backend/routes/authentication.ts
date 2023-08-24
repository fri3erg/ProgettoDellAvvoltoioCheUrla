import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import passport = require("passport");
import userModel from "../database/models/users.model";
import {
  getAllUsers,
  createDefaultUser,
  createUserUsingGoogle,
  updatePassword,
  updateResetToken,
} from "../database/querys/users";
import express from "express";
import bcrypt from "bcryptjs";
import { sendMail } from "../util/mail";
import { config } from "dotenv";
import { generate } from "randomstring";
import { Success, SuccessCode, SuccessDescription } from "../util/success";
config();

export const router = express.Router();

/**
 * Autenticazione tramite google
 */
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      userModel.findOne({ serviceId: profile.id }).then((currentUser: any) => {
        if (!currentUser) {
          //Utente non registrato, lo creo
          createUserUsingGoogle(
            profile.displayName,
            profile.displayName,
            profile._json.email,
            profile.id,
            profile._json.picture,
          ).then((newUser) => {
            done(null, newUser);
          });
        } else {
          done(null, currentUser);
        }
      });
    },
  ),
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  },
);

/**
 * Autenticazione locale
 */
// passport.use(
//   new LocalStrategy.Strategy((username, password, done) => {
//     userModel.findOne({ mail: username }, async (err: any, user: any) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!(await bcrypt.compare(password, user.password))) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   }),
// );
passport.use(
  new LocalStrategy.Strategy(async (username, password, done) => {
    try {
      const user = await userModel.findOne({ mail: username }).exec();

      if (!user) {
        return done(null, false);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password!);
      if (!isPasswordValid) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

/**
 * Strategia per la registrazione locale
 */
passport.use(
  "local-signup",
  new LocalStrategy.Strategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ username: username }).exec();

        if (user) {
          return done(null, false);
        } else {
          const encryptedPassword = await bcrypt.hash(password, 10);
          const newUser = await createDefaultUser(
            req.body.name,
            username,
            req.body.mail,
            encryptedPassword,
          );
          if (newUser) {
            return done(null, newUser);
          } else {
            return done(null, false);
          }
        }
      } catch (err) {
        return done(err);
      }
    },
  ),
);

router.post("/login", passport.authenticate("local"), function (req, res) {
  if (req.user) {
    res.send(new Success(SuccessDescription.logged_in, SuccessCode.logged_in));
  }
});
//TODO return value
router.post("/register", passport.authenticate("local-signup"), (req, res) => {
  res.json();
});

passport.deserializeUser((id, done) => {
  userModel.findById(id).then((user: any) => {
    done(null, user);
  });
});

passport.serializeUser((user: any, cb) => {
  process.nextTick(() => {
    return cb(null, user.id);
  });
});

/**
 * Logout
 */
router.get("/logout", (req, res, next) => {
  try {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).redirect("/");
    });
  } catch (error: any) {
    res.send({ errorName: error.name, errorDescription: error.message });
  }
});
router
  .route("/forgotPassword")
  /**
   * Genero un token e lo invio per mail all'utente
   */
  .get(async (req, res) => {
    //TODO separare funzioni
    const mail: any = req.query.mail;
    const token: string = generate();
    console.log(token);

    await sendMail(token, mail).then(async () => {
      await updateResetToken(mail, token).finally(() => {
        res.sendStatus(200);
      });
    });
  })
  /**
   * controllo se il token inserito dall'utente è uguale a quello del server e aggiorno la password
   */
  .post(async (req, res) => {
    const token: any = req.body.token;
    const mail: any = req.query.mail;
    const user: any = await userModel.findOne({ mail: mail });

    const password: any = req.query.password;
    if (token === user.resetToken) {
      await updatePassword(mail, password);
    }
  });

router.route("/").get(async (req, res) => {
  try {
    const users = await getAllUsers();
    console.log(req.user);
    res.send(users);
  } catch (error: any) {
    res.send({ errorName: error.name, errorDescription: error.message });
  }
});
