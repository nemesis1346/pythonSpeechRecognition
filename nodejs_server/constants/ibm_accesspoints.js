if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '../.env.production' }) // for other environments
} else {
    require('dotenv').config({ path: '../.env.development' })
}

module.exports = {
    DALLAS: "https://api.us-south.speech-to-text.watson.cloud.ibm.com",
    WASHINGTON: "https://api.us-east.speech-to-text.watson.cloud.ibm.com",
    FRANKFURT: "https://api.eu-de.speech-to-text.watson.cloud.ibm.com",
    SYDNEY: "https://api.au-syd.speech-to-text.watson.cloud.ibm.com",
    TOKYO: "https://api.jp-tok.speech-to-text.watson.cloud.ibm.com",
    LONDON: "https://api.eu-gb.speech-to-text.watson.cloud.ibm.com",
    SEOUL: "https://api.kr-seo.speech-to-text.watson.cloud.ibm.com"
}