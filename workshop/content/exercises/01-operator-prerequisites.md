---
Title: Operator Prerequisites
PrevPage: ../index
NextPage: 02-creating-the-cluster
---

### Installation Overview

The Redis Enterprise operator is installed into a project to monitor requests to create a Redis Enterprise Software cluster. The operator can only be deployed and set up by a cluster admin of the Redis cluster.

In this lab environment, the Redis Enterprise operator has been pre-installed into your project ready for use. The user you are running the workshop as, has also been delegated the appropriate roles to allow it to create a Redis Enterprise cluster.


### Verify Role Access to Create the Cluster

To validate that your user has been granted the appropriate roles, you can use the `oc auth can-i` command to see whether you can create the custom resource definition (CRD) objects the Redis Enterprise operator responds to.

The CRD object you need to create to request the creation of a Redis Enterprise cluster is the `redisenterprisecluster` object in the `app.redislabs.com` api group. To check that you can create this, run:

```execute
oc auth can-i create redisenterprisecluster.app.redislabs.com
```

If the response is `yes`, then you have the appropriate role access.

### Verify That the Operator is Deployed

You also need to verify that the Redis Enterprise operator has been deployed into your project. To check this, run:

```execute-1
oc rollout status deployment/redis-enterprise-operator
```

You should see a message:

```
deployment "redis-enterprise-operator" successfully rolled out
```

If the deployment hasn't yet completed, you will see progress messages as it starts up. Wait for the deployment to finish before proceeding.
