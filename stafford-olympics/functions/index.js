const globalFunctions = require("firebase-functions")
const functions = globalFunctions.region('europe-west2');
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

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
        throw new globalFunctions.https.HttpsError('not-found', 'Unable to check your permissions. Try again later');
    })

    if (requestingUser.customClaims.permissionLevel !== 3) {
        throw new globalFunctions.https.HttpsError('permission-denied', 'Only admins are allowed to list the users.')
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
            throw new globalFunctions.https.HttpsError('unknown', 'Error listing users')
        });
})

exports.modifyPermissionLevel = functions.https.onCall(async (data, context) => {
    // Default admin
    const defaultAdmin = "robertjanbuddenbohmer@gmail.com";
    const emailOfUserToModify = data.email
    const newPermissionLevel = data.permissionLevel

    // Default admin kan niet aangepast worden
    if (emailOfUserToModify === defaultAdmin) {
        throw new globalFunctions.https.HttpsError('permission-denied', 'You are not allowed to modify this user.')
    }

    // Alleen mogelijke levels toegestaan
    if (![1, 2, 3].includes(newPermissionLevel)) {
        throw new globalFunctions.https.HttpsError('invalid-argument', 'Invalid permission level')
    }

    // De context die hier wordt meegestuurd is afkomstig van de client. De permissies voor deze gebruiker kunnen echter gewijzigd zijn.
    // Daarom met het email adres uit de context de user eerst fetchen en daarvan de rechten checken.
    const requestingUser = await admin.auth().getUserByEmail(context.auth.token.email).catch(() => {
        throw new globalFunctions.https.HttpsError('not-found', 'Unable to check your permissions. Try again later');
    })

    // Indien geen admin, dan meteen terug met een foutmelding
    if (requestingUser.customClaims.permissionLevel !== 3) {
        throw new globalFunctions.https.HttpsError('permission-denied', 'Only admins are allowed to modify a user.')
    }

    // User ophalen en nieuw permissie level toekennen
    const targetUser = await admin.auth().getUserByEmail(emailOfUserToModify).catch(() => {
        throw new globalFunctions.https.HttpsError('not-found', 'Unable to find this user');
    })

    return admin.auth().setCustomUserClaims(targetUser.uid, {
        permissionLevel: newPermissionLevel,
    }).then(() => {
        console.log(`Success! ${targetUser.email} has now permission level ${newPermissionLevel}.`);
        return { permissionLevel: newPermissionLevel }
    }).catch(err => {
        console.log(err);
        throw new globalFunctions.https.HttpsError('cancelled', 'Modifying failed.')
    });
})

exports.startTournament = functions.https.onCall(async (data, context) => {
    // Gegevens van de aanvrager checken
    const requestingUser = await admin.auth().getUserByEmail(context.auth.token.email).catch(() => {
        throw new globalFunctions.https.HttpsError('not-found', 'Unable to check your permissions. Try again later');
    })

    if (requestingUser.customClaims.permissionLevel !== 3) {
        throw new globalFunctions.https.HttpsError('permission-denied', 'Only admins are allowed to start a tournament.')
    }

    const events = [
        { id: 1, name: "50 meter", units: "sec" },
        { id: 2, name: "100 meter", units: "sec" },
        { id: 3, name: "Powersprint", units: "sec" },
        { id: 4, name: "Long jump", units: "cm" },
        { id: 5, name: "High jump", units: "cm" },
        { id: 6, name: "Tug of war", units: "min" },
        { id: 7, name: "Hangtime", units: "min" },
        { id: 8, name: "A-Frame", units: "times" },
        { id: 9, name: "Trackmill", units: "times" },
        { id: 10, name: "10 Mile", units: "min" },
      ]

    // Voor elk event een "scoreformulier" per hond maken
    const batch = db.batch()
    const tournamentRef = db.collection('tournaments').doc(data.tournamentId)
    const resultsRef = tournamentRef.collection('results');

    // events.forEach(event => {
    //    let dogsWithResults = data.dogs.map(dog => ({
    //        dogId: dog,
    //        points: 0
    //    }))
    //    let eventResults = {
    //       dogs: dogsWithResults,
    //       meta: event 
    //    }
    //    const initialResultRef = eventsRef.doc() 
    //    batch.set(initialResultRef, eventResults)
    // })

    data.dogs.forEach(dogId => {
        let results = events.map(event => ({
            eventId: event.id,
            score: 0,
            points: 0
        }));
        let resultsforDog = {
            dogId: dogId,
            results: results
        }
        const initialResultRef = resultsRef.doc()
        batch.set(initialResultRef, resultsforDog)
    })

    return batch.commit().then(() => {
        // State van het tournament updaten naar "Active"
        return tournamentRef.update({
            state: { code: "act", text: "Active" },
        })
            .then(() => {
            }).catch(err => {
                throw new globalFunctions.https.HttpsError('unknown', err.message)
            })
    }).catch(error => {
        console.log(error)
        throw new globalFunctions.https.HttpsError('unknown', 'Creating scoresheet failed')
    });



})

exports.finishTournament = functions.https.onCall(async (data, context) => {
    // Gegevens van de aanvrager checken
    const requestingUser = await admin.auth().getUserByEmail(context.auth.token.email).catch(() => {
        throw new globalFunctions.https.HttpsError('not-found', 'Unable to check your permissions. Try again later');
    })

    if (requestingUser.customClaims.permissionLevel !== 3) {
        throw new globalFunctions.https.HttpsError('permission-denied', 'Only admins are allowed to finish a tournament.')
    }

    // State van het tournament updaten naar "Finished"
    return db.collection('tournaments').doc(data.tournamentId).update({
        state: { code: "fin", text: "Finished" },
    })
        .then(() => {
            console.log(`Tournament finished!.`);
        }).catch(err => {
            console.log(err)
            throw new globalFunctions.https.HttpsError('unknown', 'Error finishiing tournament')
        })
})


// exports.subscribeTeam = functions.https.onCall(async (data, context) => {
//     // De context die hier wordt meegestuurd is afkomstig van de client. De permissies voor deze gebruiker kunnen echter gewijzigd zijn.
//     // Daarom met het email adres uit de context de user eerst fetchen en daarvan de rechten checken.
//     const requestingUser = await admin.auth().getUserByEmail(context.auth.token.email).catch(() => {
//         throw new globalFunctions.https.HttpsError('not-found', 'Unable to check your permissions. Try again later');
//     })

//     // Checken of de user tenminste teamcaptain is.
//     if (requestingUser.customClaims.permissionLevel < 2) {
//         throw new globalFunctions.https.HttpsError('permission-denied', 'You have to be at least teamcaptain to subscribe a team')
//     }

//     // Vanaf dit punt is er aan de voorwaarden voldaan om een team in te mogen schrijven.
//     // De dogs zijn nu niet beschikbaar meer om te selecteren voor een ander team
//     data.team.dogs.forEach(async dog => {
//         await db.collection("dogs").doc(dog).update({
//             availableForTeam: false
//         });
//     })

//     // Team document aanmaken
//     let team = data.team
//     team.creator = context.auth.token.uid
//     return db.collection('teams').add(team).then(() => {
//         console.log(`Success! Team ${team.name} has been created succesfully.`);
//     }).catch(err => {
//         console.log(err)
//         throw new globalFunctions.https.HttpsError('unknown', 'Error creating team')
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