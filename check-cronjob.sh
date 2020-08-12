#!/bin/bash


set -x
set -e

# if [ `systemctl is-enabled speech_conversion` == "enabled" ]; then
if (systemctl is-active --quiet speech_conversion); then
    echo "true"
else
    echo "false"
fi
