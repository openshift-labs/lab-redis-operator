---
Title: Scaling Your Redis Enterprise Cluster
PrevPage: 04-using-redis-in-an-app
NextPage: ../finish
---

### Revisit the `RedisEnterpriseCluster` Spec

The Redis Enterprise operator makes it easy to scale up your Redis Enterprise cluster if needed.

You may recall that earlier in the lab, you saw that in the spec for the `RedisEnterpriseCluster` object definition, the number of nodes was set to 1. Here's a snippet of the `redis-cluster-simple.yaml` file:

```
apiVersion: "app.redislabs.com/v1alpha1"
kind: "RedisEnterpriseCluster"
metadata:
  name: "redis-enterprise"
spec:
  nodes: 1
...
```

### Scale Up the Redis Enterprise Cluster

To scale your Redis Enterprise cluster from 1 to 3 nodes, all you need to do is update the number of nodes in the spec. 

First, execute a watch in the lower terminal, so you can see what happens after you apply the change:

```execute-2
oc get pods -l app=redis-enterprise --watch
```

Next, we'll edit the redis-cluster-simple.yaml file:

```execute-1
nano ~/redis-cluster-simple.yaml
```

Change `nodes: 1` to `nodes: 3` and then press *^O* to save, *return* to accept the existing file name, and *^X* to exit.

Apply the changes:

```execute-1
oc apply -f ~/redis-cluster-simple.yaml
```

In the bottom terminal, you should see additional pods start to be created for the new nodes in your Redis Enterprise cluster.

## Summary

Now that you've completed this lab, you should be familiar with:
* How to create a Redis Enterprise cluster using the Redis Enterprise operator
* How to create a Redis database and add and retrieve data using `redis-cli`
* How to use a Redis database in a Node.js application
* The basics of how the Redis Enterprise operator handles scaling in a Redis Enterprise cluster

Continue to the next page for more resources on OpenShift, Operators, and Redis.


