const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addDefaultPermissions = functions.auth.user().onCreate(user => {
    // Deze functie wordt uitgevoerd wanneer er een nieuwe gebruiker gemaakt wordt.
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

exports.modifyPermissionLevel = functions.https.onCall((data, context) => {
    // Default admin
    const defaultAdmin = "robertjanbuddenbohmer@gmail.com";
    const emailOfUserToModify = data.email
    const newPermissionLevel = data.permissionLevel

    // Indien geen admin, dan meteen terug met een foutmelding
    if (context.auth.token.permissionLevel !== 3) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins are allowed to modify a user.')
        // return { error: "Only admins are allowed to modify a user" }
    }

    // Default admin kan niet aangepast worden
    if(emailOfUserToModify === defaultAdmin){
        throw new functions.https.HttpsError('permission-denied', 'You are not allowed to modify this user.')
        // return { error: "You are not allowed to modify this user" }
    }

    // Alleen mogelijke levels toekennen
    if(![1, 2, 3].includes(newPermissionLevel)){
        throw new functions.https.HttpsError('invalid-argument', 'Invalid permission level')
        // return { error: "Invalid permission level" }
    }   

    // User ophalen en nieuw permissie level toekennen
    return admin.auth().getUserByEmail(emailOfUserToModify).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            permissionLevel: newPermissionLevel,
        }).then(() => {
            console.log(`Success! ${user.email} has now permission level ${newPermissionLevel}.`);
            return {succes: newPermissionLevel}
        }).catch(err => {
            console.log(err);
            throw new functions.https.HttpsError('internal', 'Something went wrong, try again later.')
            // return { error: `Modifying failed: ${err}` }
        });
    }).catch(err => {
        console.log(err)
        throw new functions.https.HttpsError('not-found', 'This user no longer exists.');
    })    
})
