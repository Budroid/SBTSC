const nameRules=  [(v) => !!v || "Name is required"]
const teamNameRules=  [
  (v) => !!v || "What's the name for this team?",
  (v) => v.length > 2 || "Teamname must be at least 3 characters",
]


const heightRules =  [
  (v) => !!v || "Height is required",
  (v) =>
    (v && /^-?\d+(\.\d+)?$/.test(v)) ||
    "Height must be like 42 or 40.6 (dot, no comma)",
]

const chipnumberRules=  [
  (v) => !!v || "Chipnumber is required",
  (v) => (v && v.length >= 6) || "Invalid chipnumber",
]

export {nameRules, teamNameRules, heightRules, chipnumberRules}