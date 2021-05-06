const functions = require("firebase-functions").region('europe-west2');
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

// exports.updateDog = functions.https.onCall(async (data, context) => {
//     // De context die hier wordt meegestuurd is afkomstig van de client. De permissies voor deze gebruiker kunnen echter gewijzigd zijn.
//     // Daarom met het email adres uit de context de user eerst fetchen en daarvan de rechten checken.
//     const requestingUser = await admin.auth().getUserByEmail(context.auth.token.email).catch(() => {
//         throw new functions.https.HttpsError('not-found', 'Unable to check your permissions. Try again later');
//     })

//     // Checken of de user de teamcaptain van het team is
//     if (requestingUser.uid === data.team.creator) {
//         throw new functions.https.HttpsError('permission-denied', 'Only the teamcaptain of this team can perform an update')
//     }

//     // De nieuwe dogs zijn nu niet beschikbaar meer om te selecteren voor een ander team
//     data.team.newDogs.forEach(async dog => {
//         await admin.firestore().collection("dogs").doc(dog).update({
//             availableForTeam: false
//         });
//     })
//     // De verwijderde dogs zijn nu weer beschikbaar meer om te selecteren
//     data.team.removedDogs.forEach(async dog => {
//         await admin.firestore().collection("dogs").doc(dog).update({
//             availableForTeam: true
//         });
//     })

//     // Team document updaten
//     let team = data.team
//     return admin.firestore().collection('teams').add(team).then(() => {
//         console.log(`Success! Team ${team.name} has been created succesfully.`);
//     }).catch(err => {
//         console.log(err)
//         throw new functions.https.HttpsError('unknown', 'Error creating team')
//     })
// })


// exports.subscribeTeam = functions.https.onCall(async (data, context) => {
//     // De context die hier wordt meegestuurd is afkomstig van de client. De permissies voor deze gebruiker kunnen echter gewijzigd zijn.
//     // Daarom met het email adres uit de context de user eerst fetchen en daarvan de rechten checken.
//     const requestingUser = await admin.auth().getUserByEmail(context.auth.token.email).catch(() => {
//         throw new functions.https.HttpsError('not-found', 'Unable to check your permissions. Try again later');
//     })

//     // Checken of de user tenminste teamcaptain is.
//     if (requestingUser.customClaims.permissionLevel < 2) {
//         throw new functions.https.HttpsError('permission-denied', 'You have to be at least teamcaptain to subscribe a team')
//     }

//     // Vanaf dit punt is er aan de voorwaarden voldaan om een team in te mogen schrijven.
//     // De dogs zijn nu niet beschikbaar meer om te selecteren voor een ander team
//     data.team.dogs.forEach(async dog => {
//         await admin.firestore().collection("dogs").doc(dog).update({
//             availableForTeam: false
//         });
//     })

//     // Team document aanmaken
//     let team = data.team
//     team.creator = context.auth.token.uid
//     return admin.firestore().collection('teams').add(team).then(() => {
//         console.log(`Success! Team ${team.name} has been created succesfully.`);
//     }).catch(err => {
//         console.log(err)
//         throw new functions.https.HttpsError('unknown', 'Error creating team')
//     })
// })

// exports.imageUploaded = functions.storage.object().onFinalize(object => {
//     console.log("IMAGE GEUPLOAD")
//     console.log("object.contentType: " + object.contentType)
//     console.log("object.resizedImage: " + object.resizedImage)
//     // if (object.resizedImage && object.contentType == 'image/jpeg'){
//     //     const downloadURL = object.selfLink + "?alt=media&token=" + object.firebaseStorageDownloadTokens
//     //     console.log("Download URL: " + downloadURL)
//     // }else{
//     //     console.log("Geen resized plaatje?")
//     // }
// });