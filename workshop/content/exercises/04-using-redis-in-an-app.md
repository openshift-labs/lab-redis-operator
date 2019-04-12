---
Title: Using Redis in an Application
PrevPage: 03-creating-the-database
NextPage: 05-scaling
---

### Overview of the Application

We've included a very simple Node.js application that uses the [`redis` module](https://www.npmjs.com/package/redis) to connect to your Redis database and allows the user to get and set information. Let's look at how it works.

First cd to the `app` directory:

```execute-1
cd ~/app
```

The main file for your application is `index.js`. There are a couple environment variables you can use to specify the hostname and port for the Redis database that you want to connect to.

```
const redisPort = process.env.REDIS_PORT ||
                  12000;
const hostname  = process.env.REDIS_HOST ||
                  'localhost';
const client    = redis.createClient(redisPort, 
                  hostname,
                  {no_ready_check: true});
```

You can use the default value for the port, but you do need to set `REDIS_HOST`:

```execute-1
export REDIS_HOST=sample-db.%project_namespace%.svc.cluster.local
```

Depending on what the user enters, the app will call either `client.set()` or `client.get()` as seen in this section of the app's code:

```
if (result.action === "set") {
  prompt.get(setSchema, function (err, result) {
    client.set(result.name, result.animal);
    console.log(colors.cyan("You entered: " +
                result.name + ": " +
                result.animal));
    startPrompt();
  });
} else if (result.action === "get"){
  prompt.get(getSchema, function(err, result) {
    client.get(result.name, function(err, reply) {
      if (reply === null) {
        console.log("No value found for " + 
                    result.name);
      } else {
          console.log(result.name +
                      " is a/an " +
                      reply);
      }
      startPrompt();
    });

  });
} else {
  process.exit();
}
```

### Run the Application

Let's give it a try! First execute `npm install`:

```execute-1
npm install
```

Once that completes, run `npm start` to launch the app:

```execute-1
npm start
```

You should see output similar to this:

```
> app@1.0.0 start /opt/app-root/src/app
> node index.js

Pet Names><Action to take: get, set, or stop><
```

Now, let's interact with the app by adding an entry for a cat named "Mordecai":
```execute-1
set
```

```execute-1
Mordecai
```

```execute-1
cat
```

Next, let's ask the app what kind of animal Mordecai is:
```execute-1
get
```

```execute-1
Mordecai
```

Finally, enter "stop" to exit the app.
```execute-1
stop
```

The final step in this lab will be to scale up your Redis Enterprise cluster from 1 to 3 nodes.

