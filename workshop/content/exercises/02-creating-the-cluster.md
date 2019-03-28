---
Title: Creating the Cluster
PrevPage: 01-operator-prerequisites
NextPage: ../finish
---

Set up a watch of pods created for the Redis cluster.

```execute-2
oc get pods -l app=redis-enterprise --watch
```

Create the Redis cluster.

```execute-1
oc apply -f redis-cluster.yaml
```

Wait for all four pods to be created, the "rigger" pod, and one pod for each replica, then kill the watch.

```execute-2
<ctrl+c>
```
