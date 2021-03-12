const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.addDefaultPermissions = functions.auth.user().onCreate(user => {
    // Default admin
    const defaultAdmin = "robertjanbuddenbohmer@gmail.com";
    // custom claim toevoegen voor permissie level
    const defaultPermissionLevel = user.email == defaultAdmin ? 3 : 1
    return admin.auth().setCustomUserClaims(user.uid, {
        permissionLevel: defaultPermissionLevel,
    }).then(() => {
        console.log(`Success! ${user.email} has now permission level ${defaultPermissionLevel}.`);
    }).catch(err => {
        console.log(err);
    });
});

exports.listUsers = functions.https.onCall((data, context) => {
    // Indien geen admin, dan meteen terug met een foutmelding
    if (context.auth.token.permissionLevel !== 3) {
        return { error: "Only admins are allowed to list the users" }
    }
    return admin
        .auth()
        .listUsers()
        .then((listUsersResult) => {
            let users = [];
            listUsersResult.users.forEach((userRecord) => {
                users.push(userRecord.toJSON())
            });
            return users;
        })
        .catch((error) => {
            console.log('Error listing users:', error);
            return error;
        });
})
