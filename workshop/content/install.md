---
Sort: 2
Title: Installing the Operator
---

Before this workshop can be used in an OpenShift cluster, a cluster role, security context constraint and custom resource definitions for the Redis operator must first be created. The Redis operator itself is not installed, as that needs to be deployed to each project where it is required. It cannot be installed globally to monitor all projects.

The steps below are not part of what a developer wanting to deploy a Redis cluster needs to do, and they are not displayed as part of the workshop steps. The steps below will need though to be run once by someone with cluster admin access to the OpenShift cluster.

For original details on installing the Redis operator, see the documentation at:

* https://github.com/RedisLabs/redis-enterprise-k8s-docs

Note that the instructions here, and the files used from the Redis operator package, may have been customised because of how the workshop environment works.

### Login as a cluster admin

The workshop when deployed through the learning portal configuration provides a session using a service account with limited access to a single project. To setup the Redis operator, you will need to login to the OpenShift cluster as a user with cluster admin access. For RHPDS, this will be the `opentlc-mgr` user.

```execute
oc login
```

### Create a cluster role

The Redis operator will be deployed to each project where a Redis cluster is to be created. It will need specific roles to access resources it needs. Create a global cluster role definition. This will later be applied to a service account created in each project, where the Redis operator runs as that service account.

```execute
oc apply -f - << !
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: redis-enterprise-operator
rules:
- apiGroups: ["", "extensions", "apps", "rbac.authorization.k8s.io", "policy"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups:
  - app.redislabs.com
  resources: ["*"]
  verbs: ["*"]
- apiGroups:
  - route.openshift.io
  resources: ["routes", "routes/custom-host"]
  verbs: ["*"]
!
```

Note that the Redis operator installation documentation says to create this as a role in each project. In the workshop it is better and easier to define it once as a cluster role as then admin of a project can't modify it.

### Create custom resource definitions

The Redis operator is controlled through custom resource definitions (CRDs), but although the operator is deployed in each project it is to be used, the CRDs must be installed globally.

```execute
oc apply -f redis-enterprise-k8s-docs/crd.yaml
```

### Create custom security context constraint

The Redis operator image can't run as an arbitrary user ID, and needs access to Linux kernel capability ``CAP_SYS_RESOURCE``. It is neccessary to create a custom security context constraint to allow it to run as its required user ID and with the special kernel access.

```execute
oc apply -f redis-enterprise-k8s-docs/scc.yaml
```

XXX This is going to be a problem, as have to insert service accounts into users list of this later. Can't just create a new SCC resources.

### Grant users Redis admin rights

The service account a user works through, when a workshop is deployed through the learning portal configuration, will not have any ability to create Redis clusters. This is because by default, only cluster admins can create the required custom resource definitions that will trigger the creation of a Redis cluster. In order that a workshop user when using this configuration can create Redis clusters, they need to be granted additional cluster roles.

Presuming that the workshop is already deployed through the learning portal configuration, and additional cluster policy rules have not been added, run:

```execute
oc patch clusterrole %jupyterhub_application%-%jupyterhub_namespace%-session-rules --patch '
rules:
- apiGroups:
  - app.redislabs.com
  resources:
  - "*"
  verbs:
  - "*"
'
```

Note that can't see where Redis operator documentation says you need to do this, unless it is assumed that an admin will always provision the Redis cluster in the project.

### Installation of the operator

The Redis operator needs to be deployed into the project for each user doing the workshop. Rather than the user doing this, it will be created automatically when the project is created. To do this, the list of extra resources to create in each project needs to be defined. To add these run:

XXX Following will not work, as can't replace the SCC, we somehow need to add the service account to the users list of the existing SCC, and remove when done.

```execute
oc patch configmap %jupyterhub_application%-cfg -n %jupyterhub_namespace% --patch '
data:
  extra_resources.json: |-
    {
      "kind": "List",
      "apiVersion": "v1",
      "items": [
        {
          "kind": "ServiceAccount",
          "apiVersion": "v1",
          "metadata": {
            "name": "redis-enterprise-operator"
          }
        },
        {
          "kind": "RoleBinding",
          "apiVersion": "rbac.authorization.k8s.io/v1",
          "metadata": {
            "name": "redis-enterprise-operator"
          },
          "subjects": [
            {
              "kind": "ServiceAccount",
              "name": "redis-enterprise-operator",
              "namespace": "${project_namespace}"
            }
          ],
          "roleRef": {
            "kind": "ClusterRole",
            "apiGroup": "rbac.authorization.k8s.io",
            "name": "redis-enterprise-operator"
          }
        },
        {
          "apiVersion": "apps/v1beta1",
          "kind": "Deployment",
          "metadata": {
            "name": "redis-enterprise-operator"
          },
          "spec": {
            "replicas": 1,
            "selector": {
              "matchLabels": {
                "name": "redis-enterprise-operator"
              }
            },
            "template": {
              "metadata": {
                "labels": {
                  "name": "redis-enterprise-operator"
                }
              },
              "spec": {
                "serviceAccount": "redis-enterprise-operator",
                "containers": [
                  {
                    "name": "redis-enterprise-operator",
                    "image": "redislabs/operator:498_f987b08",
                    "command": [
                      "redis-enterprise-operator"
                    ],
                    "imagePullPolicy": "Always",
                    "env": [
                      {
                        "name": "WATCH_NAMESPACE",
                        "valueFrom": {
                          "fieldRef": {
                            "fieldPath": "metadata.namespace"
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      ]
    }
'
```

XXX This is the SCC we can't add, as actually need to add entry to users.

```
{
    "kind": "SecurityContextConstraints",
    "apiVersion": "security.openshift.io/v1",
    "metadata": {
        "name": "redis-enterprise-scc"
    },
    "allowedCapabilities": [
        "SYS_RESOURCE"
    ],
    "seLinuxContext": {
        "type": "RunAsAny"
    },
    "runAsUser": {
        "type": "RunAsAny"
    },
    "users": [
        "system:serviceaccount:${project_namespace}:redis-enterprise-operator"
    ]
},
```

As the resources include cluster role bindings, and security context constraints, we need to update the policy rules for the spawner cluster role so it can bind those cluster roles against the service account, and add the security context constraints, in the project.

```execute
oc patch clusterrole %jupyterhub_application%-%jupyterhub_namespace%-spawner-rules --patch '
rules:
- apiGroups:
  - ""
  - authorization.openshift.io
  - rbac.authorization.k8s.io
  resourceNames:
  - redis-enterprise-operator
  resources:
  - clusterroles
  verbs:
  - bind
- apiGroups:
  - ""
  - security.openshift.io/v1
  resources:
  - "*"
  verbs:
  - "*"
'
```

### Restarting the workshop spawner

You will now need to restart the learning portal to pick up the new roles. This will cause this workshop session to be killed, so you will need to restart to test the result.

```execute
oc rollout latest %jupyterhub_application% -n %jupyterhub_namespace%
```
