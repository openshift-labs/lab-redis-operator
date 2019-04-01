---
Title: Creating the Cluster
PrevPage: 01-operator-prerequisites
NextPage: 03-creating-the-database
---

Set up a watch of pods created for the Redis cluster.

```execute-2
oc get pods -l app=redis-enterprise --watch
```

Create the Redis cluster.

```execute-1
oc apply -f redis-cluster-simple.yaml
```

Wait for all four pods to be created, the "rigger" pod, and one pod for each replica, then kill the watch. This typically takes about 4-5 minutes.

```execute-2
<ctrl+c>
```
