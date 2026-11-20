#!/bin/sh
set -eu

root="${HOME}/DockerData/schoolerp"
mkdir -p "${root}/postgres" "${root}/redis" "${root}/minio"
echo "Docker data directories are ready under ${root}"
