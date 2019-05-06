const colors = require("colors/safe");
const prompt = require("prompt");
const redis = require('redis');

const redisPort = process.env.REDIS_PORT || 12000;
const hostname = process.env.REDIS_HOST || 'localhost';
const client = redis.createClient(redisPort, hostname, {no_ready_check: true});

var actionSchema = {
    properties: {
        action: {
            pattern: /^set|get|stop$/,
            message: 'Action must be set, get, or stop.',
            required: true,
            description: 'Action to take: get, set, or stop'
        },
    }
};

var setSchema = {
    properties: {
      name: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Pet names can only contain alpha characters and "-"',
        required: true,
        description: 'Enter pet name'
      },
      animal: {
        pattern: /^[a-zA-Z\-\s]+$/,
        message: 'Valid animals can only contain alpha characters, "-" and spaces.',
        required: true,
        description: 'Enter animal type'
      }
    }
  };

  var getSchema = {
    properties: {
      name: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Pet names can only contain alpha characters and "-"',
        required: true,
        description: 'Enter pet name'
      }
    }
  };

  prompt.start();
  startPrompt();

  function startPrompt () {
    prompt.message = colors.magenta("Pet Names");
    prompt.delimiter = colors.green("><");
    prompt.description = colors.cyan();
    prompt.get(actionSchema, function (err, result) {
        if (err) {
            console.log(colors.red("Oops! Something went wrong. "+ err));
        } else {
            if (result.action.trim() === "set") {
                prompt.get(setSchema, function (err, result) {
                    client.set(result.name, result.animal);
                    console.log(colors.cyan("You entered: " + result.name + ": " + result.animal));
                    startPrompt();
                });
            } else if (result.action.trim() === "get"){
                prompt.get(getSchema, function(err, result) {
                    client.get(result.name, function(err, reply) {
                        if (reply === null) {
                            console.log("No value found for " + result.name);
                        } else {
                            console.log(result.name + " is a " + reply);
                        }
                        startPrompt();
                    });

                });
            } else {
                process.exit();
            }
        }
  });
}

client.on('error', function(err) {
    console.log('Something went wrong ' + err);
});
