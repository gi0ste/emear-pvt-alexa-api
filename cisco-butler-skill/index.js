const Alexa = require('ask-sdk-core');
const axios = require('axios')
const shortid = require('shortid')
const config = require('./configurl.json');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var DEBUG                       = true; // flip to activate debug logging


// --[ Initial Request ]-------------------------------------------------
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, I am your Cisco Butler. Today I support listing all tenants in Cloud Center Suite.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard(
                "Welcome to Cisco Butler",
                "Today I support listing all tenants in Cloud Center Suite.")
            .getResponse();
    }
};

// --[ SECTION 2 Custom Intent Handler ] ----------------------------------------------------------------------
// Custom Intent Request to handle the intents configured in the Interaction model. For each of
// the intent you've configured, make sure you have a valid handler.


/**
 * ***************************************************************************************
 * Lab Exercise 1: CCS: Create a simple skill to list available tenants
 * ***************************************************************************************
 * This is the first excercise of the Alexa/Cisco lab. Just remove the comment
 * Do the following:
 *  1: Remove the comment below
 *  2: Make sure to add the TenantInfoIntent to the list of handler managed by this skill
 *  3: Implement the TenantInfoIntent in the design phase
 *
// --[ TenantInfoIntent ]-------------------------------------------------
const TenantInfoIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
        && request.intent.name === 'TenantInfoIntent';

    },
   async handle(handlerInput) {
        const speechText = 'Here is the list of tenants';
        //const response = await httpGet(CCSTENANTPATH);
        console.log("URL" + config.CCS_TENANT_PATH)
        const tenants = await makeGetRequest( config.CCS_HOST_URL + config.CCS_TENANT_PATH, config.CCS_USERNAME, config.CCS_USERNAME_APY_KEY)
        console.log("=======> [TenantIntentHandler] So, here are the tenants" +  JSON.stringify(tenants, null, 2))
        console.log('[ListTenantIntent]:' + tenants.length);
        return handlerInput.responseBuilder
            .speak(`Okay. Here is what I got back from my request. You have ${tenants.length} tenants`)
            .reprompt("Ask me to list all my action in CWOM")
            .getResponse();
    }
};
*/ // Remove this line to implement this excercise



/**
 * ***************************************************************************************
 * Lab Exercise 2: CCS: Get a list of configured clouds
 * ***************************************************************************************
 * This is the first excercise of the Alexa/Cisco lab. Just remove the comment
 * Do the following:
 *  1: Remove the comment below
 *  2: Make sure to add the CloudInfoIntent to the list of handler managed by this skill
 *  3: Implement the CloudInfoIntent in the design phase
 *
// --[ CloudInfoIntent ]-------------------------------------------------
const CloudInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'CloudInfoIntent';
    },
    async handle(handlerInput) {
        try {
            const response = await makeGetRequest(config.CCS_HOST_URL + config.CCS_CLOUD_PATH, config.CCS_USERNAME, config.CCS_USERNAME_APY_KEY);
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
*/ // Remove this line to implement this excercise

/**
 * ***************************************************************************************
 * Lab Exercise 3: CWOM: Get a list of recommendations from Datacenter
 * ***************************************************************************************
 * This is the second excercise of the Alexa/Cisco lab. Just remove the comment
 * Do the following:
 *  1: Remove the comment below
 *  2: Make sure to add the ActionsIntentIntentHandler to the list of handler managed by this skill
 *  3: Implement the ActionIntent in the design phase
 *
// --[ ActionsIntent ]-------------------------------------------------
const ActionsIntentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ActionsIntent';
    },
    async handle(handlerInput) {
        try {
            const response = await makePostRequest(config.CWOM_HOST_URL + config.CWOM_ACTION_STATS, config.CWOM_USERNAME, config.CWOM_USERNAME_APY_KEY, "{}");
            var speechText = `You have ${response[0].statistics[0].value} actions: `;
            speechText += `You can have a one time Estimated Savings of ${response[0].statistics[1].value} USD `
            speechText += `and one time Estimated Cost of ${response[0].statistics[3].value} USD`
            console.log(`Speech Text: ${speechText}`)

            // var speechText = "yup"
            return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('Inspiration', speechText)
                .reprompt("Anything else?")
                .getResponse();
        } catch (error) {
            console.error(error);
        }
    }
};
*/ // Remove this line to implement this excercise


// --[ CostReportIntent ]-------------------------------------------------
const CostReportIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'CostReportIntent';
    },

    async handle(handlerInput) {
        try {
            var speechText = 'Here is how much you\'ve spent: ';
            var cloudCostArray = [];
            const remoteResponse = await makeGetRequest(config.CCS_HOST_URL + config.CCS_COST_PATH, config.CCS_USERNAME, config.CCS_USERNAME_APY_KEY);

            // @todo - This cloud be place in a separate function
            for (var i = 0; i < remoteResponse.details.length; i++) {
                speechText += `${roundUp( remoteResponse.details[i].cost, 0)}  ${remoteResponse.currency} with ${remoteResponse.details[i].cloudFamily} <break time= "50ms"/>`;
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

/**
 * ***************************************************************************************
 * Lab Exercise 4: CCS: Deploy a DB in AWS or GCP
 * ***************************************************************************************
 * This is the third  excercise of the Alexa/Cisco lab. Just remove the comment
 * Do the following:
 *  1: Remove the comment below
 *  2: Make sure to add the deployDBIntentHandler to the list of handler managed by this skill
 *  3: Implement the deployDBIntent in the design phase
 *
// --[ DeployDBIntent ]-------------------------------------------------
*
const DeployDBIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
        && request.intent.name === 'DeployDBIntent';
    },
   async handle(handlerInput) {
    try {
        const cloudType  = handlerInput.requestEnvelope.request.intent.slots.cloud.resolutions.resolutionsPerAuthority[0].values[0].value.id
        //const dbType    =  getSlotValue(handlerInput.requestEnvelope, 'dbType');
        const dbType     = handlerInput.requestEnvelope.request.intent.slots.dbType.resolutions.resolutionsPerAuthority[0].values[0].value.id
        console.log(`Selected cloud type is ${cloudType} and DB type is ${dbType}`)

        const deployName = `${dbType}_${shortid.generate()}_Alexa`
        var jsonDB = require(`./deploy/${dbType}_deploy_${cloudType}.json`)

        jsonDB.name = deployName
        console.log("json require:" + JSON.stringify(jsonDB))
        const response = await makePostRequest(config.CCS_HOST_URL + config.CCS_DEPLOY_PATH, config.CCS_USERNAME, config.CCS_USERNAME_APY_KEY, jsonDB )
        handlerInput.responseBuilder
            .speak(`Okay. Your ${dbType} database is deploying in ${cloudType}.`)
    } catch(e) {
        console.log("Sadly, Something goes wrong:" + e)
        console.log("Sadly, Something goes wrong with msg:" + e.message)
        handlerInput.responseBuilder
            .speak(`Ho no, ${e}` )
    }
    return handlerInput.responseBuilder
            .getResponse();
    }
}; */ // Remove this line to implement this excercise


// --[ SECTION 3 Custom Functions ----------------------------------------------------------------------

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

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
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

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
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

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        //TenantInfoIntentHandler,
        //CloudInfoIntentHandler,
        //ActionsIntentIntentHandler,
        CostReportIntentHandler,
        //DeployDBIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
