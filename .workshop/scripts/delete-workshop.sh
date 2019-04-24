#!/bin/bash

set -x
set -eo pipefail

WORKSHOP_NAME=lab-redis-operator
JUPYTERHUB_APPLICATION=${JUPYTERHUB_APPLICATION:-redis-lab}
JUPYTERHUB_NAMESPACE=`oc project --short`

oc delete all --selector build="$WORKSHOP_NAME"
