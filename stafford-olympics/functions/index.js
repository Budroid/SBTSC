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

exports.listUsers = functions.https.onCall(async (data, context) => {

    // console.log("Requesting user" + JSON.stringify(context.auth.token.email))

    const requestingUser = await admin.auth().getUserByEmail(context.auth.token.email).catch(() => {
        throw new functions.https.HttpsError('not-found', 'Unable to check your permissions. Try again later');
    })

    if (requestingUser.customClaims.permissionLevel !== 3) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins are allowed to list the users.')
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
        .catch(() => {
            throw new functions.https.HttpsError('unknown', 'Error listing users')
        });
})

exports.modifyPermissionLevel = functions.https.onCall(async (data, context) => {
    // Default admin
    const defaultAdmin = "robertjanbuddenbohmer@gmail.com";
    const emailOfUserToModify = data.email
    const newPermissionLevel = data.permissionLevel

    // Default admin kan niet aangepast worden
    if (emailOfUserToModify === defaultAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not allowed to modify this user.')
    }

    // Alleen mogelijke levels toegestaan
    if (![1, 2, 3].includes(newPermissionLevel)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid permission level')
    }

    // De context die hier wordt meegestuurd is afkomstig van de client. De permissies voor deze gebruiker kunnen echter gewijzigd zijn.
    // Daarom met het email adres uit de context de user eerst fetchen en daarvan de rechten checken.
    const requestingUser = await admin.auth().getUserByEmail(context.auth.token.email).catch(() => {
        throw new functions.https.HttpsError('not-found', 'Unable to check your permissions. Try again later');
    })

    // Indien geen admin, dan meteen terug met een foutmelding
    if (requestingUser.customClaims.permissionLevel !== 3) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins are allowed to modify a user.')
    }

    // User ophalen en nieuw permissie level toekennen
    const targetUser = await admin.auth().getUserByEmail(emailOfUserToModify).catch(() => {
        throw new functions.https.HttpsError('not-found', 'Unable to find this user');
    })

    return admin.auth().setCustomUserClaims(targetUser.uid, {
        permissionLevel: newPermissionLevel,
    }).then(() => {
        console.log(`Success! ${targetUser.email} has now permission level ${newPermissionLevel}.`);
        return { permissionLevel: newPermissionLevel }
    }).catch(err => {
        console.log(err);
        throw new functions.https.HttpsError('cancelled', 'Modifying failed.')
    });


})
