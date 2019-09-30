const Alexa     = require('ask-sdk-core');
const axios     = require('axios')
const shortid   = require('shortid')
const myConfig  = require('./configurl')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var DEBUG                       = true; // flip to activate debug logging


// --[ Initial Request ]-------------------------------------------------
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, I am your Cisco Butler. As of today, I support Cloud Center Suite: so you can ask me about how many clouds are configured';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// --[ SECTION 2 Custom Intent Handler ] ----------------------------------------------------------------------
// Custom Intent Request to handle the intents configured in the Interaction model. For each of
// the intent you've configured, make sure you have a valid handler.

// --[ CloudInfoIntent ]-------------------------------------------------
const CloudInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'CloudInfoIntent';
    },
    async handle(handlerInput) {
        try {
            const response = await makeGetRequest( myConfig.CCS_HOST_URL + myConfig.CCS_CLOUD_PATH, myConfig.CCS_USERNAME, myConfig.CCS_USERNAME_APY_KEY);
            var speechText = `Okay. You have ${response.clouds.length} clouds: `;
            for (var i = 0; i < response.clouds.length; i++) {
                speechText += `${response.clouds[i].cloudFamily}, configured as ${response.clouds[i].name},`;
            }
            return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('Inspiration', speechText)
                .getResponse();
        } catch (error) {
            console.error(error);
        }
    }
};


// --[ ActionsIntent ]-------------------------------------------------
const ActionsIntentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ActionsIntent';
    },
    async handle(handlerInput) {
        try {
            const response = await makePostRequest(myConfig.CWOM_HOST_URL + myConfig.CWOM_ACTION_STATS, myConfig.CWOM_USERNAME, myConfig.CWOM_USERNAME_APY_KEY, "{}");
            var speechText = `Okay. You have ${response[0].statistics[0].value} actions: wow you should have a look `;
            speechText += `You can have a one time Estimated Savings of ${response[0].statistics[1].value} USD `
            speechText += `and one time Estimated Cost of ${response[0].statistics[3].value} USD`
            console.log(`Speech Text: ${speechText}`)

            // var speechText = "yup"
            return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('Inspiration', speechText)
                .getResponse();
        } catch (error) {
            console.error(error);
        }
    }
};


// --[ CostReportIntent ]-------------------------------------------------
const CostReportIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'CostReportIntent';
    },

    async handle(handlerInput) {
        try {
            var speechText = 'Okay, here is the details.';
            var cloudCostArray = [];
            const remoteResponse = await makeGetRequest(myConfig.CCS_HOST_URL + myConfig.CCS_COST_PATH, myConfig.CCS_USERNAME, myConfig.CCS_USERNAME_APY_KEY);

            // @todo - This cloud be place in a separate function
            for (var i = 0; i < remoteResponse.details.length; i++) {
                speechText += `${roundUp( remoteResponse.details[i].cost, 2)}  ${remoteResponse.currency} with ${remoteResponse.details[i].cloudFamily} <break time= "50ms"/>`;
                DEBUG && console.log('------------------------>' + speechText)
                DEBUG && console.log('------------------------> Completed cycle ' + i)
            }

            DEBUG && console.log('------------------------> cloudCostArray is: ' + JSON.stringify(cloudCostArray));
            return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('Inspiration', speechText)
                .getResponse();
        } catch (error) {
            console.error(error);
        }
    }
}

// --[ SECTION 3 Custom Functions ----------------------------------------------------------------------
/**
 * 
 * @param {*} pURL The URL to connect
 * @param {*} pUserName A username to handle BASIC Authentication
 * @param {*} pPassword A password used to handle BASIC Authentication
 */
const makeGetRequest = async (pURL, pUserName, pPassword) => {
  DEBUG && console.log("pURL:" + pURL)
  try {
    var options = {
            auth: {
                username: pUserName,
                password: pPassword
            }
        }
    const { data } = await axios.get('https://' + pURL, options);
    console.log("Data received: " + JSON.stringify(data, null, 2) )
    return data;
  } catch (error) {
    console.error('cannot fetch data', error);
  }
};

/**
 * 
 * @param {*} pURL The URL to connect
 * @param {*} pUserName A username to handle BASIC Authentication
 * @param {*} pPassword A password used to handle BASIC Authentication
 * @param {*} pData A JSON file passed as the body request
 */
const makePostRequest = async (pURL, pUserName, pPassword, pData) => {
    console.log("pURL:" + pURL)
    try {
        var options = {
            auth: {
                username: pUserName,
                password: pPassword
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(`===[ \nReady to make a POST to URL: ${pURL}, \nUsername: ${pUserName}, \nwith ${pPassword} password\n and with data ${pData}`)

        let res = await axios.post('https://' + pURL, pData, options);

        DEBUG && console.log(`Status code: ${res.status}`);
        DEBUG && console.log(`Status text: ${res.statusText}`);
        DEBUG && console.log(`Request method: ${res.request.method}`);
        DEBUG && console.log(`Path: ${res.request.path}`);
        DEBUG && console.log(`Date: ${res.headers.date}`);
        DEBUG && console.log(`Data: ${res.data}`);

        console.log("Data received: " + JSON.stringify(res.data, null, 2))
        return res.data;
    } catch (error) {
        console.error('cannot fetch data', error);
    }
};

/**
 *
 * @param {*} num The number to round
 * @param {*} precision The number of decimal places to preserve
 */
function roundUp(num, precision) {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

// --[ SECTION 4 Default Alexa Intent Handler ] ----------------------------------------------------------------------

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CloudInfoIntentHandler,
        ActionsIntentIntentHandler,
        CostReportIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();