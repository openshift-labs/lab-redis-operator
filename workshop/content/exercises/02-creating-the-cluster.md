---
Title: Creating the Redis Enterprise Cluster
PrevPage: 01-operator-prerequisites
NextPage: 03-creating-the-database
---
### Create the Redis Enterprise Cluster

Set up a watch of pods created for the Redis Enterprise cluster:

```execute-2
watch oc get pods -l app=redis-enterprise
```

Create the Redis Enterprise cluster:

```execute-1
oc apply -f redis-cluster-simple.yaml
```

### Review the RedisEnterpriseCluster CRD

While you're waiting for the Redis Enterprise cluster to get up and running, let's take a look at what your sample Redis Enterprise Cluster CRD object definition looks like: 

```
apiVersion: "app.redislabs.com/v1alpha1"
kind: "RedisEnterpriseCluster"
metadata:
  name: "redis-enterprise"
spec:
  nodes: 1
  uiServiceType: LoadBalancer
  username: "admin@acme.com"
  redisEnterpriseNodeResources:
    limits:
      cpu: "1000m"
      memory: 4Gi
    requests:
      cpu: "500m"
      memory: 2Gi
  redisEnterpriseImageSpec:
    imagePullPolicy:  IfNotPresent
    repository:       redislabs/redis
    versionTag:       5.4.0-19.rhel7-openshift
  redisEnterpriseServicesRiggerImageSpec:
    imagePullPolicy:  IfNotPresent
    repository:       redislabs/k8s-controller
    versionTag:       109_5c9af60.rhel7
```

This file specifies what the Redis Enterprise cluster should look like. The name of the cluster is in the `metadata.name` field.  

Note that this CRD specifies that the number of nodes in the Redis Enterprise cluster should be `1`. This lab uses a single-node Redis Enterprise cluster in order to minimize resource usage, but in a real Redis cluster you should have at least 3 nodes. 

You can read more about the meaning and recommended values for the fields in the CRD in [this documentation](https://docs.redislabs.com/latest/rs/getting-started/k8s-openshift/#step-3-prepare-your-yaml-files). 

### Check Cluster Creation Progress

Let's check back in on your Redis Enterprise cluster. Once both the "rigger" pod and the `redis-enterprise-0` pod have been created, are running, and have 1/1 pods in READY state, then kill the watch. This typically takes about 1-2 minutes.

```execute-2
<ctrl+c>
```

Now you have a Redis Enterprise cluster up and running! Next, you'll create a database.
