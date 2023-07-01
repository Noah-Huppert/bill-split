FROM node:20.3.1-slim

ARG CONTAINER_UID=1000
RUN deluser node && rm -rf /home/node
RUN groupadd --gid ${CONTAINER_UID} frontend
RUN useradd --non-unique --uid ${CONTAINER_UID} --gid ${CONTAINER_UID} --create-home frontend

RUN mkdir /opt/frontend
RUN chown -R ${CONTAINER_UID}:${CONTAINER_UID} /opt/frontend
WORKDIR /opt/frontend
USER frontend

RUN echo "export PS1='\h:\w\$ '" | tee /home/frontend/.profile | tee /home/frontend/.bashrc

ENTRYPOINT ["/opt/frontend/scripts/docker-dev-entrypoint.sh"]
