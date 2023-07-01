FROM node:20.3.1-slim

ARG CONTAINER_UID=1000
RUN deluser node && rm -rf /home/node
RUN groupadd --gid ${CONTAINER_UID} api
RUN useradd --non-unique --uid ${CONTAINER_UID} --gid ${CONTAINER_UID} --create-home api

RUN mkdir /opt/api
RUN chown -R ${CONTAINER_UID}:${CONTAINER_UID} /opt/api
WORKDIR /opt/api
USER api

RUN echo "export PS1='\h:\w\$ '" | tee /home/api/.profile | tee /home/api/.bashrc

ENTRYPOINT ["/opt/api/scripts/docker-dev-entrypoint.sh"]
