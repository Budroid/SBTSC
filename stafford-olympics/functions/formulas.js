const starColors = {
    10: "black",
    9: "brown",
    8: "blue",
    7: "green",
    6: "orange",
    5: "yellow",
    4: "white",
    0: ""
}

function getScore50(category, time) {
    let diff = time - (6 - ((category - 14) * 0.5))
    if (diff <= -0.5) {
        // 5 bonuspunten
        return 15;
        //return 10 + Math.floor(diff / -0.5)
    } else if (diff <= 0) {
        // Zwart of sneller, maar net geen bonuspunten
        return 10;
    } else {
        let points = 10 - Math.ceil(diff / 0.05)
        return points < 4 ? 0 : points
    }
}

function getScore100(category, time) {
    // let category = dogUtils.getCategory(hoogte)
    let diff = time - (10.5 - ((category - 14) * 0.5))
    if (diff <= -1) {
        // Sneller dan black,  bonuspunten toekennen
        return 15;

    } else if (diff <= 0) {
        // Zwart of sneller, maar geen bonuspunten
        return 10;
    } else {
        // Langzamer dan black, al dan niet starpoints toekennen
        let points = 10 - Math.ceil(diff / 0.1)
        return points < 4 ? 0 : points
    }
}

function getScoreLong(hoogte, afstand) {
    let t = afstand / hoogte;
    let x = 10 - Math.ceil((7.5 - t) / 0.3)
    let star = t >= 7.5 ? 10 : x
    star = star < 4 ? 0 : star;
    let result = {}
    result.points = t * star / 2.5;
    result.star = star;
    return result
}

function getScoreHigh(hoogte, afstand) {
    let t = afstand / hoogte;
    let x = 10 - Math.ceil((4.1 - t) / 0.1)
    let star = t >= 4.1 ? 10 : x
    star = star < 4 ? 0 : star;
    let result = {}
    result.points = t * star
    result.star = star;
    return result
}

function getScoreTow(tijd, win) {
    let result = {}
    tijd = win ? 20 : Math.floor(tijd)
    let star = 10 - Math.ceil((20 - tijd) / 3)
    star = star > 10 ? 10 : star;
    star = star < 4 ? 0 : star;
    result.points = star + tijd
    result.star = star;
    return result
}

function getScoreHangtime(tijd) {
    let result = {}
    tijd = Math.floor(tijd)
    let star = 10 - Math.ceil((20 - tijd) / 3)
    star = star > 10 ? 10 : star;
    star = star < 4 ? 0 : star;
    result.points = star + tijd
    result.star = star;
    return result
}

function getScoreAFrame(category, aantal) {
    // let category = dogUtils.getCategory(hoogte)
    let result = {}
    let base = 37 - (18 - category)
    let star = 10 - (base - aantal)
    star = star > 10 ? 10 : star;
    star = star < 4 ? 0 : star;
    result.points = star + parseInt(aantal)
    result.star = star;
    return result
}

function getScoreTrackmill(category, aantal) {
    // let category = dogUtils.getCategory(hoogte)
    let result = {}
    let base = 105 - ((18 - category) * 5)


    let star = 10 - Math.ceil((base - aantal) / 5)
    star = star > 10 ? 10 : star;
    star = star < 4 ? 0 : star;

    let points = 0;
    if (star != 0) {
        points = 15 + ((star - 4) * 5)
    }
    if (aantal - base > 0) {
        points += aantal - base
    }
    result.star = star
    result.points = star + points
    return result
}

function getScoreTenMile(category, minutes) {
    minutes = Math.ceil(minutes)
    // let category = dogUtils.getCategory(hoogte)

    let result = {}
    let limitForBlack = 48 + ((18 - category) * 3);
    let star = 10 - Math.ceil((minutes - limitForBlack) / 3);
    star = star > 10 ? 10 : star;
    star = star < 4 ? 0 : star;
    let points = 0;
    if (star != 0) {
        points = 45 - ((10 - star) * 5)
    }

    if (star == 10) {
        let extraPoints = limitForBlack - minutes
        points += extraPoints
    }

    result.star = star
    result.points = points + star
    return result
}

exports.calculatePointsAndStar = (score, eventId, cat, height, win = false) => {
    // exports.calculatePointsAndStar = () => {
    let points = 0
    let star = 0
    let result = {}
    switch (eventId) {
        case 1:
            points = getScore50(cat, score);
            star = points > 10 ? 10 : points;
            break;
        case 2:
            points = getScore100(cat, score);
            star = points > 10 ? 10 : points;
            break;
        case 3:
            points = getScore100(cat, score);
            star = points > 10 ? 10 : points;
            break;
        case 4:
            result = getScoreLong(height, score);
            points = result.points;
            star = result.star;
            break;
        case 5:
            result = getScoreHigh(height, score);
            points = result.points;
            star = result.star;
            break;
        case 6:
            result = getScoreTow(score, win);
            points = result.points;
            star = result.star;
            break;
        case 7:
            result = getScoreHangtime(score);
            points = result.points;
            star = result.star;
            break;
        case 8:
            result = getScoreAFrame(cat, score);
            points = result.points;
            star = result.star;
            break;
        case 9:
            result = getScoreTrackmill(cat, score);
            points = result.points;
            star = result.star;
            break;
        case 10:
            result = getScoreTenMile(cat, score);
            points = result.points;
            star = result.star;
            break;
        default: 0;
    }

    return {
        points: points,
        star: starColors[star]
    };
};